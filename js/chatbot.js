(function () {
  'use strict';

  /* ── Knowledge base ── */
  var KB = [
    {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'howdy'],
      response: "Hi there! 👋 I'm Robert, your OMM assistant. How can I help your practice today?",
      quick: ['Our services', 'Contact info', 'Get a quote']
    },
    {
      patterns: ['service', 'services', 'what do you do', 'offer', 'offerings', 'help with'],
      response: "OMM offers five core services for private practices:\n\n• <strong>Revenue Cycle Management</strong> — maximize collections & reduce denials\n• <strong>Practice Management</strong> — streamline daily operations\n• <strong>Human Resources</strong> — hiring, compliance & staff management\n• <strong>Credentialing</strong> — provider enrollment & payer credentialing\n• <strong>Patriot Pay</strong> — intelligent patient AR & collections\n\nWe also offer AI & automation solutions. Which area interests you?",
      quick: ['Revenue Cycle', 'Credentialing', 'Patriot Pay', 'AI & Automation']
    },
    {
      patterns: ['revenue', 'rcm', 'billing', 'claim', 'claims', 'collections', 'denial', 'reimbursement'],
      response: "Our <strong>Revenue Cycle Management</strong> team handles the full billing lifecycle — from charge capture and claim submission to denial management and appeals. We work with 15+ EMR platforms and consistently achieve industry-leading collection rates. Want to learn more or schedule a call?",
      quick: ['Schedule a call', 'Learn more', 'Other services']
    },
    {
      patterns: ['credentialing', 'credential', 'enrollment', 'payer', 'provider enrollment', 'caqh'],
      response: "Our <strong>Credentialing</strong> specialists handle everything — CAQH profiles, payer applications, re-credentialing, and hospital privileges. We track every deadline so your providers are always billable. Typical turnaround is faster than industry average.",
      quick: ['Get started', 'Contact us', 'Other services']
    },
    {
      patterns: ['hr', 'human resource', 'hiring', 'staff', 'employee', 'compliance', 'payroll', 'onboard'],
      response: "Our <strong>Human Resources</strong> service covers recruitment, onboarding, policy development, compliance training, and staff performance management — tailored specifically for medical practices.",
      quick: ['Get started', 'Contact us', 'Other services']
    },
    {
      patterns: ['practice management', 'operations', 'scheduling', 'workflow', 'efficiency'],
      response: "Our <strong>Practice Management</strong> service optimizes day-to-day operations — appointment scheduling, patient flow, reporting, and operational efficiency — so physicians can focus entirely on patient care.",
      quick: ['Get started', 'Contact us', 'Other services']
    },
    {
      patterns: ['ai', 'automation', 'artificial intelligence', 'automated', 'bot', 'calling agent', 'hl7', 'fhir'],
      response: "OMM deploys cutting-edge <strong>AI & Automation</strong> across your practice — AI calling agents for appointment reminders, HL7/FHIR integrations, automated prior auth, intelligent denial prediction, and real-time practice analytics. <a href='ai-automation.html' style='color:var(--color-accent);'>Explore AI solutions →</a>",
      quick: ['See AI features', 'Contact us', 'Other services']
    },
    {
      patterns: ['price', 'cost', 'pricing', 'fee', 'how much', 'rate', 'quote'],
      response: "Pricing is tailored to your practice's size, specialty, and the services you need — so there's no one-size-fits-all number. The best next step is a quick discovery call where we can give you a precise proposal. Ready to connect?",
      quick: ['Schedule a call', 'Contact us']
    },
    {
      patterns: ['emr', 'ehr', 'epic', 'athena', 'eclinicalworks', 'cerner', 'kareo', 'tebra', 'drchrono', 'advancedmd', 'modmed', 'nextgen', 'allscripts'],
      response: "OMM has integrated with <strong>15+ leading EMR platforms</strong> including Epic, Athenahealth, eClinicalWorks, Oracle Health (Cerner), Kareo/Tebra, AdvancedMD, ModMed, DrChrono, NextGen, Allscripts, and more. If your practice uses it, we've integrated it.",
      quick: ['Our services', 'Contact us']
    },
    {
      patterns: ['contact', 'phone', 'call', 'reach', 'email', 'talk', 'speak', 'get in touch'],
      response: "You can reach the OMM team at:\n\n📞 <strong>(603) 232-4513</strong>\n📠 Fax: (603) 232-4563\n📍 Manchester, New Hampshire\n\nOr <a href='contact.html' style='color:var(--color-accent);'>fill out our contact form →</a> and we'll respond within one business day.",
      quick: ['Schedule a call', 'Our services']
    },
    {
      patterns: ['location', 'address', 'where', 'manchester', 'new hampshire', 'nh', 'office'],
      response: "OMM is based in <strong>Manchester, New Hampshire</strong> and serves private practices across New England and beyond.",
      quick: ['Contact us', 'Our services']
    },
    {
      patterns: ['about', 'who are you', 'company', 'history', 'founded', 'since', 'team', 'experience'],
      response: "Orchard Medical Management (OMM) has been <strong>fortifying private practices since 2004</strong>. We partner with some of New Hampshire's largest independent practices — including the state's largest FQHC, largest independent PT practice (9 locations), and largest independent GI group. <a href='about.html' style='color:var(--color-accent);'>Learn more about us →</a>",
      quick: ['Our services', 'Contact us']
    },
    {
      patterns: ['patriot pay', 'patriotpay', 'patient ar', 'patient billing', 'patient collections', 'patient payment', 'outstanding balance', 'ar management'],
      response: "<strong>Patriot Pay</strong> is OMM's intelligent Patient AR Management solution. It automates patient outreach via email, SMS & phone — resolving over <strong>90% of billing questions instantly</strong> — while offering easy-to-understand bill summaries, flexible payment options, and real-time collection tracking. <a href='services.html#patriot-pay' style='color:var(--color-accent);'>Learn more →</a> or visit <a href='https://patriotpay.ai' target='_blank' style='color:var(--color-accent);'>PatriotPay.ai</a>",
      quick: ['Get started', 'Our services', 'Contact us']
    },
    {
      patterns: ['career', 'careers', 'job', 'jobs', 'hire', 'hiring', 'work for', 'join', 'position', 'opening'],
      response: "OMM is always looking for talented professionals in healthcare administration, billing, credentialing, and HR. <a href='careers.html' style='color:var(--color-accent);'>View open positions →</a>",
      quick: ['Contact us', 'Our services']
    },
    {
      patterns: ['blog', 'resource', 'article', 'guide', 'insight', 'read'],
      response: "Check out our <a href='blog/index.html' style='color:var(--color-accent);'>Resources & Insights blog →</a> for in-depth guides on revenue cycle management, AI in healthcare, credentialing, and practice growth strategies.",
      quick: ['Our services', 'Contact us']
    },
    {
      patterns: ['schedule', 'appointment', 'meeting', 'demo', 'consultation', 'discovery'],
      response: "I'd love to connect you with our team! The easiest way is to <a href='contact.html' style='color:var(--color-accent);'>fill out our contact form →</a> or call us directly at <strong>(603) 232-4513</strong>. We'll schedule a 30-minute discovery call at your convenience.",
      quick: ['Contact form', 'Call us']
    },
    {
      patterns: ['thank', 'thanks', 'great', 'awesome', 'perfect', 'helpful'],
      response: "You're very welcome! Is there anything else I can help you with? 😊",
      quick: ['Our services', 'Contact us', 'That\'s all']
    },
    {
      patterns: ['bye', 'goodbye', 'done', "that's all", 'no thanks', 'nothing else'],
      response: "Thanks for chatting! Feel free to reach out anytime. Have a great day! 👋",
      quick: []
    }
  ];

  var DEFAULT_RESPONSE = "I'm not sure about that, but I'd be happy to connect you with our team who can help directly. You can call <strong>(603) 232-4513</strong> or <a href='contact.html' style='color:var(--color-accent);'>send us a message →</a>";
  var DEFAULT_QUICK = ['Our services', 'Contact us', 'Phone number'];

  function findResponse(input) {
    var lower = input.toLowerCase().trim();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].patterns.length; j++) {
        if (lower.indexOf(KB[i].patterns[j]) !== -1) {
          return KB[i];
        }
      }
    }
    return null;
  }

  /* ── Build widget HTML ── */
  var widget = document.createElement('div');
  widget.id = 'chatbotWidget';
  widget.className = 'chatbot-widget';
  widget.setAttribute('aria-live', 'polite');
  widget.innerHTML = [
    '<div class="chatbot-window" id="chatbotWindow" aria-hidden="true" role="dialog" aria-label="OMM Chat Assistant">',
      '<div class="chatbot-header">',
        '<div class="chatbot-header-info">',
          '<div class="chatbot-avatar"><i class="fas fa-comment-medical" aria-hidden="true"></i></div>',
          '<div>',
            '<div class="chatbot-name">Robert</div>',
            '<div class="chatbot-status"><span class="chatbot-online-dot" aria-hidden="true"></span>Typically replies instantly</div>',
          '</div>',
        '</div>',
        '<button class="chatbot-close" id="chatbotClose" aria-label="Close chat"><i class="fas fa-times" aria-hidden="true"></i></button>',
      '</div>',
      '<div class="chatbot-messages" id="chatbotMessages"></div>',
      '<div class="chatbot-quick-replies" id="chatbotQuickReplies"></div>',
      '<div class="chatbot-input-row">',
        '<input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask a question…" autocomplete="off" aria-label="Type your message" />',
        '<button class="chatbot-send" id="chatbotSend" aria-label="Send message"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>',
      '</div>',
    '</div>',
    '<button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chat assistant" aria-expanded="false">',
      '<i class="fas fa-comment-dots chatbot-icon-open" aria-hidden="true"></i>',
      '<i class="fas fa-times chatbot-icon-close" aria-hidden="true"></i>',
      '<span class="chatbot-unread" id="chatbotUnread" aria-label="1 new message">1</span>',
    '</button>'
  ].join('');
  document.body.appendChild(widget);

  /* ── References ── */
  var toggleBtn  = document.getElementById('chatbotToggle');
  var closeBtn   = document.getElementById('chatbotClose');
  var window_    = document.getElementById('chatbotWindow');
  var messages   = document.getElementById('chatbotMessages');
  var quickWrap  = document.getElementById('chatbotQuickReplies');
  var input      = document.getElementById('chatbotInput');
  var sendBtn    = document.getElementById('chatbotSend');
  var unread     = document.getElementById('chatbotUnread');
  var isOpen     = false;
  var greeted    = false;

  /* ── Helpers ── */
  function scrollBottom() {
    setTimeout(function () { messages.scrollTop = messages.scrollHeight; }, 60);
  }

  function sanitize(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  function addMessage(text, role) {
    var row = document.createElement('div');
    row.className = 'chatbot-msg-row chatbot-msg-' + role;
    var bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    // Bot messages come from hardcoded KB and may contain intentional HTML (<strong>, <a>)
    // User messages are sanitized to prevent XSS before rendering
    if (role === 'user') {
      bubble.innerHTML = sanitize(text).replace(/\n/g, '<br>');
    } else {
      bubble.innerHTML = text.replace(/\n/g, '<br>');
    }
    row.appendChild(bubble);
    messages.appendChild(row);
    scrollBottom();
  }

  function addTyping() {
    var row = document.createElement('div');
    row.className = 'chatbot-msg-row chatbot-msg-bot chatbot-typing-row';
    row.id = 'chatbotTyping';
    row.innerHTML = '<div class="chatbot-bubble chatbot-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(row);
    scrollBottom();
    return row;
  }

  function setQuickReplies(replies) {
    quickWrap.innerHTML = '';
    if (!replies || !replies.length) return;
    replies.forEach(function (label) {
      var btn = document.createElement('button');
      btn.className = 'chatbot-quick-btn';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        handleUserMessage(label);
      });
      quickWrap.appendChild(btn);
    });
  }

  function botReply(text, quick) {
    var typing = addTyping();
    var delay = Math.min(600 + text.length * 10, 1800);
    setTimeout(function () {
      typing.remove();
      addMessage(text, 'bot');
      setQuickReplies(quick || DEFAULT_QUICK);
    }, delay);
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    setQuickReplies([]);
    input.value = '';

    var match = findResponse(text);
    if (match) {
      botReply(match.response, match.quick);
    } else {
      botReply(DEFAULT_RESPONSE, DEFAULT_QUICK);
    }
  }

  function openChat() {
    isOpen = true;
    window_.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    widget.classList.add('chatbot-open');
    unread.style.display = 'none';

    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addMessage("👋 Hi! I'm <strong>Robert</strong>, your OMM assistant. How can I help your practice today?", 'bot');
        setQuickReplies(['Our services', 'Contact info', 'AI & Automation', 'Pricing']);
      }, 300);
    }
    setTimeout(function () { input.focus(); }, 400);
  }

  function closeChat() {
    isOpen = false;
    window_.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    widget.classList.remove('chatbot-open');
  }

  /* ── Events ── */
  toggleBtn.addEventListener('click', function () {
    isOpen ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  sendBtn.addEventListener('click', function () {
    handleUserMessage(input.value);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleUserMessage(input.value);
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* Show unread badge after 4 s if chat hasn't been opened */
  setTimeout(function () {
    if (!greeted) {
      unread.style.display = 'flex';
      toggleBtn.classList.add('chatbot-pulse');
    }
  }, 4000);

}());
