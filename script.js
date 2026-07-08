document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Loader Fade Out
  // ==========================================
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500); // Small delay to guarantee visual feedback
    });
    // Fail-safe in case window load event already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 500);
    }
  }

  // ==========================================
  // Light / Dark Theme Management
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply default or saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('title', 'Switch to Light Mode');
    }
  }

  // ==========================================
  // Sticky Navbar & Back to Top Toggle
  // ==========================================
  const header = document.querySelector('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Header stickiness
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // Mobile Navigation Hamburger Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // Section Switching (SPA Tab Navigation)
  // ==========================================
  const allSections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, #nav-logo, #hero-projects-btn, #hero-contact-btn');

  function showSection(targetId) {
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Close hamburger menu if open
    if (hamburger && navMenu) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }

    // Reset active classes on all sections
    allSections.forEach(section => {
      section.classList.remove('active-section', 'fade-in-section');
      section.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.remove('animated');
      });
    });

    // Show the active section
    targetSection.classList.add('active-section');
    
    // Trigger fade-in in next paint frame
    requestAnimationFrame(() => {
      setTimeout(() => {
        targetSection.classList.add('fade-in-section');
        // Trigger animations inside the active section
        targetSection.querySelectorAll('.scroll-animate').forEach(el => {
          el.classList.add('animated');
        });
      }, 50);
    });

    // Update nav links active state
    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${targetId}`) {
        link.classList.add('active');
      }
    });

    // Reset scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Intercept all anchor clicks targeting sections
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').substring(1);
    if (document.getElementById(targetId)) {
      e.preventDefault();
      showSection(targetId);
      history.pushState(null, null, `#${targetId}`);
    }
  });

  // Handle back/forward navigation
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
  });

  // Initialize page on load based on hash
  const initialHash = window.location.hash.substring(1) || 'home';
  showSection(initialHash);

  // ==========================================
  // Intersection Observer scroll animations
  // ==========================================
  const animElements = document.querySelectorAll('.scroll-animate');
  const animObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const animObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, animObserverOptions);

  animElements.forEach(el => {
    animObserver.observe(el);
  });

  // ==========================================
  // Projects Category Filtering
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          // Trigger slight fade-in animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'all var(--transition-normal), opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // Contact Form Simulated Submission
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Simulated sending indicator
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

      setTimeout(() => {
        // Successful simulation
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Fade status out after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
          formStatus.className = 'form-status';
        }, 5000);
      }, 1500);
    });
  }

  function showStatus(text, type) {
    formStatus.innerText = text;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';
  }
});
