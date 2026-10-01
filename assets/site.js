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
      heroDescription: 'Ваши звуки, ежедневные ритуалы и помощь в трудные моменты. Немного времени для себя, в своём ритме.',
      download: 'Скачать в App Store',
      floatSounds: 'Своя атмосфера', floatSoundsBody: 'Звуки в вашем сочетании.',
      floatWatch: 'Момент на запястье', floatWatchBody: 'Телефон можно оставить дома.',
      sceneCaption: 'Меньше шума. Больше пространства.',
      navWhy: "Зачем Self",
      everydayEyebrow: "НЕМНОГО МЕСТА ДЛЯ СЕБЯ В ШУМНОМ МИРЕ",
      everydayTitle: "День требует многого.",
      everydayAccent: "Оставьте место для себя.",
      everydayBody: "Сообщения, дедлайны, новости. Иногда нужна пауза, чтобы заметить своё состояние и выбрать, что делать дальше.",
      everydayFocus: "Одно уведомление за другим.",
      everydayFocusPreview: "Постоянно переключаетесь и забываете, на чём остановились.",
      everydayFocusBody: "Попробуйте паузу со знакомым звуком. Замечайте, когда внимание отвлекается, и мягко возвращайтесь к слушанию. Это возвращение и есть часть практики, даже если оно повторяется много раз.",
      everydayFocusLink: "Собрать свою звуковую атмосферу",
      everydayWork: "Работа закончилась. Мысли о ней остались.",
      everydayWorkPreview: "Разговор уже позади, а вы продолжаете прокручивать его в голове.",
      everydayWorkBody: "Дайте себе переход между работой и остальной частью дня. Включите любимое аудио, обратите внимание на звуки и ощущения в теле. Ритуал в Self напомнит выделить для этого время.",
      everydayWorkLink: "Найти время для ежедневного ритуала",
      everydayEvening: "Устали, но всё ещё листаете ленту.",
      everydayEveningPreview: "Уже вечер, а замедлиться всё никак не получается.",
      everydayEveningBody: "Попробуйте завершать день спокойнее: с дождём, волнами или своим аудио. Установите таймер сна в Self и отложите экран. Выберите практику, в которой вам комфортно.",
      everydayEveningLink: "Выбрать звуки для вечера",
      everydayAnxiety: "Из-за тревоги трудно выбрать следующий шаг.",
      everydayAnxietyPreview: "Хочется иметь знакомую опору на случай трудного момента.",
      everydayAnxietyBody: "Подготовьтесь, пока спокойно: выберите доверенный контакт и знакомое медиа, попробуйте сценарий помощи. При панической атаке Self держит под рукой подсказки для дыхания, заземление и возможность позвонить близкому.",
      everydayAnxietyLink: "Посмотреть помощь при панической атаке",
      practiceEyebrow: "ЗАЧЕМ МЕДИТИРОВАТЬ?",
      practiceTitle: "Замечать. Возвращаться.\nПовторять.",
      practiceBody: "Медитация может быть практикой внимания: к звуку, дыханию или ощущениям здесь и сейчас. Когда мысли уводят в сторону, вы мягко возвращаетесь. Начать можно с короткой, комфортной для вас сессии.",
      practiceRegular: "Регулярность даёт возможность замечать напряжение, тренировать возвращение внимания и выделять время для себя, прежде чем трудный день станет слишком тяжёлым.",
      practiceEvidence: "Исследования программ осознанности показывают возможную пользу для снижения стресса, тревоги и улучшения сна. Эффект зависит от человека и формата практики; эти данные относятся к программам, а не к клинической оценке Self.",
      practiceSource: "Что говорят исследования · NCCIH",
      panicContextEyebrow: "ПОНИМАТЬ, ЧТО ПРОИСХОДИТ",
      panicContextTitle: "Когда сигнал тревоги\nв теле слишком громкий.",
      panicContextBody: "Паническая атака - внезапная волна сильного страха или дискомфорта. Сердце может биться чаще, появляются дрожь или ощущение нехватки воздуха. Это бывает даже без очевидной опасности или причины.",
      panicContextCauses: "Единой причины для всех приступов нет. Роль могут играть стресс, наследственная предрасположенность и особенности реакции организма на страх. Отдельный приступ сам по себе не означает паническое расстройство.",
      panicContextCare: "Если приступы повторяются или тревога мешает повседневной жизни, обратитесь к специалисту. Новые или сильные физические симптомы требуют медицинской оценки. Self предлагает инструменты поддержки и не заменяет лечение.",
      panicContextSource: "Подробнее о панических атаках · NIMH",
      introEyebrow: 'БЕЗ ЕЩЁ ОДНОЙ ОБЯЗАННОСТИ',
      introTitle: 'Практика, которая', introAccent: 'вписывается в вашу жизнь.',
      introBody: 'Начните с любимых звуков. Найдите удобный момент. Self соберёт всё вместе.',
      soundsEyebrow: 'ВАШ ЗВУКОВОЙ ФОН',
      soundsTitle: 'Немного дождя.\nНемного леса.\nТолько ваше.',
      soundsBody: 'Сочетайте дождь, волны, лес и костёр. Настраивайте громкость каждого звука и сохраняйте свою атмосферу. Встроенные звуки работают офлайн.',
      libraryEyebrow: 'ВАШ КОНТЕНТ В ОДНОМ МЕСТЕ',
      libraryTitle: 'Знакомые голоса.\nЛюбимые места.',
      libraryBody: 'Ваши аудио, видео, записи и ссылки на YouTube. Раскладывайте их по категориям и держите избранное под рукой.',
      rhythmEyebrow: 'ВАШ ДЕНЬ, ВАШ РИТМ',
      rhythmTitle: 'Найдите время.', rhythmAccent: 'Без спешки.',
      rhythmBody: 'Начало утра. Перерыв между встречами. Спокойный вечер. Выберите точное время или удобный промежуток для своего ритуала.',
      rhythmDetail1: 'Ваша практика, дни повторения и напоминания',
      rhythmDetail2: 'Точное время или удобный промежуток',
      rhythmDetail3: 'Таймер сна для вечерней практики',
      ritualNote: 'Маленький ритуал.\nНемного места в вашем дне.',
      devicesEyebrow: 'ЧУТЬ БЛИЖЕ К СЕБЕ',
      devicesTitle: 'От практики на запястье.', devicesAccent: 'К полной картине.',
      watchTitle: 'Ваша практика.\nТелефон необязателен.',
      watchBody: 'Начинайте практику на Apple Watch. Заранее перенесите свои аудио на часы и слушайте офлайн. История занятий синхронизируется с iPhone позже.',
      diaryTitle: 'Ваша практика в деталях.\nВаш пульс в динамике.',
      diaryBody: 'Минуты осознанности, история занятий и изменения пульса с Apple Watch. Способ оглянуться на время, которое вы нашли для себя.',
      heartNote: 'Для измерения пульса нужны Apple Watch и разрешения приложения «Здоровье». Данные пульса служат контекстом, а не медицинским заключением.',
      panicEyebrow: 'ПОМОЩЬ ПРИ ПАНИЧЕСКОЙ АТАКЕ',
      panicTitle: 'Когда накрывает.', panicAccent: 'Один шаг за другим.',
      panicBody: 'В трудный момент бывает сложно решить, что делать дальше. Self предлагает короткие, понятные шаги, которым можно следовать в своём темпе.',
      panicBreathing: 'Ритм для дыхания',
      panicBreathingBody: 'Мягкая анимация задаёт ритм вдоха и более длинного выдоха. Можно отвести взгляд и слушать голосовые подсказки. Если внимание к дыханию вызывает дискомфорт, переходите к заземлению.',
      panicGrounding: 'Опора на то, что здесь и сейчас',
      panicGroundingBody: 'Простые задания направляют внимание на предметы вокруг, звуки и ощущение стоп на полу. Можно выбрать другое задание, повторить шаг или пропустить его - вы решаете, что подходит.',
      panicHistory: 'После эпизода',
      panicHistoryBody: 'Сохраните длительность эпизода, обстоятельства, личную заметку и доступные данные пульса. Возвращайтесь к истории, чтобы замечать закономерности, или экспортируйте её в PDF и CSV, выбирая, какие подробности включить.',
      panicVoice: 'Голосовые подсказки по вашему желанию.\nПомощь на iPhone и Apple Watch.',
      panicPrepare: 'ПОДГОТОВЬТЕ ПОДДЕРЖКУ В СПОКОЙНЫЙ МОМЕНТ',
      panicContact: 'Доверенный контакт под рукой',
      panicContactBody: 'Заранее выберите человека, которому доверяете. Во время приступа можно перейти к звонку прямо из сценария помощи, не разыскивая нужный номер.',
      panicPersonalMedia: 'Ваше аудио или видео. Знакомая опора.',
      panicPersonalMediaBody: 'Заранее выберите в медиатеке аудио, видео или сохранённое сочетание звуков. Во время эпизода можно перейти к этой практике - опереться на знакомое, что уже помогало вам раньше.',
      panicAlt: 'Экран помощи при панической атаке в Self с ритмом дыхания',
      panicGroundingAlt: 'Задание для заземления в Self с фокусом на предметах вокруг',
      panicReflectionAlt: 'Экран Self для отметок об обстоятельствах после эпизода',
      panicContactAlt: 'Настройки помощи в Self с выбранным доверенным контактом',
      panicPersonalMediaAlt: 'Плеер Self с воспроизводящимся видео Flying от Soothing Relaxation',
      advantagesEyebrow: "ПРИЛОЖЕНИЕ ДЛЯ ВАШЕЙ ПРАКТИКИ",
      advantagesTitle: "Почему Self?",
      advantagesAccent: "Практика на ваших условиях.",
      advantagesBody: "Выбирайте то, что подходит вам, держите любимое под рукой и практикуйте там, где комфортно.",
      advantageFreeTitle: "Бесплатно.",
      advantageFreeBody: "Практики, своя медиатека, звуковые атмосферы и ритуалы доступны бесплатно. Выделяйте время для себя без платной подписки.",
      advantageLibraryTitle: "Только то, что нужно вам.",
      advantageLibraryBody: "Добавляйте любимые аудио, видео и записи. Ваша медиатека состоит из того, что подходит именно вам, без необходимости выбирать из огромного каталога практик.",
      advantageWatchTitle: "Уже в постели?\nДостаточно часов.",
      advantageWatchBody: "Включите аудио на Apple Watch, заранее перенеся его на часы. Телефон можно оставить в другой комнате, а знакомая практика будет прямо на запястье.",
      advantageOfflineTitle: "Время для себя.\nДаже без интернета.",
      advantageOfflineBody: "Встроенные звуки и медиа, сохранённые на устройстве, доступны без интернета. Для видео YouTube нужно подключение.",
      closingTitle: 'Немного пространства.\nТолько для вас.',
      backTop: 'Вернуться к началу', footerTagline: 'Ваши звуки. Ваши ритуалы. Ваш ритм.',
      privacy: 'Конфиденциальность', terms: 'Условия использования', contact: 'Написать автору', footerSupport: 'Поддержать Self',
      footerNav: 'Полезные ссылки',
      playerAlt: 'Плеер звуковой атмосферы Self с таймером осознанности и настройкой отдельных звуков',
      libraryAlt: 'Медиатека Self с личными аудио и видео YouTube',
      ritualsAlt: 'Расписание ритуалов Self с гибким временем практики',
      diaryAlt: 'Дневник Self с минутами осознанности и динамикой пульса',
      watchAlt: 'Плеер практики Self на Apple Watch',
      title: 'Self - Место, чтобы вернуться к себе',
      description: 'Self - место, чтобы вернуться к себе. Свои звуки, ежедневные ритуалы, минуты осознанности и практики на Apple Watch.',
      socialDescription: 'Ваши звуки. Ваши ритуалы. Ваш ритм. Знакомство с Self для iPhone, iPad и Apple Watch.',
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
