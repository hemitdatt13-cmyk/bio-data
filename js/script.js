/* 
   Hemit Datt Portfolio Website
   Shared Script File (script.js)
   Features: Loader control, page transitions, dark/light theme, typing effect, 
             scroll reveal, projects filtering, image lightbox, contact validation.
*/

document.addEventListener('DOMContentLoaded', () => {
  // === 1. PAGE LOADER ===
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 300);
    });
    // Fallback if window load doesn't fire immediately
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 2000);
  }

  // === 2. SMOOTH PAGE TRANSITIONS ===
  const pageContainer = document.querySelector('.page-container');
  const navLinksList = document.querySelectorAll('.nav-links a, .logo, .btn-transition');
  
  if (pageContainer) {
    navLinksList.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetUrl = link.getAttribute('href');
        
        // Intercept relative page links, skip anchors and blank targets
        if (targetUrl && 
            targetUrl.endsWith('.html') && 
            !link.getAttribute('target') && 
            !targetUrl.startsWith('#')) {
          e.preventDefault();
          
          pageContainer.classList.add('page-exit');
          
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 350); // Matches CSS transition duration
        }
      });
    });
  }

  // === 3. DARK / LIGHT THEME TOGGLE ===
  const themeToggle = document.getElementById('theme-toggle');
  
  const getThemePreference = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  };

  // Initialize Theme
  const currentTheme = getThemePreference();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // === 4. NAVBAR SCROLL EFFECT & ACTIVE STATE ===
  const header = document.querySelector('.header');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set current active class in header
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // === 5. MOBILE MENU HAMBURGER ===
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // === 6. TYPING ANIMATION (HOME PAGE) ===
  const typedTextSpan = document.querySelector('.typed-text');
  const cursorSpan = document.querySelector('.cursor');
  
  if (typedTextSpan) {
    const textArray = ["Creative Developer", "UI/UX Designer", "Problem Solver", "Tech Enthusiast"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between word cycles
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 300);
      }
    }

    // Start typing effect on load
    setTimeout(type, newTextDelay - 1000);
  }

  // === 7. SCROLL REVEAL SYSTEM & SKILL BARS ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If it is a skill list container, animate the skill fills inside it
        const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
        if (skillFills.length > 0) {
          skillFills.forEach(fill => {
            const skillLevel = fill.getAttribute('data-skill');
            fill.style.width = skillLevel;
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === 8. BACK TO TOP BUTTON ===
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // === 9. PROJECT FILTERING (PROJECTS PAGE) ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            if (card.classList.contains(filterValue)) {
              card.style.display = 'flex';
              setTimeout(() => card.style.opacity = '1', 50);
            } else {
              card.style.opacity = '0';
              setTimeout(() => card.style.display = 'none', 300);
            }
          }
        });
      });
    });
  }

  // === 10. CERTIFICATES LIGHTBOX MODAL ===
  const certCards = document.querySelectorAll('.cert-card');
  const lightbox = document.getElementById('lightbox');
  
  if (certCards.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.cert-img-container img');
        const title = card.querySelector('.cert-details h3').textContent;
        const issuer = card.querySelector('.cert-details p').textContent;

        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = `${title} - ${issuer}`;
          lightbox.classList.add('active');
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // === 11. CONTACT FORM VALIDATION ===
  const contactForm = document.getElementById('contact-form');
  const alertPopup = document.getElementById('alert-popup');

  if (contactForm && alertPopup) {
    const inputs = contactForm.querySelectorAll('.form-input');
    
    // Quick helper to show alert
    const showAlert = (message, type = 'success') => {
      alertPopup.className = `alert-popup ${type} show`;
      alertPopup.querySelector('span').textContent = message;
      
      const icon = alertPopup.querySelector('i');
      if (type === 'success') {
        icon.className = 'fa-solid fa-circle-check';
      } else {
        icon.className = 'fa-solid fa-circle-exclamation';
      }

      setTimeout(() => {
        alertPopup.classList.remove('show');
      }, 4000);
    };

    const validateField = (input) => {
      const group = input.parentElement;
      let isValid = true;
      let errorMsg = '';

      const val = input.value.trim();

      if (!val) {
        isValid = false;
        errorMsg = 'This field is required.';
      } else if (input.type === 'email') {
        // Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      } else if (input.id === 'name' && val.length < 2) {
        isValid = false;
        errorMsg = 'Name must be at least 2 characters.';
      } else if (input.id === 'message' && val.length < 10) {
        isValid = false;
        errorMsg = 'Message must be at least 10 characters.';
      }

      // Remove existing error if any
      const existingError = group.querySelector('.error-text');
      if (existingError) existingError.remove();

      if (!isValid) {
        group.classList.add('error');
        const errSpan = document.createElement('span');
        errSpan.className = 'error-text';
        errSpan.textContent = errorMsg;
        group.appendChild(errSpan);
      } else {
        group.classList.remove('error');
      }

      return isValid;
    };

    // Live validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });
      // Clear error on input
      input.addEventListener('input', () => {
        const group = input.parentElement;
        group.classList.remove('error');
        const existingError = group.querySelector('.error-text');
        if (existingError) existingError.remove();
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let formIsValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          formIsValid = false;
        }
      });

      if (formIsValid) {
        // Simulated form submission (would connect to formspree or web3forms)
        showAlert('Thank you! Your message was sent successfully.', 'success');
        contactForm.reset();
        
        // Reset floating label styles
        inputs.forEach(input => {
          const group = input.parentElement;
          group.classList.remove('error');
        });
      } else {
        showAlert('Please correct the errors in the form.', 'error');
      }
    });
  }
});
