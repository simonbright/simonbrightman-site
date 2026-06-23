(function () {
  var prose = document.getElementById('article-prose');
  var readTimeEl = document.getElementById('read-time');
  var listenBtn = document.getElementById('listen-btn');
  var pauseBtn = document.getElementById('pause-btn');
  var stopBtn = document.getElementById('stop-btn');
  var statusEl = document.getElementById('listen-status');

  if (!prose) return;

  var WORDS_PER_MINUTE = 225;
  var TTS_ENDPOINT = '/.netlify/functions/tts';
  var CHUNK_SIZE = 320;
  var VOICE = 'en-US-AndrewMultilingualNeural';
  var PREFETCH_AHEAD = 1;
  var MAX_RETRIES = 2;

  var audioQueue = [];
  var articleChunks = [];
  var totalChunks = 0;
  var currentAudio = null;
  var chunkIndex = 0;
  var isPaused = false;
  var isLoading = false;
  var useFallback = false;
  var bufferTimer = null;
  var loadingMessageTimers = [];
  var prefetching = {};

  function getArticleText() {
    return prose.innerText.replace(/\s+/g, ' ').trim();
  }

  function updateReadTime() {
    if (!readTimeEl) return;
    var words = getArticleText().split(/\s+/).filter(Boolean).length;
    var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    readTimeEl.textContent = minutes + ' min read';
  }

  function setStatus(msg) {
    if (!statusEl) return;
    if (msg) {
      statusEl.textContent = msg;
      statusEl.hidden = false;
    } else {
      statusEl.textContent = '';
      statusEl.hidden = true;
    }
  }

  function clearLoadingMessageTimer() {
    loadingMessageTimers.forEach(clearTimeout);
    loadingMessageTimers = [];
  }

  function showStartupMessages() {
    clearLoadingMessageTimer();
    setStatus('Preparing audio — hang tight, this takes a few seconds.');
    loadingMessageTimers.push(setTimeout(function () {
      if (isLoading) {
        setStatus('Still preparing — thanks for waiting, almost there.');
      }
    }, 4000));
    loadingMessageTimers.push(setTimeout(function () {
      if (isLoading) {
        setStatus('Nearly ready — appreciate your patience.');
      }
    }, 12000));
  }

  function chunkText(text, maxLen) {
    var sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
    var chunks = [];
    var buf = '';

    sentences.forEach(function (sentence) {
      if ((buf + sentence).length > maxLen && buf) {
        chunks.push(buf.trim());
        buf = sentence;
      } else {
        buf += sentence;
      }
    });
    if (buf.trim()) chunks.push(buf.trim());
    return chunks;
  }

  function showControls(playing) {
    if (listenBtn) listenBtn.classList.toggle('hidden', playing);
    if (pauseBtn) pauseBtn.classList.toggle('hidden', !playing);
    if (stopBtn) stopBtn.classList.toggle('hidden', !playing);
  }

  function clearBufferTimer() {
    if (bufferTimer) {
      clearInterval(bufferTimer);
      bufferTimer = null;
    }
  }

  function resetSpeech() {
    clearBufferTimer();
    clearLoadingMessageTimer();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    audioQueue.forEach(function (url) {
      if (url && typeof url === 'string' && url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(url);
      }
    });
    audioQueue = [];
    articleChunks = [];
    totalChunks = 0;
    chunkIndex = 0;
    isPaused = false;
    isLoading = false;
    useFallback = false;
    prefetching = {};
    window.speechSynthesis.cancel();
    showControls(false);
    if (listenBtn) listenBtn.disabled = false;
    if (pauseBtn) pauseBtn.textContent = 'Pause';
    setStatus('');
  }

  function fetchAudioBlob(text) {
    return fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, voice: VOICE }),
    }).then(function (res) {
      if (!res.ok) throw new Error('TTS request failed (' + res.status + ')');
      var type = res.headers.get('Content-Type') || '';
      if (type.indexOf('audio') === -1) throw new Error('TTS returned non-audio response');
      return res.blob();
    });
  }

  function fetchChunkWithRetry(text, attempt) {
    attempt = attempt || 0;
    return fetchAudioBlob(text).catch(function (err) {
      if (attempt < MAX_RETRIES) {
        setStatus('Retrying audio (' + (attempt + 2) + '/' + (MAX_RETRIES + 1) + ')…');
        return new Promise(function (resolve) {
          setTimeout(resolve, 1500 * (attempt + 1));
        }).then(function () {
          return fetchChunkWithRetry(text, attempt + 1);
        });
      }
      throw err;
    });
  }

  function chunkReady(index) {
    var entry = audioQueue[index];
    return entry && typeof entry === 'string' && entry.indexOf('blob:') === 0;
  }

  function prefetchChunk(index) {
    if (index >= totalChunks || chunkReady(index) || prefetching[index]) return;

    prefetching[index] = true;
    fetchChunkWithRetry(articleChunks[index]).then(function (blob) {
      audioQueue[index] = URL.createObjectURL(blob);
      prefetching[index] = false;
    }).catch(function () {
      audioQueue[index] = null;
      prefetching[index] = false;
    });
  }

  function prefetchAhead(fromIndex) {
    for (var i = 0; i < PREFETCH_AHEAD; i += 1) {
      prefetchChunk(fromIndex + i);
    }
  }

  function waitForChunk(index, callback) {
    if (chunkReady(index)) {
      callback();
      return;
    }
    setStatus('Loading next section…');
    clearBufferTimer();
    var attempts = 0;
    bufferTimer = setInterval(function () {
      if (chunkReady(index)) {
        clearBufferTimer();
        callback();
        return;
      }
      if (audioQueue[index] === null) {
        attempts += 1;
        if (attempts === 1) {
          setStatus('Retrying section…');
          prefetching[index] = false;
          prefetchChunk(index);
        } else if (attempts > 40) {
          clearBufferTimer();
          callback();
        }
      }
    }, 250);
  }

  function playChunkAt(index) {
    currentAudio = new Audio(audioQueue[index]);
    currentAudio.onended = function () {
      chunkIndex += 1;
      playNextChunk();
    };
    currentAudio.onerror = function () {
      chunkIndex += 1;
      playNextChunk();
    };

    setStatus('');
    currentAudio.play().catch(function () {
      resetSpeech();
    });
  }

  function playNextChunk() {
    if (chunkIndex >= totalChunks) {
      resetSpeech();
      return;
    }

    prefetchAhead(chunkIndex);

    waitForChunk(chunkIndex, function () {
      if (!chunkReady(chunkIndex)) {
        setStatus('Skipped unavailable section');
        chunkIndex += 1;
        playNextChunk();
        return;
      }
      playChunkAt(chunkIndex);
    });
  }

  function streamChunks(chunks) {
    articleChunks = chunks;
    totalChunks = chunks.length;
    audioQueue = new Array(totalChunks);
    chunkIndex = 0;
    isLoading = true;
    showStartupMessages();
    if (listenBtn) listenBtn.disabled = true;

    return fetchChunkWithRetry(chunks[0]).then(function (blob) {
      audioQueue[0] = URL.createObjectURL(blob);
      isLoading = false;
      clearLoadingMessageTimer();
      if (listenBtn) listenBtn.disabled = false;
      showControls(true);
      prefetchAhead(1);
      playNextChunk();
    });
  }

  function startNeuralSpeech() {
    resetSpeech();
    var chunks = chunkText(getArticleText(), CHUNK_SIZE);

    streamChunks(chunks).catch(function () {
      setStatus('Neural voice unavailable — using browser voice (lower quality).');
      useFallback = true;
      startFallbackSpeech();
    });
  }

  var utteranceQueue = [];
  var utteranceIndex = 0;

  function speakFallbackNext() {
    if (utteranceIndex >= utteranceQueue.length) {
      resetSpeech();
      return;
    }
    var utterance = new SpeechSynthesisUtterance(utteranceQueue[utteranceIndex]);
    utterance.lang = 'en-US';
    utterance.onend = function () {
      utteranceIndex += 1;
      speakFallbackNext();
    };
    utterance.onerror = function () {
      utteranceIndex += 1;
      speakFallbackNext();
    };
    window.speechSynthesis.speak(utterance);
  }

  function startFallbackSpeech() {
    if (!('speechSynthesis' in window)) {
      alert('Audio playback is not available in this browser.');
      resetSpeech();
      return;
    }
    utteranceQueue = chunkText(getArticleText(), 320);
    utteranceIndex = 0;
    showControls(true);
    speakFallbackNext();
  }

  if (listenBtn) {
    listenBtn.addEventListener('click', startNeuralSpeech);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      if (useFallback) {
        if (window.speechSynthesis.speaking && !isPaused) {
          window.speechSynthesis.pause();
          isPaused = true;
          pauseBtn.textContent = 'Resume';
        } else if (isPaused) {
          window.speechSynthesis.resume();
          isPaused = false;
          pauseBtn.textContent = 'Pause';
        }
        return;
      }
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        isPaused = true;
        pauseBtn.textContent = 'Resume';
        setStatus('Paused');
      } else if (currentAudio && isPaused) {
        currentAudio.play();
        isPaused = false;
        pauseBtn.textContent = 'Pause';
        setStatus('');
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', resetSpeech);
  }

  updateReadTime();
})();
