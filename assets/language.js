(() => {
  const address = new URL(location.href);
  const requestedLanguage = address.searchParams.get('lang');
  const alternate = value => document.querySelector(`link[rel="alternate"][hreflang="${value}"]`);
  const fragment = address.hash.replace(/^#(?:en|ru)-/, '#');

  if (requestedLanguage === 'en' || requestedLanguage === 'ru') {
    const destination = alternate(requestedLanguage);
    if (destination) {
      const target = new URL(destination.href);
      target.protocol = address.protocol;
      target.host = address.host;
      target.search = address.search;
      target.searchParams.delete('lang');
      target.hash = fragment;
      if (target.href !== address.href) {
        location.replace(target.href);
        return;
      }
    }
  } else if (fragment !== address.hash) {
    address.hash = fragment;
    history.replaceState(null, '', address);
  }

  document.querySelectorAll('[data-language]').forEach(link => {
    link.addEventListener('click', () => {
      const target = new URL(link.href);
      target.hash = location.hash.replace(/^#(?:en|ru)-/, '#');
      link.href = target.href;
    });
  });

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
})();
