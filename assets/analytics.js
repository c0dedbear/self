(() => {
  function currentLanguage() {
    return document.documentElement.lang === 'ru' ? 'ru' : 'en';
  }

  window.goatcounter = {
    path: () => `${location.pathname}?lang=${currentLanguage()}`,
  };

  function updateEventNames() {
    document.querySelectorAll('[data-analytics-event]').forEach(link => {
      link.dataset.goatcounterClick = `${link.dataset.analyticsEvent}_${currentLanguage()}`;
    });
  }

  updateEventNames();
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', updateEventNames);
  });
})();
