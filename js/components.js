/* ============================================================
   ORCHARD MEDICAL MANAGEMENT — Shared Components
   Injects navbar + footer into every page.
   Usage:  <script src="js/components.js" data-depth="0" defer></script>
   data-depth="0"  → root pages  (index.html, services.html …)
   data-depth="1"  → sub pages   (blog/*.html)
   ============================================================ */

(function () {
  'use strict';

  /* ── Resolve path depth ── */
  var scriptTag = document.querySelector('script[src*="components.js"]');
  var depth     = scriptTag ? parseInt(scriptTag.getAttribute('data-depth') || '0', 10) : 0;
  var R         = depth > 0 ? '../' : '';   // root-relative prefix

  /* Current page file for active-link detection */
  var pathParts  = window.location.pathname.replace(/\/$/, '').split('/');
  var currentFile = pathParts[pathParts.length - 1] || 'index.html';
  var inBlog      = window.location.pathname.indexOf('/blog/') !== -1;

  /* ── Build a nav <li> with active detection ── */
  function li(href, label, isBlogLink) {
    var resolvedHref;
    if (isBlogLink && depth > 0) {
      resolvedHref = 'index.html';           // already inside /blog/
    } else {
      resolvedHref = R + href;
    }
    var isActive = isBlogLink
      ? inBlog
      : (!inBlog && (href === currentFile ||
          (href === 'index.html' && (currentFile === '' || currentFile === 'index.html'))));
    return '<li><a href="' + resolvedHref + '"' +
           (isActive ? ' class="active"' : '') + '>' + label + '</a></li>';
  }

  /* ── NAVBAR HTML ── */
  var NAV_LINKS = [
    li('index.html',        'Home'),
    li('services.html',     'Services'),
    li('ai-automation.html','AI &amp; Automation'),
    li('about.html',        'About'),
    li('blog/index.html',   'Blog',  true),
    li('contact.html',      'Contact'),
  ].join('');

  var NAV = '\
<nav class="navbar' + (depth > 0 ? ' navbar--solid' : '') + '" id="navbar" role="navigation" aria-label="Main navigation">\
  <div class="container nav-inner">\
    <a href="' + R + 'index.html" class="nav-logo" aria-label="Orchard Medical Management Home">\
      <img src="' + R + 'images/omm-logo.png" alt="Orchard Medical Management Logo" />\
    </a>\
    <ul class="nav-links" role="list">' + NAV_LINKS + '</ul>\
    <div class="nav-cta">\
      <a href="tel:6032324513" class="nav-phone"><i class="fas fa-phone-alt" aria-hidden="true"></i>(603) 232-4513</a>\
      <a href="' + R + 'contact.html" class="btn-primary btn-sm">Get Started</a>\
      <button class="theme-toggle" aria-label="Switch to dark mode" title="Toggle dark/light mode"><i class="fas fa-moon" aria-hidden="true"></i></button>\
    </div>\
    <button class="hamburger" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false">\
      <span></span><span></span><span></span>\
    </button>\
  </div>\
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">\
    <ul role="list">\
      <li><a href="' + R + 'index.html">Home</a></li>\
      <li><a href="' + R + 'services.html">Services</a></li>\
      <li><a href="' + R + 'ai-automation.html">AI &amp; Automation</a></li>\
      <li><a href="' + R + 'about.html">About</a></li>\
      <li><a href="' + (depth > 0 ? '' : R + 'blog/') + 'index.html">Blog</a></li>\
      <li><a href="' + R + 'contact.html">Contact</a></li>\
    </ul>\
    <a href="tel:6032324513" class="mobile-phone">(603) 232-4513</a>\
    <a href="' + R + 'contact.html" class="btn-primary mobile-menu-cta">Get Started</a>\
  </div>\
</nav>';

  /* ── FOOTER HTML ── */
  var FOOTER = '\
<footer class="footer" id="resources">\
  <div class="container footer-grid">\
    <div class="footer-brand">\
      <a href="' + R + 'index.html" class="footer-logo" aria-label="Orchard Medical Management">\
        <img src="' + R + 'images/omm-logo.png" alt="Orchard Medical Management" />\
      </a>\
      <p class="footer-tagline">Fortifying private practices through AI-powered financial and operational excellence since 2004.</p>\
      <div class="footer-social">\
        <a href="https://www.linkedin.com/company/orchard-medical-management-llc/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>\
        <a href="https://www.facebook.com/people/Orchard-Medical-Management/61584795752793/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>\
      </div>\
    </div>\
    <div class="footer-col">\
      <h3 class="footer-col-heading">Services</h3>\
      <ul class="footer-links" role="list">\
        <li><a href="' + R + 'services.html#rcm">Revenue Cycle Management</a></li>\
        <li><a href="' + R + 'services.html#pm">Practice Management</a></li>\
        <li><a href="' + R + 'services.html#hr">Human Resources</a></li>\
        <li><a href="' + R + 'services.html#cred">Credentialing</a></li>\
        <li><a href="' + R + 'services.html#patriot-pay">Patriot Pay &mdash; Patient AR</a></li>\
        <li><a href="' + R + 'ai-automation.html#calling">AI Calling Agent</a></li>\
        <li><a href="' + R + 'ai-automation.html#hl7">HL7 Integration</a></li>\
        <li><a href="' + R + 'ai-automation.html#scheduling">Automated Scheduling</a></li>\
        <li><a href="' + R + 'ai-automation.html#insights">AI Practice Insights</a></li>\
      </ul>\
    </div>\
    <div class="footer-col">\
      <h3 class="footer-col-heading">Company</h3>\
      <ul class="footer-links" role="list">\
        <li><a href="' + R + 'index.html">Home</a></li>\
        <li><a href="' + R + 'about.html">About OMM</a></li>\
        <li><a href="' + R + 'about.html#values">Our Values</a></li>\
        <li><a href="' + (depth > 0 ? '' : R + 'blog/') + 'index.html">Blog &amp; Resources</a></li>\
        <li><a href="' + R + 'contact.html#careers">Careers</a></li>\
        <li><a href="' + R + 'contact.html">Contact Us</a></li>\
      </ul>\
    </div>\
    <div class="footer-col">\
      <h3 class="footer-col-heading">Contact</h3>\
      <address class="footer-address">\
        <p><a href="tel:6032324513">(603) 232-4513</a></p>\
        <p>Manchester, NH</p>\
      </address>\
      <a href="' + R + 'contact.html" class="btn-primary btn-sm">Get In Touch</a>\
    </div>\
  </div>\
  <div class="footer-bottom">\
    <div class="container footer-bottom-inner">\
      <p class="footer-copy">&copy; <span id="year"></span> Orchard Medical Management LLC. All rights reserved.</p>\
      <div class="footer-legal">\
        <a href="#">Privacy Policy</a><span aria-hidden="true">&middot;</span>\
        <a href="' + R + 'terms-of-use.html">Terms of Use</a>\
      </div>\
    </div>\
  </div>\
</footer>';

  /* ── Inject on DOM ready ── */
  function inject() {
    var navSlot    = document.getElementById('site-nav');
    var footerSlot = document.getElementById('site-footer');
    if (navSlot)    navSlot.outerHTML    = NAV;
    if (footerSlot) footerSlot.outerHTML = FOOTER;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

}());
