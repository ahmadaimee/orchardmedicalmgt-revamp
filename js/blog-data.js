/* ============================================================
   ORCHARD MEDICAL MANAGEMENT — Blog Post Registry
   Add every post here. blog/index.html renders cards from this.
   ============================================================ */

window.OMM_POSTS = [
  {
    slug:     'ai-automation-healthcare-guide',
    title:    'The Complete Guide to AI Automation in Medical Practice Management',
    excerpt:  'From AI calling agents to automated payment posting — a complete breakdown of how modern AI tools are helping medical practices do more with less.',
    category: 'ai',
    categoryLabel: 'AI &amp; Automation',
    date:     '2025-04-10',
    dateLabel:'April 10, 2025',
    readTime: '12 min read',
    tags:     ['AI Calling Agent','Automated Billing','EMR Integration','HL7 & FHIR'],
    featured: true,
  },
  {
    slug:     'hl7-fhir-integration-guide',
    title:    'The Complete Guide to HL7 &amp; FHIR Integration for Medical Practices',
    excerpt:  'Everything NH private practices need to know about HL7 and FHIR data exchange — from ADT messages to FHIR APIs and how OMM makes it seamless.',
    category: 'hl7',
    categoryLabel: 'HL7 &amp; Integration',
    date:     '2025-03-18',
    dateLabel:'March 18, 2025',
    readTime: '14 min read',
    tags:     ['HL7','FHIR','EMR Integration','Interoperability'],
    featured: false,
  },
  {
    slug:     'revenue-cycle-management-2026',
    title:    'Revenue Cycle Management in 2026: What Every Manchester, NH Private Practice Needs to Know',
    excerpt:  'Payer mix shifts, AI-assisted coding, and tightening reimbursements — here\'s how to position your practice\'s RCM strategy for the year ahead.',
    category: 'rcm',
    categoryLabel: 'Revenue Cycle',
    date:     '2025-03-05',
    dateLabel:'March 5, 2025',
    readTime: '10 min read',
    tags:     ['Revenue Cycle','Medical Billing','Denial Management','New Hampshire'],
    featured: false,
  },
  {
    slug:     'revenue-cycle-management-best-practices',
    title:    '10 Revenue Cycle Management Best Practices for Private Practices',
    excerpt:  'Proven strategies to reduce claim denials, accelerate collections, and maximize revenue — tailored for independent practices in New Hampshire.',
    category: 'rcm',
    categoryLabel: 'Revenue Cycle',
    date:     '2025-02-20',
    dateLabel:'February 20, 2025',
    readTime: '9 min read',
    tags:     ['RCM Best Practices','Clean Claims','Collections','Prior Authorization'],
    featured: false,
  },
  {
    slug:     'patient-acquisition-strategies-private-practices',
    title:    'Patient Acquisition Strategies That Work: How Private Practices Can Compete and Grow',
    excerpt:  'How to attract new patients and retain existing ones — from online reputation management to AI-driven outreach and scheduling automation.',
    category: 'pm',
    categoryLabel: 'Practice Management',
    date:     '2025-02-10',
    dateLabel:'February 10, 2025',
    readTime: '8 min read',
    tags:     ['Patient Acquisition','Practice Growth','Online Reputation','Scheduling'],
    featured: false,
  },
  {
    slug:     'financial-management-budgeting-medical-practices',
    title:    'Financial Management and Budgeting for Medical Practices',
    excerpt:  'A practical guide to cash flow planning, expense management, and financial forecasting for independent medical practices.',
    category: 'pm',
    categoryLabel: 'Practice Management',
    date:     '2025-01-28',
    dateLabel:'January 28, 2025',
    readTime: '7 min read',
    tags:     ['Financial Management','Budgeting','Cash Flow','Practice Operations'],
    featured: false,
  },
  {
    slug:     'employer-benefits-healthcare-practices',
    title:    'Why Employer Benefits Are the Secret Weapon for Healthcare Practices in Manchester, NH',
    excerpt:  'Competitive benefits packages don\'t just attract great staff — they reduce turnover, improve morale, and protect your practice\'s bottom line.',
    category: 'hr',
    categoryLabel: 'Human Resources',
    date:     '2025-01-15',
    dateLabel:'January 15, 2025',
    readTime: '6 min read',
    tags:     ['Employee Benefits','Staff Retention','HR','Healthcare Staffing'],
    featured: false,
  },
  {
    slug:     'healthcare-purchasing-solutions',
    title:    'Healthcare Purchasing Solutions for Medical Practices',
    excerpt:  'Smart procurement strategies that reduce supply costs, streamline vendor management, and free up budget for patient care.',
    category: 'pm',
    categoryLabel: 'Practice Management',
    date:     '2025-01-05',
    dateLabel:'January 5, 2025',
    readTime: '6 min read',
    tags:     ['Purchasing','Supply Chain','Cost Reduction','Operations'],
    featured: false,
  },
  {
    slug:     'payment-processing-costs-medical-practices',
    title:    'Enhancing Operational Efficiency by Reducing Payment Processing Costs for Medical Practices',
    excerpt:  'Credit card fees, clearinghouse charges, and payment platform costs add up fast. Here\'s how to cut them without sacrificing patient experience.',
    category: 'rcm',
    categoryLabel: 'Revenue Cycle',
    date:     '2024-12-18',
    dateLabel:'December 18, 2024',
    readTime: '7 min read',
    tags:     ['Payment Processing','Cost Reduction','Patient Payments','Operations'],
    featured: false,
  },
];

