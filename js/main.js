/* ============================================================
   ORCHARD MEDICAL MANAGEMENT — Shared JavaScript
   orchardmedicalmgt.com | Version 3.0
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.classList.contains('navbar--solid')) {
    function handleScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. Mobile menu toggle ── */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      this.classList.toggle('open', isOpen);
      this.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    /* Close mobile menu on Escape key (accessibility) */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  /* ── 3. Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      /* Always prevent default for bare '#' links — important on pages with
         <base href> (e.g. /blog/) where href="#" would otherwise navigate away */
      if (targetId === '#') { e.preventDefault(); return; }
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── 4. Contact form handler — Formspree ── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('.form-submit');
      var nameField  = this.querySelector('#name');
      var emailField = this.querySelector('#email');
      var msgField   = this.querySelector('#message');
      var name  = nameField  ? nameField.value.trim()  : '';
      var email = emailField ? emailField.value.trim()  : '';
      var msg   = msgField   ? msgField.value.trim()    : '';
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!name)  { if (nameField)  nameField.focus();  return; }
      if (!email || !emailRe.test(email)) {
        if (emailField) { emailField.focus(); emailField.setCustomValidity('Please enter a valid email address.'); emailField.reportValidity(); emailField.setCustomValidity(''); }
        return;
      }
      if (!msg) { if (msgField) msgField.focus(); return; }

      /* Disable button & show sending state */
      if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending\u2026'; btn.disabled = true; }

      /* Submit via Formspree (no server needed — works on static hosting) */
      fetch('https://formspree.io/f/xdayoyob', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm),
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.ok) {
          var safeName = name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
          contactForm.innerHTML =
            '<div class="form-success-wrap">' +
            '<div class="form-success-icon"><i class="fas fa-check" aria-hidden="true"></i></div>' +
            '<h3 class="form-success-title">Message Sent!</h3>' +
            '<p class="form-success-msg">Thank you, ' + safeName + '. A member of our team will be in touch within one business day.</p>' +
            '</div>';
        } else {
          if (btn) { btn.innerHTML = 'Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i>'; btn.disabled = false; }
          var errMsg = (data.errors && data.errors.length)
            ? data.errors.map(function(err) { return err.message; }).join(' ')
            : 'Something went wrong. Please try again or call (603) 232-4513.';
          alert(errMsg);
        }
      })
      .catch(function() {
        if (btn) { btn.innerHTML = 'Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i>'; btn.disabled = false; }
        alert('Unable to send message. Please call us at (603) 232-4513.');
      });
    });
  }

  /* ── 5. Blog filter buttons ── */
  var filterBtns = document.querySelectorAll('.blog-filter-btn');
  var blogCards = document.querySelectorAll('.blog-card[data-category]');
  if (filterBtns.length && blogCards.length) {
    function applyBlogFilter(cat) {
      filterBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-filter') === cat);
      });
      blogCards.forEach(function (card) {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { applyBlogFilter(this.getAttribute('data-filter')); });
    });

    /* Apply filter from URL query param: e.g. blog/index.html?filter=rcm
       Normalize aliases so article-tag links like ?filter=ai-automation
       map to the matching data-filter="ai" button value. */
    var urlFilter = new URLSearchParams(window.location.search).get('filter');
    if (urlFilter) {
      var filterAliases = {
        'ai-automation': 'ai',
        'ai-calling':    'ai',
        'hl7-integration': 'hl7',
        'fhir':          'hl7',
        'billing':       'rcm',
        'medical-billing': 'rcm'
      };
      var normalizedFilter = filterAliases[urlFilter] || urlFilter;
      /* Defer so the DOM is fully ready for any late-rendered cards */
      setTimeout(function () { applyBlogFilter(normalizedFilter); }, 0);
    }
  }

  /* ── 6. Dynamic copyright year ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 7. Active nav link highlighting ── */
  (function () {
    var pathname = window.location.pathname; // e.g. '/blog/some-post.html'
    var segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
    // segments for '/blog/post.html' → ['blog', 'post.html']
    // segments for '/contact.html' → ['contact.html']
    var filename = segments.length ? segments[segments.length - 1] : 'index.html';
    var topDir   = segments.length > 1 ? segments[0] : ''; // 'blog' if inside blog/

    document.querySelectorAll('.nav-links a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var hrefParts = href.split('/');
      var hrefFile  = hrefParts[hrefParts.length - 1];
      var hrefDir   = hrefParts.length > 1 ? hrefParts[0] : '';

      if (hrefDir && hrefDir === topDir) {
        // We're inside the same subdirectory as this link (e.g. /blog/ ↔ blog/index.html)
        link.classList.add('active');
      } else if (!hrefDir && !topDir && hrefFile === filename) {
        // Root-level page match (e.g. contact.html ↔ contact.html)
        link.classList.add('active');
      }
    });
  })();

  /* ── 8. Scroll reveal animations ── */
  (function () {
    if (!window.IntersectionObserver) return;
    var SELECTORS = [
      '.service-card', '.blog-card', '.stat-item', '.testimonial-card',
      '.ai-feature-card', '.value-card', '.section-header', '.emr-logo-item',
      '.process-step', '.pricing-card', '.contact-info-item', '.sidebar-widget',
      '.related-post-card', '.article-callout'
    ];
    var targets = document.querySelectorAll(SELECTORS.join(','));
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('sr'); });

    /* Group siblings so they stagger together */
    targets.forEach(function (el) {
      var siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter(function (c) { return c.classList.contains('sr'); })
        : [];
      var idx = siblings.indexOf(el);
      if (idx > 0) el.classList.add('sr--delay-' + Math.min(idx, 6));
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* ── 9. Dark / Light mode toggle ── */
  (function () {
    var STORAGE_KEY = 'omm-theme';
    var html = document.documentElement;

    var saved = localStorage.getItem(STORAGE_KEY);
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved ? saved === 'dark' : prefersDark;
    if (isDark) html.setAttribute('data-theme', 'dark');

    function updateIcon(dark) {
      document.querySelectorAll('.theme-toggle').forEach(function(btn) {
        btn.innerHTML = dark
          ? '<i class="fas fa-sun" aria-hidden="true"></i>'
          : '<i class="fas fa-moon" aria-hidden="true"></i>';
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }

    updateIcon(isDark);

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.theme-toggle');
      if (!btn) return;
      var nowDark = html.getAttribute('data-theme') === 'dark';
      if (nowDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'light');
        updateIcon(false);
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
        updateIcon(true);
      }
    });
  })();

  /* ── 10. Typing / typewriter effect ── */
  /* Reads data-typing JSON from #heroHeading or #pageHeroH1.
     Format: [{"t":"text "},{"t":"Word.","a":true,"br":true}, ...]
       t  = text content
       a  = accent colour (hero-heading-accent class)
       br = insert <br> after this segment
  */
  (function () {
    var el = document.getElementById('heroHeading') || document.getElementById('pageHeroH1');
    if (!el) return;
    var raw = el.getAttribute('data-typing');
    if (!raw) return;
    var segs;
    try { segs = JSON.parse(raw); } catch (e) { return; }

    var CHAR_MS = 40, DELETE_MS = 22, LINE_GAP = 360, END_PAUSE = 2400, START_PAUSE = 500;

    /* Build span + br skeleton */
    el.innerHTML = '';
    var spans = segs.map(function (seg) {
      var span = document.createElement('span');
      if (seg.a) span.className = 'hero-heading-accent';
      el.appendChild(span);
      if (seg.br) el.appendChild(document.createElement('br'));
      return span;
    });

    function setActive(idx) {
      spans.forEach(function (s, i) {
        s.classList.toggle('typing-active', i === idx);
      });
    }

    var si = 0, ci = 0, deleting = false;

    function typeNext() {
      if (deleting) {
        /* Delete phase */
        if (si >= 0) {
          if (ci > 0) {
            ci--;
            spans[si].textContent = segs[si].t.slice(0, ci);
            setActive(si);
            setTimeout(typeNext, DELETE_MS);
          } else {
            si--;
            if (si < 0) {
              deleting = false;
              si = 0; ci = 0;
              setTimeout(typeNext, START_PAUSE);
            } else {
              ci = segs[si].t.length;
              setTimeout(typeNext, LINE_GAP / 2);
            }
          }
        }
        return;
      }

      /* Type phase */
      if (si < segs.length) {
        if (ci <= segs[si].t.length) {
          spans[si].textContent = segs[si].t.slice(0, ci);
          setActive(si);
          ci++;
          setTimeout(typeNext, CHAR_MS);
        } else {
          var gap = segs[si].br ? LINE_GAP : CHAR_MS * 2;
          si++; ci = 0;
          setTimeout(typeNext, gap);
        }
      } else {
        /* All typed — pause then delete backwards */
        setActive(-1);
        setTimeout(function () {
          deleting = true;
          si = segs.length - 1;
          ci = segs[si].t.length;
          typeNext();
        }, END_PAUSE);
      }
    }

    setTimeout(typeNext, START_PAUSE);
  })();

  /* ── 11. Stat counter animation (.stat-number[data-count]) ── */
  (function () {
    var els = document.querySelectorAll('.stat-number[data-count]');
    if (!els.length) return;
    var DURATION = 1800;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      el.textContent = '0' + suffix;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / DURATION, 1);
        el.textContent = Math.round(easeOut(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var observed = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          els.forEach(animateCounter);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var section = document.querySelector('.stats-section');
    if (section) io.observe(section);
  })();

  /* ── 12. Dashboard KPI counter ([data-kpi-target]) ── */
  (function () {
    var els = document.querySelectorAll('[data-kpi-target]');
    if (!els.length) return;
    var DURATION = 1600;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function fmt(n, dec, prefix, suffix, comma) {
      var s = dec ? n.toFixed(dec) : Math.round(n).toString();
      if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (prefix || '') + s + (suffix || '');
    }
    function animateKpi(el) {
      var target  = parseFloat(el.getAttribute('data-kpi-target'));
      var prefix  = el.getAttribute('data-kpi-prefix') || '';
      var suffix  = el.getAttribute('data-kpi-suffix') || '';
      var dec     = parseInt(el.getAttribute('data-kpi-decimal') || '0', 10);
      var comma   = el.getAttribute('data-kpi-comma') === '1';
      var start   = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / DURATION, 1);
        el.textContent = fmt(easeOut(p) * target, dec, prefix, suffix, comma);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target, dec, prefix, suffix, comma);
      }
      requestAnimationFrame(step);
    }
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !fired) {
          fired = true;
          els.forEach(animateKpi);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var dashboard = document.querySelector('.insights-dashboard');
    if (dashboard) io.observe(dashboard);
  })();

  /* ── 13. Blog index — render cards from blog-data.js ── */
  (function () {
    if (typeof window.OMM_BLOG === 'undefined') return;
    var featured = document.getElementById('featuredPostContainer');
    var grid     = document.getElementById('blogCardsGrid');
    var root     = document.querySelector('meta[name="blog-post-root"]');
    var postRoot = root ? root.getAttribute('content') : '';
    window.OMM_BLOG.renderFeatured(featured, postRoot);
    window.OMM_BLOG.renderGrid(grid, postRoot);
  })();

})();
