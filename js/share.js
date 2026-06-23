(function () {
  var bars = document.querySelectorAll('.share-bar');
  if (!bars.length) return;

  var title = document.querySelector('meta[property="og:title"]')?.content
    || document.title.replace(/\s*\|\s*Simon Brightman$/, '');
  var description = document.querySelector('meta[property="og:description"]')?.content
    || document.querySelector('meta[name="description"]')?.content
    || '';
  var url = window.location.href;

  var tweetText = title;
  var emailSubject = title;
  var emailBody = title;
  if (description) {
    emailBody += '\n\n' + description;
  }
  emailBody += '\n\n' + url;

  function copyLink(btn) {
    navigator.clipboard.writeText(url).then(function () {
      var label = btn.getAttribute('data-label') || btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = label; }, 2000);
    }).catch(function () {
      prompt('Copy this link:', url);
    });
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description || title,
        url: url,
      }).catch(function () {});
    }
  }

  bars.forEach(function (bar) {
    bar.querySelectorAll('[data-share]').forEach(function (el) {
      var action = el.getAttribute('data-share');

      if (action === 'linkedin') {
        el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else if (action === 'x') {
        el.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText)
          + '&url=' + encodeURIComponent(url);
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else if (action === 'email') {
        el.href = 'mailto:?subject=' + encodeURIComponent(emailSubject)
          + '&body=' + encodeURIComponent(emailBody);
      } else if (action === 'copy') {
        el.addEventListener('click', function () { copyLink(el); });
      } else if (action === 'native') {
        if (!navigator.share) {
          el.style.display = 'none';
          return;
        }
        el.addEventListener('click', nativeShare);
      }
    });
  });
})();
