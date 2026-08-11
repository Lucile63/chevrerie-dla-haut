(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (menuToggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      document.body.classList.remove('menu-open');
    };

    menuToggle.addEventListener('click', () => {
      const nextState = menuToggle.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', nextState);
      menuToggle.setAttribute('aria-expanded', String(nextState));
      menuToggle.setAttribute('aria-label', nextState ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.classList.toggle('menu-open', nextState);
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.product-card');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      productCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !visible);
      });
    });
  });

  document.querySelectorAll('.product-order').forEach((button) => {
    button.addEventListener('click', () => {
      const product = button.closest('[data-product]')?.dataset.product || 'ce fromage';
      const body = `Bonjour Jérôme, je souhaite connaître la disponibilité de : ${product}.`;
      window.location.href = `sms:+33678167240?body=${encodeURIComponent(body)}`;
    });
  });

  const loadVideoButton = document.querySelector('[data-load-video]');
  const videoContainer = document.querySelector('[data-video-container]');
  const localVideo = document.querySelector('[data-local-video]');
  const videoOverlay = document.querySelector('[data-video-overlay]');
  if (loadVideoButton && videoContainer && localVideo) {
    loadVideoButton.addEventListener('click', async () => {
      videoContainer.classList.add('is-playing');
      if (videoOverlay) videoOverlay.hidden = true;
      localVideo.controls = true;
      try {
        await localVideo.play();
      } catch (error) {
        // Les contrôles natifs restent affichés si l'autoplay est bloqué par le navigateur.
      }
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const profile = data.get('profile') || '';
      const name = data.get('name') || '';
      const city = data.get('city') || 'Non précisée';
      const phone = data.get('phone') || 'Non précisé';
      const message = data.get('message') || '';
      const subject = `${profile} - demande depuis le site de La Chèvrerie d'Là-Haut`;
      const body = [
        'Bonjour Jérôme,',
        '',
        `Nom : ${name}`,
        `Profil : ${profile}`,
        `Commune : ${city}`,
        `Téléphone : ${phone}`,
        '',
        'Demande :',
        message,
        '',
        'Merci.'
      ].join('\n');

      if (formStatus) formStatus.textContent = 'Ouverture de votre messagerie…';
      window.location.href = `mailto:jeromeberthon0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
