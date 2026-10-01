(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-language]');
  const copy = {
    en: { skip: 'Skip to content', privacy: 'Privacy Policy', terms: 'Terms of Service', documents: 'Documents', developer: 'Developer' },
    ru: { skip: 'Перейти к содержимому', privacy: 'Конфиденциальность', terms: 'Условия использования', documents: 'Документы', developer: 'Разработчик' },
  };
  let language = 'en';
  let saved;
  try { saved = localStorage.getItem('self-site-language'); } catch { /* Preferences are optional. */ }
  function setLanguage(value) {
    const previousLanguage = language;
    language = value === 'ru' ? 'ru' : 'en';
    root.lang = language;
    document.querySelectorAll('[data-legal-language]').forEach(element => { element.hidden = element.dataset.legalLanguage !== language; });
    document.querySelectorAll('[data-legal-copy]').forEach(element => { element.textContent = copy[language][element.dataset.legalCopy]; });
    document.querySelectorAll('[data-legal-aria]').forEach(element => { element.setAttribute('aria-label', copy[language][element.dataset.legalAria]); });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelectorAll('[data-site-link]').forEach(link => {
      const address = new URL(link.getAttribute('href'), location.href);
      address.searchParams.set('lang', language);
      link.href = address.href;
    });
    const current = document.querySelector(`[data-legal-language="${language}"]`);
    document.title = `${current.querySelector('h1').textContent} - Self`;
    document.querySelector('meta[name="description"]').content = current.querySelector('.legal-intro').textContent;
    const address = new URL(location.href);
    address.searchParams.set('lang', language);
    if (previousLanguage !== language && address.hash.startsWith(`#${previousLanguage}-`)) address.hash = address.hash.replace(`#${previousLanguage}-`, `#${language}-`);
    try { history.replaceState(null, '', address); } catch { /* Local previews may restrict history updates. */ }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    try { localStorage.setItem('self-site-language', language); } catch { /* Preferences are optional. */ }
  }));
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(['en', 'ru'].includes(requested) ? requested : ['en', 'ru'].includes(saved) ? saved : navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en');
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
})();
