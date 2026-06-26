/* ==========================================================================
   Jens Langkammer – Particle Network Animation (Knowledge Graph Effect)
   Lightweight Canvas-based particle system
   ========================================================================== */

(function () {
  'use strict';

  // --- Particle Network ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let animationId;
    const PARTICLE_COUNT = 45;
    const CONNECTION_DISTANCE = 140;
    const GOLD = { r: 212, g: 168, b: 0 };

    function resize() {
      const hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Dynamically get theme colors for particles
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const activeGold = isDark ? { r: 212, g: 168, b: 0 } : { r: 181, g: 143, b: 0 };

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx.strokeStyle = `rgba(${activeGold.r}, ${activeGold.g}, ${activeGold.b}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = `rgba(${activeGold.r}, ${activeGold.g}, ${activeGold.b}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function updateParticles() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    function animate() {
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Defer initialization to avoid forced reflow during critical rendering path
    window.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        const isMobile = window.innerWidth < 768;
        resize();
        createParticles();
        if (isMobile) {
          particles = particles.slice(0, 20);
        }
        animate();
      });
    });

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
        if (window.innerWidth < 768) {
          particles = particles.slice(0, 20);
        }
      }, 250);
    });

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  // --- Intersection Observer for Reveal Animations ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Cookie Consent Banner ---
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const declineBtn = document.getElementById('declineCookies');

  if (cookieBanner) {
    const choice = localStorage.getItem('cookieConsent');
    if (!choice) {
      setTimeout(() => {
        cookieBanner.style.display = 'block';
        cookieBanner.style.animation = 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }, 1200);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.animation = 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          cookieBanner.style.display = 'none';
        }, 300);
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.style.animation = 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          cookieBanner.style.display = 'none';
        }, 300);
      });
    }
  }

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- LinkedIn Embed Modal Controller ---
  const linkedinModal = document.getElementById('linkedinModal');
  if (linkedinModal) {
    const consentContainer = document.getElementById('linkedinConsentContainer');
    const spinnerContainer = document.getElementById('linkedinModalSpinner');
    const iframeContainer = document.getElementById('linkedinIframeContainer');
    
    const loadBtn = document.getElementById('loadLinkedinIframe');
    const saveConsentCheckbox = document.getElementById('saveLinkedinConsent');
    const externalLink = document.getElementById('linkedinModalExternalLink');
    const consentExternalLink = document.getElementById('linkedinConsentExternalLink');
    const themeFilterToggle = document.getElementById('linkedinModalThemeToggle');
    
    let activeEmbedUrl = '';
    let activeOriginalUrl = '';

    // Check if the site is in dark mode
    function isDarkMode() {
      return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    // Set initial filter state based on page dark mode
    function updateThemeFilterState(forceDefault) {
      if (!themeFilterToggle || !iframeContainer) return;
      
      const shouldInvert = forceDefault !== undefined ? forceDefault : isDarkMode();
      if (shouldInvert) {
        iframeContainer.classList.add('invert-theme');
        themeFilterToggle.classList.add('filter-active');
      } else {
        iframeContainer.classList.remove('invert-theme');
        themeFilterToggle.classList.remove('filter-active');
      }
    }

    // Open Modal Function
    function openModal(embedUrl, originalUrl) {
      activeEmbedUrl = embedUrl;
      activeOriginalUrl = originalUrl;
      
      // Update external links
      if (externalLink) externalLink.href = originalUrl;
      if (consentExternalLink) consentExternalLink.href = originalUrl;
      
      // Reset view states
      consentContainer.style.display = 'none';
      spinnerContainer.style.display = 'none';
      iframeContainer.style.display = 'none';
      iframeContainer.innerHTML = '';
      
      // Update filter toggle state to match page theme by default
      updateThemeFilterState();

      // Show Modal
      linkedinModal.classList.add('active');
      linkedinModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Scroll lock
      
      // Check DSGVO consent
      const hasConsent = localStorage.getItem('linkedinConsent') === 'accepted';
      if (hasConsent) {
        loadIframe(embedUrl);
      } else {
        consentContainer.style.display = 'flex';
      }

      // Accessibility: Focus first focusable element
      setTimeout(() => {
        const focusable = linkedinModal.querySelector('button, [href], input, select, textarea');
        if (focusable) focusable.focus();
      }, 50);
    }

    // Load Iframe Function
    function loadIframe(embedUrl) {
      consentContainer.style.display = 'none';
      spinnerContainer.style.display = 'block';
      iframeContainer.style.display = 'none';
      
      // Create iframe element dynamically
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = 'LinkedIn Embedded Post';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      
      // Adjust height on load
      iframe.onload = function() {
        spinnerContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
      };
      
      iframeContainer.appendChild(iframe);
    }

    // Close Modal Function
    function closeModal() {
      linkedinModal.classList.remove('active');
      linkedinModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Release scroll lock
      
      // Clear iframe src after transition to stop background audio/video
      setTimeout(() => {
        iframeContainer.innerHTML = '';
        activeEmbedUrl = '';
        activeOriginalUrl = '';
      }, 350);
    }

    // Event listener: LinkedIn link clicks
    document.querySelectorAll('a[data-linkedin-embed]').forEach(link => {
      link.addEventListener('click', function(e) {
        const embedUrl = this.getAttribute('data-linkedin-embed');
        const originalUrl = this.getAttribute('href');
        if (embedUrl) {
          e.preventDefault();
          openModal(embedUrl, originalUrl);
        }
      });
    });

    // Event listener: Load button clicked (Consent screen)
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        if (saveConsentCheckbox && saveConsentCheckbox.checked) {
          localStorage.setItem('linkedinConsent', 'accepted');
        }
        loadIframe(activeEmbedUrl);
      });
    }

    // Event listener: Theme toggle for the iframe (contrast adjustment)
    if (themeFilterToggle) {
      themeFilterToggle.addEventListener('click', () => {
        const isCurrentlyInverted = iframeContainer.classList.contains('invert-theme');
        updateThemeFilterState(!isCurrentlyInverted);
      });
    }

    // Event listener: Close modal actions
    linkedinModal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    // Event listener: Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && linkedinModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Trap focus inside modal for Accessibility
    linkedinModal.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      const focusableEls = linkedinModal.querySelectorAll('button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
      const firstFocusableEl = focusableEls[0];
      const lastFocusableEl = focusableEls[focusableEls.length - 1];
      
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    });
  }
})();
