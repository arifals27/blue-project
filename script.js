/* ============================================================
   PetikLaut — script.js
   Loads data.json and bootstraps all page sections + Swiper
============================================================ */

(function () {
  'use strict';

  /* ─── SCROLL REVEAL ──────────────────────────────────────── */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* ─── NAVBAR ─────────────────────────────────────────────── */
  function initNavbar(menuItems, logoText) {
    const navbar  = document.getElementById('navbar');
    const logoEl  = document.getElementById('logoText');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const desktopNav = document.getElementById('desktopNav');

    // Set logo text
    if (logoEl) logoEl.textContent = logoText;
    const footerLogo = document.getElementById('footerLogoText');
    if (footerLogo) footerLogo.textContent = logoText;

    // Build desktop nav links
    menuItems.forEach((item) => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href        = item.link;
      a.textContent = item.name;
      a.className   = 'nav-link';
      li.appendChild(a);
      desktopNav.appendChild(li);
    });

    // Build mobile nav links
    menuItems.forEach((item) => {
      const a = document.createElement('a');
      a.href        = item.link;
      a.textContent = item.name;
      a.className   = 'mobile-nav-link';
      a.addEventListener('click', closeMobileMenu);
      mobileMenu.appendChild(a);
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }

    // Scroll → sticky shadow
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) closeMobileMenu();
    });
  }

  /* ─── HERO ───────────────────────────────────────────────── */
  function initHero(hero) {
    // Badge
    const badgeText = document.getElementById('heroBadgeText');
    if (badgeText && hero.badge) badgeText.textContent = hero.badge;

    // Title (allow HTML for <span class="highlight">)
    const titleEl = document.getElementById('heroTitle');
    if (titleEl && hero.title) titleEl.innerHTML = hero.title;

    // Subtitle
    const subtitleEl = document.getElementById('heroSubtitle');
    if (subtitleEl && hero.subtitle) subtitleEl.textContent = hero.subtitle;

    // Description
    const descEl = document.getElementById('heroDesc');
    if (descEl && hero.description) descEl.textContent = hero.description;

    // CTAs
    const ctasEl = document.getElementById('heroCtas');
    if (ctasEl) {
      if (hero.ctaPrimary) {
        const a = createEl('a', 'btn-primary', {
          href: hero.ctaPrimary.link,
          innerHTML: `${hero.ctaPrimary.text}
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        });
        ctasEl.appendChild(a);
      }
      if (hero.ctaSecondary) {
        const b = createEl('a', 'btn-secondary', {
          href: hero.ctaSecondary.link,
          innerHTML: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M10 8l6 4-6 4V8z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>${hero.ctaSecondary.text}`
        });
        ctasEl.appendChild(b);
      }
    }

    // Stats
    const statsEl = document.getElementById('heroStats');
    if (statsEl && Array.isArray(hero.stats)) {
      hero.stats.forEach((s, i) => {
        if (i > 0) {
          const div = document.createElement('div');
          div.className = 'stat-divider';
          statsEl.appendChild(div);
        }
        const item = createEl('div', 'stat-item', {
          innerHTML: `<span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span>`
        });
        statsEl.appendChild(item);
      });
    }

    // Hero image
    const imgEl = document.getElementById('heroImage');
    if (imgEl && hero.imageUrl) imgEl.src = hero.imageUrl;

    // Floating badges
    const fbLabel = document.getElementById('floatBadgeLabel');
    const fbValue = document.getElementById('floatBadgeValue');
    if (fbLabel && hero.floatingBadge) fbLabel.textContent = hero.floatingBadge.label;
    if (fbValue && hero.floatingBadge) fbValue.textContent = hero.floatingBadge.value;

    // Parallax-lite: hero image moves subtly on mouse move
    const wrapper = document.getElementById('heroImageWrapper');
    if (wrapper) {
      document.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 14;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        wrapper.style.transform = `perspective(1000px) rotateY(${x * 0.4}deg) rotateX(${-y * 0.4}deg)`;
      });
      document.addEventListener('mouseleave', () => {
        wrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      });
    }
  }

  /* ─── VIDEO ──────────────────────────────────────────────── */
  function initVideo(video) {
    const titleEl = document.getElementById('videoTitle');
    if (titleEl && video.sectionTitle) titleEl.textContent = video.sectionTitle;

    const descEl = document.getElementById('videoDesc');
    if (descEl && video.sectionDesc) descEl.textContent = video.sectionDesc;

    const wrapper = document.getElementById('video-section');
    if (wrapper && video.youtubeId) {
      wrapper.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1"
          title="Video Petik Laut"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
    }
  }

  /* ─── CAROUSEL ───────────────────────────────────────────── */
  function initCarousel(carouselData) {
    // Section texts
    const titleEl = document.getElementById('carouselTitle');
    if (titleEl && carouselData.sectionTitle) titleEl.textContent = carouselData.sectionTitle;

    const descEl = document.getElementById('carouselDesc');
    if (descEl && carouselData.sectionDesc) descEl.textContent = carouselData.sectionDesc;

    const wrapper = document.getElementById('carouselWrapper');
    if (!wrapper || !Array.isArray(carouselData.items)) return;

    // Build slides
    carouselData.items.forEach((item) => {
      const platform     = (item.platform || 'link').toLowerCase();
      const linkClass    = ['instagram', 'facebook'].includes(platform) ? platform : '';
      const platformIcon = getPlatformIcon(platform);

      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="poster-card">
          <img
            src="${item.image}"
            alt="${item.title}"
            class="poster-card-img"
            loading="lazy">
          <div class="poster-card-overlay"></div>
          <div class="poster-card-content">
            <h3 class="poster-card-title">${item.title}</h3>
            <p class="poster-card-desc">${item.desc || ''}</p>
            <a
              href="${item.socialUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="poster-card-link ${linkClass}"
              aria-label="${item.socialLabel || 'Lihat lebih lanjut'}">
              ${platformIcon}
              <span>${item.socialLabel || 'Selengkapnya'}</span>
            </a>
          </div>
        </div>
      `;
      wrapper.appendChild(slide);
    });

    // Init Swiper — AFTER slides are in the DOM
    // Breakpoints: mobile = 1 center + peek | desktop = exactly 3 (prev|current|next)
    const totalSlides = carouselData.items.length;
    const swiper = new Swiper('.mySwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      loop: true,
      slidesPerView: 1.15,   // default (mobile): center + slight peek on both sides
      speed: 600,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: false
      },
      breakpoints: {
        // ≥ 768px (tablet / desktop): show exactly 3 — prev | current | next
        768: {
          slidesPerView: 3,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false
          }
        }
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      keyboard: { enabled: true }
    });
  }

  /* ─── FOOTER ─────────────────────────────────────────────── */
  function initFooter(footer) {
    const infoEl = document.getElementById('footerInfo');
    if (infoEl && footer.info) infoEl.textContent = footer.info;

    const copyEl = document.getElementById('footerCopyright');
    if (copyEl && footer.logoText) copyEl.textContent = footer.logoText;

    const socialEl = document.getElementById('socialLinks');
    if (socialEl && Array.isArray(footer.socials)) {
      footer.socials.forEach((s) => {
        const a = document.createElement('a');
        a.href            = s.link;
        a.className       = 'footer-social-link';
        a.setAttribute('aria-label', s.platform);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${s.icon}"/></svg>`;
        socialEl.appendChild(a);
      });
    }

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ─── HELPERS ────────────────────────────────────────────── */
  function createEl(tag, className, attrs = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'innerHTML') { el.innerHTML = v; }
      else { el.setAttribute(k, v); }
    });
    return el;
  }

  function getPlatformIcon(platform) {
    const icons = {
      instagram: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.644.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>`,
      facebook: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>`,
      link: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
    };
    return icons[platform] || icons.link;
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Trigger reveal for already-visible elements
    initReveal();

    fetch('data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch data.json');
        return r.json();
      })
      .then((data) => {
        // Header / Navbar
        if (data.header) {
          initNavbar(data.header.menu || [], data.header.logoText || 'PetikLaut');
        }

        // Hero
        if (data.hero) initHero(data.hero);

        // Video
        if (data.video) initVideo(data.video);

        // Carousel (build slides FIRST, then Swiper)
        if (data.carousel) initCarousel(data.carousel);

        // Footer
        if (data.footer) initFooter(data.footer);

        // Re-check reveals after dynamic content injection
        setTimeout(initReveal, 150);
      })
      .catch((err) => {
        console.error('PetikLaut data error:', err);
      });
  });

})();
