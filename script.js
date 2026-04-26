// G3 Innovative - Interactive Scripts

document.addEventListener('DOMContentLoaded', function() {

  // ================================
  // NAVBAR SCROLL EFFECT
  // ================================
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load

  // ================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================
  // MOBILE MENU TOGGLE
  // ================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.querySelector('i').classList.toggle('fa-bars');
      this.querySelector('i').classList.toggle('fa-times');
    });
  }

  // ================================
  // SCROLL REVEAL ANIMATIONS
  // ================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add reveal animations to elements
  const animateElements = document.querySelectorAll(
    '.service-card, .value-prop, .result-card, .testimonial-card, .visual-card'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // CSS for revealed state
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ================================
  // COUNTER ANIMATION
  // ================================
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number
      if (target >= 100000000) {
        element.textContent = '$' + Math.floor(current / 1000000) + 'MM+';
      } else if (target >= 1000000) {
        element.textContent = '$' + (current / 1000000).toFixed(1) + 'M+';
      } else if (target >= 1000) {
        element.textContent = Math.floor(current).toLocaleString() + '+';
      } else if (target === 98) {
        element.textContent = Math.floor(current) + '%';
      } else if (Number.isInteger(target)) {
        element.textContent = Math.floor(current) + '+';
      }
    }, 16);
  }

  // Observe stats for counter animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number, .result-number');
        statNumbers.forEach(stat => {
          const text = stat.textContent;
          if (text.includes('$250MM')) {
            animateCounter(stat, 250000000);
          } else if (text.includes('$2.4M')) {
            animateCounter(stat, 2400000);
          } else if (text.includes('98%')) {
            animateCounter(stat, 98);
          } else if (text.includes('50+')) {
            animateCounter(stat, 50);
          } else if (text.includes('10+')) {
            animateCounter(stat, 10);
          } else if (text.includes('15+')) {
            animateCounter(stat, 15);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  const resultsSection = document.querySelector('.results');
  if (statsSection) statsObserver.observe(statsSection);
  if (resultsSection) statsObserver.observe(resultsSection);

  // ================================
  // FORM HANDLING
  // ================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#00d4aa';

        // Show success notification
        showNotification('Thank you! We\'ll be in touch within 24 hours.', 'success');

        // Reset form after delay
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // Notification helper
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#00d4aa' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: ${type === 'success' ? '#0a2540' : '#fff'};
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Add notification animations
  const notificationStyles = document.createElement('style');
  notificationStyles.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(notificationStyles);

  // ================================
  // INTERACTIVE HERO CARDS
  // ================================
  const heroCards = document.querySelectorAll('.hero-card');

  // Drag interaction
  heroCards.forEach(card => {
    let isDragging = false;
    let startX, startY, dragX, dragY;

    card.addEventListener('mousedown', (e) => {
      isDragging = true;
      card.classList.add('dragging');
      card.classList.remove('snap-back');
      startX = e.clientX;
      startY = e.clientY;
      dragX = 0;
      dragY = 0;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      dragX = e.clientX - startX;
      dragY = e.clientY - startY;
      const rotation = dragX * 0.1;
      card.style.transform = `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg) scale(1.08)`;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('dragging');
      card.classList.add('snap-back');
      card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';

      setTimeout(() => {
        card.classList.remove('snap-back');
      }, 600);
    });

    // Touch support
    card.addEventListener('touchstart', (e) => {
      isDragging = true;
      card.classList.add('dragging');
      card.classList.remove('snap-back');
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragX = 0;
      dragY = 0;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      dragX = e.touches[0].clientX - startX;
      dragY = e.touches[0].clientY - startY;
      const rotation = dragX * 0.1;
      card.style.transform = `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg) scale(1.08)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('dragging');
      card.classList.add('snap-back');
      card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';

      setTimeout(() => {
        card.classList.remove('snap-back');
      }, 600);
    });
  });

  // ================================
  // HERO WORD CYCLE ANIMATION
  // ================================
  const heroHighlight = document.querySelector('.hero h1 .highlight');
  if (heroHighlight) {
    const words = ['Revenue', 'Profit', 'Accuracy', 'Growth', 'Potential', 'Innovation'];
    let wordIndex = 0;

    function cycleWord() {
      wordIndex++;
      const isLast = wordIndex === words.length - 1;

      heroHighlight.classList.add('word-exit');
      setTimeout(() => {
        heroHighlight.textContent = words[wordIndex];
        heroHighlight.classList.remove('word-exit');
        heroHighlight.classList.add(isLast ? 'word-enter-final' : 'word-enter');

        if (!isLast) {
          setTimeout(() => {
            heroHighlight.classList.remove('word-enter');
            setTimeout(cycleWord, 500);
          }, 400);
        }
      }, 300);
    }

    setTimeout(cycleWord, 250);
  }

  // ================================
  // SCROLL REVEAL FOR NEW SECTIONS
  // ================================
  const detailElements = document.querySelectorAll(
    '.detail-feature, .detail-stats-card, .assessment-card'
  );
  detailElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
    observer.observe(el);
  });

  // ================================
  // SERVICE CARD ACCENT + METRIC BARS
  // ================================
  document.querySelectorAll('.service-card[data-accent]').forEach(card => {
    card.style.setProperty('--card-accent', card.dataset.accent);
  });

  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.service-metric-fill').forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 150 + 200);
        });
        metricObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const servicesSection = document.querySelector('.services-grid');
  if (servicesSection) metricObserver.observe(servicesSection);

  // Style select dropdowns: gray when placeholder, dark when value chosen
  document.querySelectorAll('.form-group select').forEach(select => {
    select.addEventListener('change', function() {
      this.style.color = this.value ? '' : '';
      this.classList.toggle('has-value', !!this.value);
    });
  });

});

// ================================
// CONSULTATION TOOL
// ================================
let currentStep = 1;

function openConsultation(preselect) {
  const overlay = document.getElementById('consultationOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset to step 1
  currentStep = 1;
  showStep(1);
  updateProgress(1);

  // Pre-select service if specified
  if (preselect) {
    const checkbox = document.querySelector(`input[name="services"][value="${preselect}"]`);
    if (checkbox) checkbox.checked = true;
  }
}

function closeConsultation() {
  const overlay = document.getElementById('consultationOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  // Reset form after close
  setTimeout(() => {
    resetConsultation();
  }, 300);
}

function resetConsultation() {
  // Reset all inputs
  document.querySelectorAll('.consultation-modal input[type="radio"]').forEach(el => el.checked = false);
  document.querySelectorAll('.consultation-modal input[type="checkbox"]').forEach(el => el.checked = false);
  document.querySelectorAll('.consultation-modal select').forEach(el => el.selectedIndex = 0);
  document.querySelectorAll('.consultation-modal input[type="text"], .consultation-modal input[type="email"], .consultation-modal input[type="tel"], .consultation-modal textarea').forEach(el => el.value = '');

  document.querySelector('.consultation-header').style.display = '';
  currentStep = 1;
  showStep(1);
  updateProgress(1);
}

function showStep(step) {
  document.querySelectorAll('.consultation-step').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(step === 5 ? 'stepSuccess' : `step${step}`);
  if (target) target.classList.add('active');

  // Scroll modal to top
  document.querySelector('.consultation-modal').scrollTop = 0;
}

function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  fill.style.width = `${(step / 3) * 100}%`;

  document.querySelectorAll('.progress-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (s === step) el.classList.add('active');
    if (s < step) el.classList.add('completed');
  });
}

function goToStep(step) {
  if (step < currentStep) {
    currentStep = step;
    showStep(step);
    updateProgress(step);
  }
}

function nextStep(step) {
  // Validation
  if (currentStep === 1) {
    const roleSelected = document.querySelector('input[name="role"]:checked');
    const orgType = document.getElementById('orgType').value;
    if (!roleSelected || !orgType) {
      showConsultNotification('Please select your role and organization type.', 'error');
      return;
    }
  }

  if (currentStep === 2) {
    const servicesChecked = document.querySelectorAll('input[name="services"]:checked');
    if (servicesChecked.length === 0) {
      showConsultNotification('Please select at least one service of interest.', 'error');
      return;
    }
  }

  currentStep = step;
  showStep(step);
  updateProgress(step);
}

function prevStep(step) {
  currentStep = step;
  showStep(step);
  updateProgress(step);
}

function submitConsultation() {
  const name = document.getElementById('consultName').value.trim();
  const email = document.getElementById('consultEmail').value.trim();

  if (!name || !email) {
    showConsultNotification('Please enter your name and email address.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showConsultNotification('Please enter a valid email address.', 'error');
    return;
  }

  const consultData = {
    name: name,
    email: email,
    phone: document.getElementById('consultPhone').value,
    company: document.getElementById('consultCompany').value,
    role: document.querySelector('input[name="role"]:checked')?.value,
    orgType: document.getElementById('orgType').value,
    orgState: document.getElementById('orgState').value,
    expectedRevenue: document.getElementById('expectedRevenue').value,
    services: Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value),
    challenges: Array.from(document.querySelectorAll('input[name="challenges"]:checked')).map(el => el.value),
    referralSource: document.getElementById('consultReferral').value
  };

  console.log('Consultation submission:', consultData);

  const btn = document.querySelector('#step3 .btn-primary');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    showStep(5);
    document.querySelector('.consultation-header').style.display = 'none';
  }, 1500);
}

function showConsultNotification(message, type) {
  const existing = document.querySelector('.consult-notification');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'consult-notification';
  el.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
  el.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 24px;
    background: ${type === 'error' ? '#ef4444' : '#00d4aa'};
    color: ${type === 'error' ? '#fff' : '#0a2540'};
    border-radius: 12px;
    font-size: 0.9375rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 100000;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// Close on overlay click
document.addEventListener('click', function(e) {
  if (e.target === document.getElementById('consultationOverlay')) closeConsultation();
  if (e.target === document.getElementById('legalOverlay')) closeLegal();
  if (e.target === document.getElementById('serviceOverlay')) closeService();
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeConsultation();
    closeLegal();
    closeService();
  }
});

// ================================
// SERVICE DETAIL MODALS
// ================================
const serviceContent = {
  rcm: {
    title: 'Revenue Cycle Services',
    icon: 'fa-money-bill-wave',
    tagline: 'End-to-end billing optimization. We recover revenue from claims others consider dead.',
    features: [
      { title: 'ERA & EFT Enrollments', desc: 'Full electronic remittance enrollment with every major payer, accelerating cash flow by up to 45 days.' },
      { title: 'Claim Optimization', desc: 'Every claim reviewed for coding accuracy and payer-specific requirements. 99%+ first-pass acceptance.' },
      { title: 'Payer Auditing', desc: 'We audit underpayments against fee schedules and contract terms, recovering revenue others miss.' },
      { title: 'Eligibility Verification', desc: 'Real-time eligibility checks before services are rendered, reducing rejections.' },
      { title: 'Out-of-Network Recovery', desc: 'Our deep payer relationships recover claims competitors write off. This is our specialty.' },
      { title: 'Denial Management', desc: 'Systematic appeal process with pattern analysis to prevent recurring denials.' }
    ],
    stats: [
      { val: '99.2%', label: 'Claims Accuracy' },
      { val: '34%', label: 'Revenue Increase' },
      { val: '45 days', label: 'Faster Collections' },
      { val: '$340K', label: 'Avg. Recovered' }
    ]
  },
  lab: {
    title: 'Lab Operations Consulting',
    icon: 'fa-flask',
    tagline: 'Optimize every step of your laboratory workflow with hands-on expertise.',
    features: [
      { title: 'Process Optimization', desc: 'Analyze your specimen lifecycle end-to-end, implementing lean workflows that increase throughput.' },
      { title: 'Staff Training', desc: 'Custom programs for phlebotomists, lab techs, and admin staff covering compliance and best practices.' },
      { title: 'QA & Compliance', desc: 'CLIA, CAP, and state-specific programs that keep your lab audit-ready at all times.' },
      { title: 'Test Panel Building', desc: 'Strategic panel design based on market demand, reimbursement rates, and clinical relevance.' },
      { title: 'Client Onboarding', desc: 'Turnkey programs for onboarding referring physicians with supply kits and requisition training.' },
      { title: 'LIS Integration', desc: 'Laboratory information system optimization and workflow automation for maximum efficiency.' }
    ],
    stats: [
      { val: '40%', label: 'Faster Turnaround' },
      { val: '25%', label: 'Error Reduction' },
      { val: '100%', label: 'Audit Pass Rate' },
      { val: '3x', label: 'Onboarding Speed' }
    ]
  },
  workflow: {
    title: 'Clinical Workflows',
    icon: 'fa-stethoscope',
    tagline: 'Automate the clinical and administrative workflows that pull your team away from patients.',
    features: [
      { title: 'EHR/EMR Optimization', desc: 'Cleaner documentation flows and fewer clicks per chart so providers spend less time fighting their software.' },
      { title: 'Documentation Automation', desc: 'Templated notes, structured intake, and AI-assisted charting that cut hours of daily admin work.' },
      { title: 'Care Coordination', desc: 'Streamlined handoffs between front desk, clinical, and billing teams so patients keep moving through care.' },
      { title: 'Patient Communication', desc: 'Automated reminders, intake forms, and follow-up workflows that improve adherence and free up staff time.' },
      { title: 'Compliance & Quality', desc: 'Built-in checks that keep documentation audit-ready without adding manual review steps.' },
      { title: 'Workflow Optimization', desc: 'Operational redesign that aligns staffing, scheduling, and tasks with how your team actually works.' }
    ],
    stats: [
      { val: '40%', label: 'Less Admin Time' },
      { val: '2x', label: 'Patient Throughput' },
      { val: '99%', label: 'Audit Pass Rate' },
      { val: '30 days', label: 'Implementation' }
    ]
  },
  marketing: {
    title: 'Marketing Guidance',
    icon: 'fa-bullhorn',
    tagline: 'Hands-on marketing and sales consulting tailored to healthcare providers.',
    features: [
      { title: 'Sales Team Development', desc: 'Build a high-performing sales team with territory management and physician relationship training.' },
      { title: 'Productivity & KPIs', desc: 'Data-driven dashboards, call tracking, and performance metrics to optimize results.' },
      { title: 'Growth Strategy', desc: 'Market analysis and competitive positioning to identify your highest-value opportunities.' },
      { title: 'Physician Outreach', desc: 'Structured programs from lunch-and-learns to clinical partnerships with referring physicians.' },
      { title: 'Patient Acquisition', desc: 'Community outreach, digital presence, and referral network development strategies.' },
      { title: 'Brand Positioning', desc: 'Differentiate your lab or practice in a competitive market with clear, compelling messaging.' }
    ],
    stats: [
      { val: '3x', label: 'Volume Growth' },
      { val: '60%', label: 'More Referrals' },
      { val: '45%', label: 'Sales Productivity' },
      { val: '90 days', label: 'First Results' }
    ]
  }
};

const svcAccents = {
  rcm: '#00d4aa',
  lab: '#3864dc',
  workflow: '#dc50aa',
  marketing: '#dcaa00'
};

function openService(type) {
  const data = serviceContent[type];
  if (!data) return;

  document.getElementById('serviceTitle').textContent = data.title;
  document.getElementById('svcTagline').textContent = data.tagline;
  document.getElementById('svcIcon').innerHTML = '<i class="fas ' + data.icon + '"></i>';

  let html = '<div class="svc-features">';
  data.features.forEach(f => {
    html += '<div class="svc-feature"><h4><i class="fas fa-check-circle"></i> ' + f.title + '</h4><p>' + f.desc + '</p></div>';
  });
  html += '</div><div class="svc-stats">';
  data.stats.forEach(s => {
    html += '<div class="svc-stat"><span class="svc-stat-val">' + s.val + '</span><span class="svc-stat-label">' + s.label + '</span></div>';
  });
  html += '</div>';

  document.getElementById('serviceBody').innerHTML = html;
  document.getElementById('serviceOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeService() {
  document.getElementById('serviceOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ================================
// LEGAL MODALS
// ================================
const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    html: `
      <p style="color:var(--gray-400);margin-bottom:24px;">Last updated: March 18, 2026</p>

      <h3>1. Introduction</h3>
      <p>G3 Innovative Solutions ("G3," "we," "us," or "our") is committed to protecting the privacy and security of the personal information we collect from our clients, website visitors, and business partners. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or otherwise interact with us.</p>
      <p>As a healthcare consulting firm, we understand the sensitivity of the information we handle. We maintain strict privacy practices that meet or exceed the requirements of applicable federal and state laws, including the Health Insurance Portability and Accountability Act (HIPAA).</p>

      <h3>2. Information We Collect</h3>
      <p><strong>Personal Information You Provide:</strong></p>
      <ul>
        <li>Full name and professional title</li>
        <li>Email address and phone number</li>
        <li>Organization name and type</li>
        <li>Business address</li>
        <li>Service interests and business challenges</li>
        <li>Financial information related to your revenue cycle (provided during consultations)</li>
      </ul>
      <p><strong>Protected Health Information (PHI):</strong> In the course of providing revenue cycle management, lab operations consulting, and clinical workflows, we may access or handle PHI on behalf of our clients. All PHI is handled in strict accordance with HIPAA regulations and our Business Associate Agreements (BAAs).</p>
      <p><strong>Automatically Collected Information:</strong></p>
      <ul>
        <li>IP address and browser type</li>
        <li>Device information and operating system</li>
        <li>Pages visited, time spent, and navigation patterns</li>
        <li>Referring website or source</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h3>3. How We Use Your Information</h3>
      <ul>
        <li>Respond to your inquiries and provide consultation services</li>
        <li>Deliver our revenue cycle management, lab operations, clinical workflow, and marketing consulting services</li>
        <li>Communicate with you about our services, updates, and industry insights</li>
        <li>Improve our website, services, and user experience</li>
        <li>Comply with legal obligations and protect our rights</li>
      </ul>

      <h3>4. Information Sharing and Disclosure</h3>
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your information:</p>
      <ul>
        <li><strong>Service Delivery:</strong> With trusted partners who assist in delivering services, subject to confidentiality agreements</li>
        <li><strong>Healthcare Payers:</strong> As necessary to process claims, enrollments, and appeals on your behalf</li>
        <li><strong>Legal Requirements:</strong> When required by law, regulation, court order, or governmental authority</li>
        <li><strong>With Your Consent:</strong> When you have given us explicit permission</li>
      </ul>

      <h3>5. Data Security</h3>
      <ul>
        <li>Encryption of data in transit and at rest</li>
        <li>Access controls and role-based permissions</li>
        <li>Regular security assessments and audits</li>
        <li>Employee training on data privacy and security practices</li>
        <li>Incident response procedures for potential breaches</li>
      </ul>

      <h3>6. Data Retention</h3>
      <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce agreements. When data is no longer needed, it is securely deleted or anonymized.</p>

      <h3>7. Your Rights</h3>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal information</li>
        <li>Opt out of marketing communications</li>
        <li>Withdraw consent where processing is based on consent</li>
      </ul>
      <p>To exercise any of these rights, contact us at sales@G3innovative.com.</p>

      <h3>8. Cookies</h3>
      <p>Our website uses cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>

      <h3>9. Children's Privacy</h3>
      <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</p>

      <h3>10. Changes to This Policy</h3>
      <p>We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "Last updated" date.</p>

      <h3>11. Contact Us</h3>
      <div class="legal-contact">
        <p><strong>G3 Innovative Solutions</strong></p>
        <p><i class="fas fa-map-marker-alt"></i> Dallas, TX</p>
        <p><i class="fas fa-phone"></i> +1 (701) 306-6539</p>
        <p><i class="fas fa-envelope"></i> sales@G3innovative.com</p>
      </div>
    `
  },

  terms: {
    title: 'Terms of Service',
    html: `
      <p style="color:var(--gray-400);margin-bottom:24px;">Last updated: March 18, 2026</p>

      <h3>1. Acceptance of Terms</h3>
      <p>By accessing or using the website and services of G3 Innovative Solutions ("G3," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.</p>

      <h3>2. Description of Services</h3>
      <ul>
        <li><strong>Revenue Cycle Services:</strong> ERA/EFT enrollments, claim submission optimization, payer-specific auditing, eligibility verification, out-of-network claims recovery</li>
        <li><strong>Lab Operations Consulting:</strong> Process optimization, staff training, quality assurance, compliance programs, test panel building</li>
        <li><strong>Clinical Workflows:</strong> EHR/EMR optimization, documentation automation, care coordination, patient communication, and operational redesign that reduces administrative load on clinical teams</li>
        <li><strong>Marketing Guidance:</strong> Sales team development, productivity tracking, growth strategy, physician outreach, patient acquisition</li>
      </ul>
      <p>Specific scope of services will be defined in a separate engagement agreement or statement of work.</p>

      <h3>3. Client Responsibilities</h3>
      <ul>
        <li>Provide accurate, complete, and timely information necessary for service delivery</li>
        <li>Maintain appropriate authorizations and access credentials</li>
        <li>Comply with all applicable laws and regulations, including HIPAA</li>
        <li>Execute a Business Associate Agreement (BAA) when engagement involves PHI</li>
      </ul>

      <h3>4. Free Consultations</h3>
      <p>Free initial consultations and assessments are provided for informational purposes. They do not constitute a binding agreement, include estimates that are not guarantees, and are confidential.</p>

      <h3>5. Fees and Payment</h3>
      <ul>
        <li>Payment terms are net 30 days from invoice date</li>
        <li>Late payments may incur interest at 1.5% per month</li>
        <li>We reserve the right to suspend services for accounts more than 60 days past due</li>
      </ul>

      <h3>6. Intellectual Property</h3>
      <p>All website content, proprietary methodologies, and frameworks are the property of G3 Innovative Solutions. All client data remains the property of the client.</p>

      <h3>7. Confidentiality</h3>
      <p>We treat all client information as confidential and will not disclose it except as necessary for service delivery, with consent, or as required by law. Confidentiality obligations survive termination.</p>

      <h3>8. Disclaimer of Warranties</h3>
      <p>Our website is provided "as is." We perform services with reasonable care and skill but do not guarantee specific financial outcomes or revenue recovery amounts. Results depend on many factors including client cooperation and payer decisions.</p>

      <h3>9. Limitation of Liability</h3>
      <p>G3 shall not be liable for indirect, incidental, special, or consequential damages. Total liability shall not exceed fees paid during the twelve months preceding the claim.</p>

      <h3>10. Compliance with Laws</h3>
      <ul>
        <li>HIPAA and HITECH Act</li>
        <li>Clinical Laboratory Improvement Amendments (CLIA)</li>
        <li>State healthcare privacy and licensing laws</li>
        <li>Federal Anti-Kickback Statute and Stark Law</li>
      </ul>

      <h3>11. Termination</h3>
      <p>Upon termination, all outstanding fees become immediately due, confidentiality obligations continue, and client data will be handled per our retention policies.</p>

      <h3>12. Dispute Resolution</h3>
      <p>Disputes shall be resolved through good-faith negotiation. If negotiation fails, binding arbitration in Dallas, Texas under AAA rules. Governed by Texas law.</p>

      <h3>13. Contact Us</h3>
      <div class="legal-contact">
        <p><strong>G3 Innovative Solutions</strong></p>
        <p><i class="fas fa-map-marker-alt"></i> Dallas, TX</p>
        <p><i class="fas fa-phone"></i> +1 (701) 306-6539</p>
        <p><i class="fas fa-envelope"></i> sales@G3innovative.com</p>
      </div>
    `
  },

  hipaa: {
    title: 'HIPAA Compliance',
    html: `
      <p style="color:var(--gray-400);margin-bottom:24px;">Our commitment to protecting healthcare data</p>

      <h3>1. Our Commitment</h3>
      <p>G3 Innovative Solutions maintains full compliance with HIPAA and the HITECH Act. As a Business Associate, we maintain rigorous compliance programs that safeguard every piece of Protected Health Information (PHI) entrusted to us.</p>

      <h3>2. Business Associate Agreements</h3>
      <p>Before accessing any PHI, we execute a BAA with each covered entity establishing:</p>
      <ul>
        <li>Permitted uses and disclosures of PHI</li>
        <li>Safeguards to prevent unauthorized use or disclosure</li>
        <li>Breach notification procedures and timelines</li>
        <li>Requirements for subcontractor compliance</li>
        <li>Data return and destruction obligations upon termination</li>
      </ul>

      <h3>3. Administrative Safeguards</h3>
      <ul>
        <li>Designated Privacy Officer overseeing all PHI handling</li>
        <li>All employees complete HIPAA training upon hire and annually</li>
        <li>Written privacy and security policies reviewed annually</li>
        <li>Minimum necessary standard applied to all PHI access</li>
        <li>Annual risk assessments with documented mitigation plans</li>
      </ul>

      <h3>4. Physical Safeguards</h3>
      <ul>
        <li>Controlled access to facilities where PHI is processed</li>
        <li>Workstation security with screen locks and clean desk rules</li>
        <li>Device and media controls for hardware containing PHI</li>
        <li>Secure destruction of physical documents containing PHI</li>
      </ul>

      <h3>5. Technical Safeguards</h3>
      <ul>
        <li>Unique user identification and role-based access controls</li>
        <li>Multi-factor authentication for remote access</li>
        <li>AES-256 encryption for ePHI at rest</li>
        <li>TLS 1.2+ encryption for ePHI in transit</li>
        <li>Full-disk encryption on all devices that may access ePHI</li>
        <li>Comprehensive audit logging with regular review</li>
        <li>Automated alerting for suspicious access patterns</li>
      </ul>

      <h3>6. Breach Notification</h3>
      <ul>
        <li><strong>Investigation:</strong> Thorough investigation within 24 hours of discovery</li>
        <li><strong>Client Notification:</strong> No later than 60 days after discovery</li>
        <li><strong>Mitigation:</strong> Immediate steps to prevent further unauthorized access</li>
        <li><strong>Documentation:</strong> All incidents documented and retained for six years</li>
      </ul>

      <h3>7. Subcontractor Management</h3>
      <ul>
        <li>Due diligence on subcontractor security practices</li>
        <li>BAAs with all subcontractors who access PHI</li>
        <li>Ongoing compliance monitoring</li>
        <li>Current inventory of all subcontractors with PHI access</li>
      </ul>

      <h3>8. Patient Rights</h3>
      <p>We support our clients in fulfilling patients' HIPAA rights including right to access, amendment, accounting of disclosures, restrictions, and confidential communications.</p>

      <h3>9. Continuous Improvement</h3>
      <ul>
        <li>Annual comprehensive risk assessments</li>
        <li>Regular policy reviews and updates</li>
        <li>Staying current with regulatory changes and OCR guidance</li>
        <li>Third-party independent compliance reviews</li>
      </ul>

      <h3>10. Contact Our Privacy Officer</h3>
      <div class="legal-contact">
        <p><strong>G3 Innovative Solutions — Privacy Office</strong></p>
        <p><i class="fas fa-map-marker-alt"></i> Dallas, TX</p>
        <p><i class="fas fa-phone"></i> +1 (701) 306-6539</p>
        <p><i class="fas fa-envelope"></i> sales@G3innovative.com</p>
      </div>
    `
  }
};

function openLegal(type) {
  const data = legalContent[type];
  if (!data) return;
  document.getElementById('legalTitle').textContent = data.title;
  document.getElementById('legalBody').innerHTML = data.html;
  document.getElementById('legalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLegal() {
  document.getElementById('legalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ================================
// 3D HERO MODEL (Three.js)
// ================================
(function() {
  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const wrapper = canvas.parentElement;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
  camera.position.set(0, 0.2, 3);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Bright white key light
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);

  // Accent green (#00d4aa)
  const accentLight = new THREE.PointLight(0x00d4aa, 1.2, 12);
  accentLight.position.set(-2, 1, 3);
  scene.add(accentLight);

  // Blue (#3864dc)
  const blueLight = new THREE.PointLight(0x3864dc, 0.8, 12);
  blueLight.position.set(2, -1, -2);
  scene.add(blueLight);

  // Pink (#dc50aa)
  const pinkLight = new THREE.PointLight(0xdc50aa, 0.5, 10);
  pinkLight.position.set(-3, -1, 1);
  scene.add(pinkLight);

  // White fill from opposite side
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLight.position.set(-2, 3, -3);
  scene.add(fillLight);

  // Controls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;

  // Load model
  let model = null;
  const loader = new THREE.GLTFLoader();
  loader.load('./g3-logo-3d.glb', function(gltf) {
    model = gltf.scene;

    // Silver mirror
    model.traverse(function(child) {
      if (child.isMesh && child.material) {
        var mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(function(mat) {
          mat.color.set(0xaaaaaa);
          if (mat.metalness !== undefined) mat.metalness = 1.0;
          if (mat.roughness !== undefined) mat.roughness = 0.35;
          mat.transparent = true;
          mat.opacity = 0.25;
          if (mat.emissive) mat.emissive.set(0x222222);
          mat.needsUpdate = true;
        });
      }
    });

    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.0 / maxDim;
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));

    scene.add(model);
    console.log('Model loaded, children:', model.children.length);
  }, undefined, function(err) {
    console.error('GLB load error:', err);
  });

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Subtle float
    if (model) {
      model.position.y = Math.sin(Date.now() * 0.001) * 0.05;
    }

    // Lights orbit for dynamic reflections
    const t = Date.now() * 0.0005;
    accentLight.position.x = Math.cos(t) * 3;
    accentLight.position.z = Math.sin(t) * 3;
    blueLight.position.x = Math.cos(t + 2) * 3;
    blueLight.position.z = Math.sin(t + 2) * 3;
    pinkLight.position.x = Math.cos(t + 4) * 2.5;
    pinkLight.position.z = Math.sin(t + 4) * 2.5;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', function() {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
