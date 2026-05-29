/* ============================================================
   PetikLaut — about.js
   Loads data.json and bootstraps the About page
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
  function initNavbar(headerData) {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const desktopNav = document.getElementById('desktopNav');

    // Render partner logos
    const partnerContainer = document.getElementById('partnerLogos');
    if (partnerContainer && Array.isArray(headerData.partnerLogos)) {
      headerData.partnerLogos.forEach((logo) => {
        const img = document.createElement('img');
        img.src       = logo.src;
        img.alt       = logo.name;
        img.className = 'partner-logo-img';
        img.loading   = 'lazy';
        partnerContainer.appendChild(img);
      });
    }

    // Render main logo
    const mainLogoImg = document.getElementById('mainLogoImg');
    if (mainLogoImg && headerData.mainLogo) {
      mainLogoImg.src = headerData.mainLogo.src;
      mainLogoImg.alt = headerData.mainLogo.name;
    }

    // Build desktop nav links
    const menuItems = headerData.menu || [];
    menuItems.forEach((item) => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href        = item.link;
      a.textContent = item.name;
      a.className   = 'nav-link';
      // Highlight active page
      if (item.link === 'about.html') {
        a.style.color = 'var(--ocean-bright)';
        a.style.fontWeight = '700';
      }
      li.appendChild(a);
      desktopNav.appendChild(li);
    });

    // Build mobile nav links
    menuItems.forEach((item) => {
      const a = document.createElement('a');
      a.href        = item.link;
      a.textContent = item.name;
      a.className   = 'mobile-nav-link';
      if (item.link.startsWith('#')) {
        a.addEventListener('click', closeMobileMenu);
      }
      if (item.link === 'about.html') {
        a.style.color = 'var(--ocean-bright)';
        a.style.fontWeight = '700';
      }
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

  /* ─── ABOUT HERO ────────────────────────────────────────── */
  function initAboutHero(about) {
    const titleEl = document.getElementById('aboutHeroTitle');
    if (titleEl && about.heroTitle) {
      titleEl.innerHTML = about.heroTitle.replace('PetikLaut', '<span class="highlight">PetikLaut</span>');
    }

    const descEl = document.getElementById('aboutHeroDesc');
    if (descEl && about.heroDesc) descEl.textContent = about.heroDesc;
  }

  /* ─── MISSION & VISION ──────────────────────────────────── */
  function initMissionVision(about) {
    const missionText = document.getElementById('missionText');
    if (missionText && about.mission) missionText.textContent = about.mission;

    const visionText = document.getElementById('visionText');
    if (visionText && about.vision) visionText.textContent = about.vision;
  }

  /* ─── VALUES ────────────────────────────────────────────── */
  function initValues(about) {
    const grid = document.getElementById('valuesGrid');
    if (!grid || !Array.isArray(about.values)) return;

    about.values.forEach((val, i) => {
      const card = document.createElement('div');
      card.className = `about-value-card reveal reveal-delay-${Math.min(i + 1, 5)}`;
      card.innerHTML = `
        <span class="about-value-icon">${val.icon}</span>
        <h3 class="about-value-title">${val.title}</h3>
        <p class="about-value-desc">${val.desc}</p>
      `;
      grid.appendChild(card);
    });
  }

  /* ─── TEAM ──────────────────────────────────────────────── */
  function initTeam(about) {
    const grid = document.getElementById('teamGrid');
    if (!grid || !Array.isArray(about.team)) return;

    about.team.forEach((member, i) => {
      const card = document.createElement('div');
      card.className = `about-team-card reveal reveal-delay-${Math.min(i + 1, 5)}`;

      // Build social links
      let socialsHTML = '';
      if (member.socials) {
        if (member.socials.email) {
          socialsHTML += `
            <a href="mailto:${member.socials.email}" class="about-team-social-link" aria-label="Email ${member.name}">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Email
            </a>`;
        }
        if (member.socials.linkedin) {
          socialsHTML += `
            <a href="${member.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="about-team-social-link" aria-label="LinkedIn ${member.name}">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>`;
        }
      }

      card.innerHTML = `
        <div class="about-team-photo-wrapper">
          <img src="${member.photo}" alt="${member.name}" class="about-team-photo" loading="lazy">
        </div>
        <div class="about-team-info">
          <h3 class="about-team-name">${member.name}</h3>
          <span class="about-team-role">${member.role}</span>
          <p class="about-team-bio">${member.bio}</p>
          <div class="about-team-socials">
            ${socialsHTML}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ─── FOOTER ─────────────────────────────────────────────── */
  function initFooter(footer, mainLogo) {
    const infoEl = document.getElementById('footerInfo');
    if (infoEl && footer.info) infoEl.textContent = footer.info;

    const copyEl = document.getElementById('footerCopyright');
    if (copyEl && footer.logoText) copyEl.textContent = footer.logoText;

    const footerLogo = document.getElementById('footerLogoText');
    if (footerLogo) footerLogo.textContent = footer.logoText || 'PetikLaut';

    // Footer logo image
    const footerBrand = document.querySelector('.footer-brand');
    if (footerBrand && mainLogo) {
      const footerLogoIcon = document.getElementById('footerLogoIcon');
      if (footerLogoIcon) footerLogoIcon.style.display = 'none';
      const footerImg = document.createElement('img');
      footerImg.src       = mainLogo.src;
      footerImg.alt       = mainLogo.name;
      footerImg.className = 'footer-logo-img';
      footerBrand.insertBefore(footerImg, footerBrand.firstChild);
    }

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

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();

    fetch('data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch data.json');
        return r.json();
      })
      .then((data) => {
        // Header / Navbar
        if (data.header) {
          initNavbar(data.header);
        }

        // About content
        if (data.about) {
          initAboutHero(data.about);
          initMissionVision(data.about);
          initValues(data.about);
          initTeam(data.about);
        }

        // Footer
        if (data.footer) {
          initFooter(data.footer, data.header ? data.header.mainLogo : null);
        }

        // Re-check reveals after dynamic content injection
        setTimeout(initReveal, 150);
      })
      .catch((err) => {
        console.error('PetikLaut About data error:', err);
      });
  });

})();
