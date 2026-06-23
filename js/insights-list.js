(function () {
  var grid = document.getElementById('insights-grid');
  if (!grid) return;

  loadArticles()
    .then(function (articles) {
      articles.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      grid.innerHTML = articles.map(renderCard).join('');
    })
    .catch(function () {
      grid.innerHTML = '<p class="text-sm text-slate-500">Unable to load articles. Please try again later.</p>';
    });

  function loadArticles() {
    var inline = document.getElementById('insights-data');
    if (inline && inline.textContent.trim()) {
      try {
        return Promise.resolve(JSON.parse(inline.textContent));
      } catch (err) {
        /* fall through to fetch */
      }
    }
    return fetch('/data/insights.json').then(function (res) {
      if (!res.ok) throw new Error('Failed to load insights');
      return res.json();
    });
  }

  function formatDate(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function renderCard(article) {
    var href = '/insights/' + article.slug + '/';
    var tags = (article.tags || []).map(function (tag) {
      return '<span class="insight-card__tag">' + escapeHtml(tag) + '</span>';
    }).join('');

    var imageBlock = article.image
      ? '<div class="insight-card__media">' +
          '<img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.imageAlt || '') + '" loading="lazy" />' +
        '</div>'
      : '';

    return (
      '<article class="insight-card">' +
        '<a href="' + href + '" class="insight-card__link">' +
          imageBlock +
          '<div class="insight-card__body">' +
            '<div class="insight-card__meta">' +
              '<time datetime="' + escapeHtml(article.date) + '">' + formatDate(article.date) + '</time>' +
              '<span aria-hidden="true">·</span>' +
              '<span>' + article.readMinutes + ' min read</span>' +
            '</div>' +
            '<h2 class="insight-card__title">' + escapeHtml(article.title) + '</h2>' +
            '<p class="insight-card__subtitle">' + escapeHtml(article.subtitle) + '</p>' +
            '<p class="insight-card__excerpt">' + escapeHtml(article.excerpt) + '</p>' +
            (tags ? '<div class="insight-card__tags">' + tags + '</div>' : '') +
            '<span class="insight-card__cta">Read article <span aria-hidden="true">→</span></span>' +
          '</div>' +
        '</a>' +
      '</article>'
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
