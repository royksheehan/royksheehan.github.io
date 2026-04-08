(function () {
  function buildTickerSearch(input, results, funds) {
    if (!input || !results) return;

    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      results.innerHTML = '';

      if (q.length < 1) {
        results.style.display = 'none';
        return;
      }

      const matches = funds.filter(f => f.ticker.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) {
        results.style.display = 'none';
        return;
      }

      matches.forEach(f => {
        const li = document.createElement('li');
        li.innerHTML = '<a href="' + f.url + '"><span class="tr-ticker">' + f.ticker + '</span></a>';
        results.appendChild(li);
      });

      results.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const baseURL = document.documentElement.getAttribute('data-base-url') || '/';

    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-overlay');
    const searchBtn = document.getElementById('mobile-search-btn');
    const searchBar = document.getElementById('mobile-search-bar');
    const mobileInput = document.getElementById('mobile-ticker-search');
    const mobileResults = document.getElementById('mobile-ticker-results');

    function closeAll() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      if (searchBar) searchBar.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');
    }

    if (toggle && drawer && overlay) {
      toggle.addEventListener('click', function () {
        const isOpen = drawer.classList.contains('open');
        closeAll();
        if (!isOpen) {
          drawer.classList.add('open');
          overlay.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });

      overlay.addEventListener('click', closeAll);
    }

    if (searchBtn && searchBar) {
      searchBtn.addEventListener('click', function () {
        const isOpen = searchBar.classList.contains('open');
        closeAll();
        if (!isOpen) {
          searchBar.classList.add('open');
          searchBtn.setAttribute('aria-expanded', 'true');
          setTimeout(() => mobileInput && mobileInput.focus(), 100);
        }
      });
    }

    fetch(baseURL + 'index.json')
      .then(r => r.json())
      .then(data => {
        const seen = new Set();
        const funds = data.filter(item => {
          if (!item.ticker || seen.has(item.ticker)) return false;
          seen.add(item.ticker);
          return true;
        }).map(item => ({
          ticker: item.ticker.toUpperCase(),
          url: baseURL + 'tickers/' + item.ticker.toLowerCase() + '/'
        }));

        buildTickerSearch(document.getElementById('ticker-search'), document.getElementById('ticker-results'), funds);
        buildTickerSearch(mobileInput, mobileResults, funds);
      })
      .catch(() => {});
  });
})();