/* ── Render blog cards dynamically (used by blog/index.html) ── */
window.OMM_BLOG = {

  CATEGORY_LABELS: {
    all:  'All Posts',
    ai:   'AI &amp; Automation',
    rcm:  'Revenue Cycle',
    pm:   'Practice Management',
    hr:   'Human Resources',
    hl7:  'HL7 &amp; Integration',
  },

  /* Render the featured post card (first post with featured:true) */
  renderFeatured: function (container, root) {
    var post = window.OMM_POSTS.find(function (p) { return p.featured; });
    if (!post || !container) return;
    container.innerHTML = '\
<article class="featured-post-card blog-card" data-category="' + post.category + '">\
  <div class="featured-post-content">\
    <span class="blog-tag">' + post.categoryLabel + '</span>\
    <h2 class="featured-post-title">' + post.title + '</h2>\
    <p class="featured-post-excerpt">' + post.excerpt + '</p>\
    <div class="featured-post-meta">\
      <span><i class="fas fa-calendar" aria-hidden="true"></i> ' + post.dateLabel + '</span>\
      <span><i class="fas fa-clock" aria-hidden="true"></i> ' + post.readTime + '</span>\
    </div>\
    <a href="' + root + post.slug + '.html" class="btn-primary">Read Article <i class="fas fa-arrow-right" aria-hidden="true"></i></a>\
  </div>\
</article>';
  },

  /* Render all non-featured post cards into a grid container */
  renderGrid: function (container, root) {
    if (!container) return;
    var posts = window.OMM_POSTS.filter(function (p) { return !p.featured; });
    container.innerHTML = posts.map(function (p) {
      return '\
<article class="blog-card" data-category="' + p.category + '">\
  <div class="blog-card-body">\
    <span class="blog-tag">' + p.categoryLabel + '</span>\
    <h3 class="blog-card-title"><a href="' + root + p.slug + '.html">' + p.title + '</a></h3>\
    <p class="blog-card-excerpt">' + p.excerpt + '</p>\
  </div>\
  <div class="blog-card-footer">\
    <span class="blog-card-date"><i class="fas fa-calendar" aria-hidden="true"></i> ' + p.dateLabel + '</span>\
    <span class="blog-card-time"><i class="fas fa-clock" aria-hidden="true"></i> ' + p.readTime + '</span>\
  </div>\
</article>';
    }).join('');
  },
};
