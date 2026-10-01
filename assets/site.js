(() => {
  const root = document.documentElement;
  const languageButtons = document.querySelectorAll('[data-language]');
  const hero = document.querySelector('.hero');
  const heroScene = document.querySelector('.hero-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const english = {};
  let language = 'en';
  let framePending = false;

  function savedPreference(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
  }

  document.querySelectorAll('[data-i18n]').forEach(element => {
    english[element.dataset.i18n] = [...element.childNodes].map(node => node.nodeName === 'BR' ? '\n' : node.textContent).join('');
  });
  for (const attribute of ['aria', 'alt']) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      english[element.getAttribute(`data-i18n-${attribute}`)] = element.getAttribute(attribute === 'aria' ? 'aria-label' : 'alt');
    });
  }
  english.nav = 'Navigation';
  english.title = document.title;
  english.description = document.querySelector('meta[name="description"]').content;
  english.socialDescription = document.querySelector('meta[property="og:description"]').content;

  const copy = {
    en: english,
    ru: {
      skip: 'Перейти к содержимому', nav: 'Навигация', menu: 'Меню',
      navFeatures: 'Возможности', navRhythm: 'Ваш ритм', navSupport: 'При панической атаке',
      heroEyebrow: 'МЕСТО, ЧТОБЫ ВЕРНУТЬСЯ К СЕБЕ',
      heroTitle: 'Небольшая пауза.', heroTitleAccent: 'Для себя.',
      heroDescription: "Включайте любимые звуки, создавайте ритуалы и находите поддержку в трудные моменты.",
      download: 'Скачать в App Store',
      floatSounds: 'Своя атмосфера', floatSoundsBody: "Сочетайте любимые звуки.",
      floatWatch: "Практика на запястье", floatWatchBody: 'Телефон можно оставить дома.',
      sceneCaption: 'Меньше шума. Больше пространства.',
      navWhy: "Зачем",
      everydayEyebrow: "КОГДА НУЖНА ПАУЗА",
      everydayTitle: "День требует многого.",
      everydayAccent: "Оставьте место для себя.",
      everydayBody: "Сообщения, дедлайны, новости. Иногда нужно просто остановиться и перевести дух.",
      everydayFocus: "Одно уведомление за другим.",
      everydayFocusPreview: "Постоянно переключаетесь и забываете, на чём остановились.",
      everydayFocusBody: "Включите знакомый звук и послушайте минуту. Если отвлеклись, спокойно вернитесь к нему.",
      everydayFocusLink: "Собрать свои звуки",
      everydayWork: "Работа закончилась. Мысли о ней остались.",
      everydayWorkPreview: "Разговор уже позади, а вы продолжаете прокручивать его в голове.",
      everydayWorkBody: "Включите любимую запись и сделайте паузу перед вечерними делами. Напоминание в Self поможет сделать это привычкой.",
      everydayWorkLink: "Создать ежедневный ритуал",
      everydayEvening: "Устали, но всё ещё листаете ленту.",
      everydayEveningPreview: "Уже вечер, а замедлиться всё никак не получается.",
      everydayEveningBody: "Включите дождь, волны или своё аудио. Поставьте таймер сна и отложите телефон.",
      everydayEveningLink: "Выбрать звуки для вечера",
      everydayAnxiety: "Тревожно, и непонятно, что делать.",
      everydayAnxietyPreview: "Знакомый следующий шаг помогает сориентироваться.",
      everydayAnxietyBody: "Заранее выберите близкого человека и любимое аудио. Во время приступа под рукой будут подсказки для дыхания, упражнения на заземление и возможность позвонить.",
      everydayAnxietyLink: "Посмотреть, как Self может помочь",
      practiceEyebrow: "ЗАЧЕМ МЕДИТИРОВАТЬ?",
      practiceTitle: "Остановиться.\nОбратить внимание.",
      practiceBody: "Прислушайтесь к звуку, дыханию или ощущениям в теле. Если мысли уводят в сторону, спокойно верните внимание. Начать можно с пары минут.",
      practiceRegular: "Не нужно избавляться от мыслей или делать всё идеально. Просто уделите себе немного времени.",
      panicContextEyebrow: "ЧТО ТАКОЕ ПАНИЧЕСКАЯ АТАКА?",
      panicContextTitle: "Внезапная волна\nстраха.",
      panicContextBody: "Сердце бьётся чаще, появляется дрожь или не хватает воздуха. Паническая атака может случиться даже без очевидной опасности.",
      panicContextCare: "Self не заменяет медицинскую помощь. Если приступы повторяются или появляются новые или сильные симптомы, обратитесь к врачу.",
      panicContextSource: "Подробнее · NIMH",
      introEyebrow: "В СВОЁМ ТЕМПЕ",
      introTitle: 'Практика, которая', introAccent: 'вписывается в вашу жизнь.',
      introBody: "Выберите звуки, добавьте любимые записи и практикуйте, когда удобно.",
      soundsEyebrow: "ВАШЕ СОЧЕТАНИЕ ЗВУКОВ",
      soundsTitle: "Дождь. Лес.\nВаша атмосфера.",
      soundsBody: "Сочетайте дождь, волны, лес и костёр. Настраивайте громкость каждого звука и сохраняйте сочетания. Встроенные звуки работают офлайн.",
      libraryEyebrow: "ВСЁ ЛЮБИМОЕ В ОДНОМ МЕСТЕ",
      libraryTitle: 'Знакомые голоса.\nЛюбимые места.',
      libraryBody: "Добавляйте аудио, видео, записи и ссылки на YouTube. Раскладывайте по категориям и держите избранное под рукой.",
      rhythmEyebrow: 'ВАШ ДЕНЬ, ВАШ РИТМ',
      rhythmTitle: 'Найдите время.', rhythmAccent: 'Без спешки.',
      rhythmBody: "Тихое утро, перерыв между встречами или пауза перед сном. Выберите дни и время для своего ритуала, а Self напомнит.",
      rhythmDetail1: "Выберите практику и дни повторения",
      rhythmDetail2: "Задайте время или удобный промежуток",
      rhythmDetail3: "Включите таймер сна перед сном",
      ritualNote: 'Маленький ритуал.\nНемного места в вашем дне.',
      devicesEyebrow: "НА IPHONE И APPLE WATCH",
      devicesTitle: "Практика на часах.", devicesAccent: "Смотрите историю на телефоне.",
      watchTitle: "Ваша практика.\nБез телефона.",
      watchBody: "Перенесите аудио на Apple Watch и слушайте без телефона и интернета. История занятий синхронизируется с iPhone позже.",
      diaryTitle: "Ваши занятия.\nВаш пульс.",
      diaryBody: "Смотрите, сколько времени вы уделили практике и как менялся пульс во время занятий с Apple Watch.",
      heartNote: "Для измерения пульса нужны Apple Watch и разрешение приложения «Здоровье». Эти данные не предназначены для диагностики.",
      panicEyebrow: 'ПОМОЩЬ ПРИ ПАНИЧЕСКОЙ АТАКЕ',
      panicTitle: 'Когда накрывает.', panicAccent: 'Один шаг за другим.',
      panicBody: "Когда сложно понять, что делать, следуйте простым шагам в своём темпе.",
      panicBreathing: 'Ритм для дыхания',
      panicBreathingBody: "Дышите вместе с анимацией или слушайте голосовые подсказки. Если некомфортно, перейдите к заземлению.",
      panicGrounding: "Заметьте, что вокруг",
      panicGroundingBody: "Посмотрите на предметы рядом, прислушайтесь к звукам, почувствуйте стопы на полу. Любой шаг можно повторить или пропустить.",
      panicHistory: "После приступа",
      panicHistoryBody: "Отметьте, что произошло и сколько длился приступ. Добавьте заметку и доступные данные пульса. Вернитесь к записям позже или сохраните их в PDF или CSV, выбрав нужные подробности.",
      panicVoice: "Голосовые подсказки по желанию.\nНа iPhone и Apple Watch.",
      panicPrepare: "НАСТРОЙТЕ ВСЁ В СПОКОЙНЫЙ МОМЕНТ",
      panicContact: "Позвонить близкому",
      panicContactBody: "Заранее выберите человека, которому доверяете. Во время приступа можно позвонить ему из Self, не разыскивая номер.",
      panicPersonalMedia: "Что-то знакомое рядом",
      panicPersonalMediaBody: "Заранее выберите аудио, видео или сочетание звуков. Во время приступа откройте их с экрана помощи.",
      panicAlt: 'Экран помощи при панической атаке в Self с ритмом дыхания',
      panicGroundingAlt: 'Задание для заземления в Self с фокусом на предметах вокруг',
      panicReflectionAlt: 'Экран Self для отметок об обстоятельствах после эпизода',
      panicContactAlt: 'Настройки помощи в Self с выбранным доверенным контактом',
      panicPersonalMediaAlt: 'Плеер Self с воспроизводящимся видео Flying от Soothing Relaxation',
      advantagesEyebrow: "ПРИЛОЖЕНИЕ ДЛЯ ВАШЕЙ ПРАКТИКИ",
      advantagesTitle: "Почему Self?",
      advantagesAccent: "Практика на ваших условиях.",
      advantageFreeTitle: "Бесплатно.",
      advantageFreeBody: "Все возможности бесплатны. Без подписки.",
      advantageLibraryTitle: "Только то, что нужно вам.",
      advantageLibraryBody: "Соберите аудио, видео и записи, к которым хочется возвращаться.",
      advantageWatchTitle: "Уже в постели?\nДостаточно часов.",
      advantageWatchBody: "Перенесите любимое аудио на часы. Включите его перед сном, а телефон оставьте в другой комнате.",
      advantageOfflineTitle: "Время для себя.\nДаже без интернета.",
      advantageOfflineBody: "Слушайте встроенные звуки и сохранённые медиа офлайн. Для YouTube нужен интернет.",
      closingTitle: 'Немного пространства.\nТолько для вас.',
      backTop: 'Вернуться к началу', footerTagline: 'Ваши звуки. Ваши ритуалы. Ваш ритм.', developer: 'Разработчик',
      privacy: 'Конфиденциальность', terms: 'Условия использования', contact: 'Написать автору', footerSupport: 'Поддержать Self',
      footerNav: 'Полезные ссылки',
      playerAlt: 'Плеер звуковой атмосферы Self с таймером осознанности и настройкой отдельных звуков',
      libraryAlt: 'Медиатека Self с личными аудио и видео YouTube',
      ritualsAlt: 'Расписание ритуалов Self с гибким временем практики',
      diaryAlt: 'Дневник Self с минутами осознанности и динамикой пульса',
      watchAlt: 'Плеер практики Self на Apple Watch',
      title: 'Self - Место, чтобы вернуться к себе',
      description: 'Свои звуки, ежедневные практики и помощь при панической атаке. Бесплатное приложение для iPhone, iPad и Apple Watch.',
      socialDescription: 'Свои звуки, ежедневные практики и помощь при панической атаке. Бесплатно на iPhone, iPad и Apple Watch.',
    },
  };

  function translated(key) { return copy[language][key] ?? english[key] ?? ''; }

  function setLanguage(value) {
    language = value === 'ru' ? 'ru' : 'en';
    root.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const lines = translated(element.dataset.i18n).split('\n');
      element.replaceChildren();
      lines.forEach((line, index) => {
        if (index) element.append(document.createElement('br'));
        element.append(document.createTextNode(line));
      });
    });
    for (const attribute of ['aria', 'alt']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute === 'aria' ? 'aria-label' : 'alt', translated(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    document.querySelectorAll('[data-screenshot]').forEach(image => {
      image.src = `assets/${image.dataset.screenshot}-${language}.webp`;
    });
    document.querySelectorAll('[data-legal-link]').forEach(link => {
      const address = new URL(link.getAttribute('href'), location.href);
      address.searchParams.set('lang', language);
      link.href = address.href;
    });
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.title = translated('title');
    document.querySelector('meta[name="description"]').content = translated('description');
    document.querySelector('meta[property="og:title"]').content = translated('title');
    document.querySelector('meta[property="og:description"]').content = translated('socialDescription');
  }

  const panicSteps = [...document.querySelectorAll('[data-panic-step]')];
  const panicScreens = [...document.querySelectorAll('[data-panic-screen]')];
  const panicCaption = document.querySelector('.panic-caption');

  function selectPanicStep(step) {
    const selected = step.dataset.panicStep;
    panicSteps.forEach(item => {
      item.dataset.active = String(item === step);
      if (item !== step) item.open = false;
    });
    panicScreens.forEach(screen => {
      const active = screen.dataset.panicScreen === selected;
      screen.classList.toggle('is-active', active);
      screen.setAttribute('aria-hidden', String(!active));
    });
    panicCaption.dataset.i18n = step.querySelector('summary [data-i18n]').dataset.i18n;
    panicCaption.textContent = translated(panicCaption.dataset.i18n);
  }

  panicSteps.forEach(step => {
    step.querySelector('summary').addEventListener('click', () => {
      if (step.open || !window.matchMedia('(max-width: 760px)').matches) return;
      requestAnimationFrame(() => {
        if (step.open) step.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      });
    });
    step.addEventListener('toggle', () => {
      if (step.open) selectPanicStep(step);
    });
  });

  function applyMotion() {
    root.dataset.motion = reducedMotion.matches ? 'off' : 'on';
    if (reducedMotion.matches) heroScene.style.removeProperty('--hero-offset');
  }

  languageButtons.forEach(button => button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    savePreference('self-site-language', language);
    const address = new URL(window.location.href);
    address.searchParams.set('lang', language);
    try { history.replaceState(null, '', address); } catch { /* Local file previews may not support history updates. */ }
  }));
  reducedMotion.addEventListener('change', applyMotion);

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.revealState = 'visible';
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight && !reducedMotion.matches) element.dataset.revealState = 'waiting';
      revealObserver.observe(element);
    });
  }

  function updateHero() {
    framePending = false;
    if (root.dataset.motion === 'off' || hero.getBoundingClientRect().bottom < 0) return;
    heroScene.style.setProperty('--hero-offset', `${Math.min(window.scrollY * .025, 24)}px`);
  }
  window.addEventListener('scroll', () => {
    if (framePending || root.dataset.motion === 'off') return;
    framePending = true;
    requestAnimationFrame(updateHero);
  }, { passive: true });
  document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => {
    link.closest('details').open = false;
  }));
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  const savedLanguage = savedPreference('self-site-language');
  const browserLanguage = navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  setLanguage(['en', 'ru'].includes(requestedLanguage) ? requestedLanguage : ['en', 'ru'].includes(savedLanguage) ? savedLanguage : browserLanguage);
  selectPanicStep(panicSteps.find(step => step.open) ?? panicSteps[0]);
  applyMotion();
})();
