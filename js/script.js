/* 
   Hemit Datt Portfolio Website
   Interactive Script File (script.js)
   Features: 
     - Window loader control
     - Dark/Light theme toggling & persistence
     - Navbar scroll transitions
     - Typist cycling animation
     - Viewport intersection observer for scroll-reveals & skill bar expansions
     - Portfolio isotope-style category filtering
     - Image Lightbox Modal for certificate zooms
     - Custom input fields validation and simulated secure submissions
*/

document.addEventListener('DOMContentLoaded', () => {

  // === 1. PAGE LOADER ===
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    const fadeOutLoader = () => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    };

    // Fade out once window assets are fully loaded
    window.addEventListener('load', fadeOutLoader);

    // Fallback if loading takes too long (2 seconds max)
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        fadeOutLoader();
      }
    }, 2000);
  }

  // === 2. DARK / LIGHT THEME TOGGLER ===
  const themeToggle = document.getElementById('theme-toggle');
  
  const getSavedTheme = () => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) return saved;
    // Fallback to system preferences
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  };

  // Initialize theme on start
  const currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // === 3. NAVBAR SCROLL ACTION & AUTO-CLOSE MOBILE MENU ===
  const header = document.querySelector('.header');
  const navbarCollapse = document.getElementById('navbarNav');
  const bsCollapse = navbarCollapse ? new bootstrap.Collapse(navbarCollapse, {toggle: false}) : null;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Auto-collapse mobile navbar after clicking any nav link
  const navLinksList = document.querySelectorAll('.nav-links .nav-link');
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show') && bsCollapse) {
        bsCollapse.hide();
      }
    });
  });

  // === 4. TYPING ANIMATION (HERO SECTION) ===
  const typedTextSpan = document.querySelector('.typed-text');
  const cursorSpan = document.querySelector('.cursor');
  
  if (typedTextSpan) {
    const wordsArray = ["Frontend Developer", "UI/UX Specialist", "Responsive Designer", "Creative Thinker"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const wordDelay = 2000; // Duration word sits complete
    
    let wordIndex = 0;
    let charIndex = 0;

    const typeWord = () => {
      if (charIndex < wordsArray[wordIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += wordsArray[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWord, typingSpeed);
      } else {
        cursorSpan.classList.remove("typing");
        setTimeout(eraseWord, wordDelay);
      }
    };

    const eraseWord = () => {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = wordsArray[wordIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseWord, erasingSpeed);
      } else {
        cursorSpan.classList.remove("typing");
        wordIndex = (wordIndex + 1) % wordsArray.length;
        setTimeout(typeWord, typingSpeed + 300);
      }
    };

    // Kickoff typing animation on load
    setTimeout(typeWord, 1000);
  }

  // === 5. SCROLL VIEWPORT REVEAL & SKILLS PROGRESS ANIMATIONS ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const viewportObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add active reveal transition class
        entry.target.classList.add('revealed');
        
        // Trigger skill fills animation if this container is revealed
        const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
        if (skillFills.length > 0) {
          skillFills.forEach(fill => {
            const skillLevel = fill.getAttribute('data-skill');
            fill.style.width = skillLevel;
          });
        }
        
        // Stop tracking after it animates in once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => viewportObserver.observe(el));

  // === 6. PORTFOLIO ISOTOPE-STYLE CARD FILTERING ===
  const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active highlight class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const activeFilter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (activeFilter === 'all') {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else if (category === activeFilter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.85)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300); // Matches opacity fadeout transition
          }
        });
      });
    });
  }

  // === 7. CERTIFICATES IMAGE LIGHTBOX MODAL ===
  const lightbox = document.getElementById('lightbox');
  const certTriggers = document.querySelectorAll('.cert-trigger');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    const openLightbox = (cardElement) => {
      const img = cardElement.querySelector('.cert-img-container img');
      const title = cardElement.querySelector('h3').textContent;
      const issuer = cardElement.querySelector('.cert-issuer').textContent;

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = `${title} — ${issuer}`;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    };

    // Connect trigger click on images
    certTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const card = e.target.closest('.cert-card');
        if (card) openLightbox(card);
      });
    });

    // Connect trigger click on buttons
    viewCertBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.cert-card');
        if (card) openLightbox(card);
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Escape Key closing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // === 8. FLOATING TOAST ALERTS ===
  const alertPopup = document.getElementById('alert-popup');
  
  const showAlert = (message, type = 'success') => {
    if (!alertPopup) return;
    
    alertPopup.className = `alert-popup ${type} show`;
    alertPopup.querySelector('span').textContent = message;
    
    const icon = alertPopup.querySelector('i');
    if (type === 'success') {
      icon.className = 'fa-solid fa-circle-check';
    } else {
      icon.className = 'fa-solid fa-circle-exclamation';
    }

    // Auto fadeout after 4 seconds
    setTimeout(() => {
      alertPopup.classList.remove('show');
    }, 4000);
  };

  // === 9. CONTACT FORM INTERACTIVE VALIDATION ===
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('.form-input');

    const validateField = (input) => {
      const container = input.parentElement;
      const val = input.value.trim();
      let isValid = true;
      let errorMsg = '';

      if (input.required && !val) {
        isValid = false;
        errorMsg = 'This field is required.';
      } else if (input.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(val)) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      } else if (input.id === 'name' && val.length < 2) {
        isValid = false;
        errorMsg = 'Name must contain at least 2 characters.';
      } else if (input.id === 'message' && val.length < 10) {
        isValid = false;
        errorMsg = 'Message must contain at least 10 characters.';
      }

      // Clean existing error blocks
      const oldError = container.querySelector('.error-text');
      if (oldError) oldError.remove();

      if (!isValid) {
        container.classList.add('error');
        const errBlock = document.createElement('span');
        errBlock.className = 'error-text';
        errBlock.textContent = errorMsg;
        container.appendChild(errBlock);
      } else {
        container.classList.remove('error');
      }

      return isValid;
    };

    // Live validation when users blur focus out of fields
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      // Clear layout errors instantly as they start typing
      input.addEventListener('input', () => {
        const container = input.parentElement;
        container.classList.remove('error');
        const errorText = container.querySelector('.error-text');
        if (errorText) errorText.remove();
      });
    });

    // Form submit intercept
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let formIsValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        // Simulate sending and trigger alert
        showAlert('Message sent successfully! I will respond shortly.', 'success');
        contactForm.reset();
        
        // Reset floating states
        inputs.forEach(input => {
          input.parentElement.classList.remove('error');
        });
      } else {
        showAlert('Form contains errors. Please correct them and try again.', 'error');
      }
    });
  }

  // === 10. BACK TO TOP SCROLL BUTTON ===
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
