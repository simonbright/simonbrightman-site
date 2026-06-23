(function () {
  const prose = document.getElementById('article-prose');
  const readTimeEl = document.getElementById('read-time');
  const listenBtn = document.getElementById('listen-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const stopBtn = document.getElementById('stop-btn');
  const player = document.getElementById('audio-player');

  if (!prose) return;

  const WORDS_PER_MINUTE = 225;

  function getArticleText() {
    return prose.innerText.replace(/\s+/g, ' ').trim();
  }

  function updateReadTime() {
    if (!readTimeEl) return;
    const words = getArticleText().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    readTimeEl.textContent = minutes + ' min read';
  }

  let utteranceQueue = [];
  let currentIndex = 0;
  let isPaused = false;

  function chunkText(text, maxLen) {
    const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];
    const chunks = [];
    let buf = '';

    for (const sentence of sentences) {
      if ((buf + sentence).length > maxLen && buf) {
        chunks.push(buf.trim());
        buf = sentence;
      } else {
        buf += sentence;
      }
    }
    if (buf.trim()) chunks.push(buf.trim());
    return chunks;
  }

  function resetSpeech() {
    window.speechSynthesis.cancel();
    utteranceQueue = [];
    currentIndex = 0;
    isPaused = false;
    if (listenBtn) listenBtn.classList.remove('hidden');
    if (pauseBtn) {
      pauseBtn.classList.add('hidden');
      pauseBtn.textContent = 'Pause';
    }
    if (stopBtn) stopBtn.classList.add('hidden');
  }

  function speakNext() {
    if (currentIndex >= utteranceQueue.length) {
      resetSpeech();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(utteranceQueue[currentIndex]);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(function (v) {
      return v.lang.startsWith('en') && (/Samantha|Google US English|Daniel|Alex|Natural|Premium/i.test(v.name) || v.localService);
    }) || voices.find(function (v) { return v.lang.startsWith('en'); });
    if (preferred) utterance.voice = preferred;

    utterance.onend = function () {
      currentIndex += 1;
      speakNext();
    };
    utterance.onerror = function () {
      currentIndex += 1;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  }

  function startSpeech() {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    resetSpeech();
    const text = getArticleText();
    utteranceQueue = chunkText(text, 320);
    currentIndex = 0;

    if (listenBtn) listenBtn.classList.add('hidden');
    if (pauseBtn) pauseBtn.classList.remove('hidden');
    if (stopBtn) stopBtn.classList.remove('hidden');

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.onvoiceschanged = null;
        speakNext();
      };
    } else {
      speakNext();
    }
  }

  if (listenBtn) {
    listenBtn.addEventListener('click', startSpeech);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      if (window.speechSynthesis.speaking && !isPaused) {
        window.speechSynthesis.pause();
        isPaused = true;
        pauseBtn.textContent = 'Resume';
      } else if (isPaused) {
        window.speechSynthesis.resume();
        isPaused = false;
        pauseBtn.textContent = 'Pause';
      }
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', resetSpeech);
  }

  updateReadTime();
})();
