(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const heroScene = document.querySelector('.hero-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let framePending = false;

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
    panicCaption.textContent = step.querySelector('summary [data-panic-label]').textContent;
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

  selectPanicStep(panicSteps.find(step => step.open) ?? panicSteps[0]);
  applyMotion();
})();
