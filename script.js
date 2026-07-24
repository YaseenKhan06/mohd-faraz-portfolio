/**
 * Mohd Faraz - Video Editor Portfolio Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  /* --- Mobile Menu Toggle --- */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* --- Time Formatting Helper --- */
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /* --- Category Filter Pills Controller --- */
  const filterPills = document.querySelectorAll('.filter-pill');
  const awwwardsProjectCards = document.querySelectorAll('.awwwards-project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selectedFilter = pill.getAttribute('data-filter');

      // Toggle active class on pills
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Filter cards
      awwwardsProjectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const video = card.querySelector('.project-video-element');

        if (selectedFilter === 'all' || category === selectedFilter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
          if (video && !video.paused) {
            video.pause();
          }
        }
      });
    });
  });

  /* --- HTML5 Video Card Controller --- */
  const videoCards = document.querySelectorAll('.video-card-player');
  const allVideos = document.querySelectorAll('.project-video-element');

  videoCards.forEach(card => {
    const video = card.querySelector('.project-video-element');
    const overlayPlay = card.querySelector('.video-overlay-play');
    const playPauseBtn = card.querySelector('.play-pause-btn');
    const progressContainer = card.querySelector('.progress-container');
    const progressFilled = card.querySelector('.progress-filled');
    const timeDisplay = card.querySelector('.time-display');
    const durationBadge = card.querySelector('.video-duration-badge');
    const muteBtn = card.querySelector('.mute-btn');
    const volumeSlider = card.querySelector('.volume-slider');
    const fullscreenBtn = card.querySelector('.fullscreen-btn');

    if (!video) return;

    // Set duration badge once metadata loaded
    const updateDuration = () => {
      if (durationBadge && video.duration) {
        durationBadge.textContent = formatTime(video.duration);
      }
    };

    if (video.readyState >= 1) {
      updateDuration();
    } else {
      video.addEventListener('loadedmetadata', updateDuration);
    }

    // Toggle Play/Pause
    const togglePlay = (e) => {
      if (e) e.stopPropagation();

      if (video.paused) {
        // Pause all other playing videos
        allVideos.forEach(v => {
          if (v !== video && !v.paused) {
            v.pause();
          }
        });

        // Enable sound on explicit user click if muted
        if (video.muted) {
          video.muted = false;
          if (volumeSlider) volumeSlider.value = video.volume || 0.8;
          updateMuteIcon();
        }

        video.play();
      } else {
        video.pause();
      }
    };

    // Update play state UI
    const updatePlayUI = () => {
      const isPlaying = !video.paused;
      card.classList.toggle('playing', isPlaying);
      if (playPauseBtn) {
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
          icon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
      }
    };

    video.addEventListener('play', updatePlayUI);
    video.addEventListener('pause', updatePlayUI);
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      updatePlayUI();
    });

    // Click triggers
    if (overlayPlay) overlayPlay.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Update Progress Bar & Time Display
    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        if (progressFilled) progressFilled.style.width = `${pct}%`;
        if (timeDisplay) timeDisplay.textContent = formatTime(video.currentTime);
      }
    });

    // Seek on progress bar click
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (video.duration) {
          video.currentTime = pos * video.duration;
        }
      });
    }

    // Mute/Unmute Control
    const updateMuteIcon = () => {
      if (muteBtn) {
        const icon = muteBtn.querySelector('i');
        if (icon) {
          icon.className = (video.muted || video.volume === 0)
            ? 'fa-solid fa-volume-xmark'
            : 'fa-solid fa-volume-high';
        }
      }
    };

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        updateMuteIcon();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        video.volume = parseFloat(volumeSlider.value);
        video.muted = (video.volume === 0);
        updateMuteIcon();
      });
      volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }
  });

  /* --- Navbar Active State on Scroll --- */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll);

  /* --- Tool Badges Subtle Tilt Effect --- */
  const toolBadges = document.querySelectorAll('.tool-badge');
  toolBadges.forEach(badge => {
    badge.addEventListener('mousemove', (e) => {
      const rect = badge.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      badge.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.08)`;
    });

    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
    });
  });

  /* --- Contact Form Submission (Web3Forms) --- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && submitBtn && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous status message
      formStatus.style.display = 'none';
      formStatus.className = 'form-status-message';
      formStatus.textContent = '';

      // Simple email validation
      const emailField = contactForm.querySelector('input[name="email"]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#F44336';
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      // Set Loading State
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnIcon = submitBtn.querySelector('.icon-right');
      const originalText = btnText ? btnText.textContent : 'SEND MESSAGE';
      
      if (btnText) btnText.textContent = 'SENDING...';
      if (btnIcon) {
        btnIcon.className = 'fa-solid fa-spinner fa-spin icon-right';
      }

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          formStatus.style.display = 'block';
          formStatus.style.color = '#4CAF50';
          formStatus.textContent = 'Thank you! Your message was sent successfully.';
          contactForm.reset();
        } else {
          console.log(response);
          formStatus.style.display = 'block';
          formStatus.style.color = '#F44336';
          formStatus.textContent = json.message || 'Something went wrong. Please try again.';
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.style.display = 'block';
        formStatus.style.color = '#F44336';
        formStatus.textContent = 'Error connecting to the server. Please check your internet connection.';
      })
      .finally(() => {
        // Reset Button State
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = originalText;
        if (btnIcon) {
          btnIcon.className = 'fa-solid fa-paper-plane icon-right';
        }
      });
    });
  }
});
