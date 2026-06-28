// -------------------------------------------------------------------------
// Homepage Script - Handles Testimonials Carousel and Newsletter Sign-up
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    let currentTestimonialIndex = 0;
    
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialPrevBtn = document.getElementById('testimonial-prev-btn');
    const testimonialNextBtn = document.getElementById('testimonial-next-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');

    // -------------------------------------------------------------------------
    // Testimonials Carousel
    // -------------------------------------------------------------------------
    function showTestimonial(index) {
        if (!testimonialTrack || testimonialSlides.length === 0) return;
        
        if (index >= testimonialSlides.length) {
            currentTestimonialIndex = 0;
        } else if (index < 0) {
            currentTestimonialIndex = testimonialSlides.length - 1;
        } else {
            currentTestimonialIndex = index;
        }

        testimonialTrack.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
        
        testimonialSlides.forEach((slide, i) => {
            if (i === currentTestimonialIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    if (testimonialNextBtn && testimonialPrevBtn) {
        testimonialNextBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonialIndex + 1);
            resetTestimonialTimer();
        });

        testimonialPrevBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonialIndex - 1);
            resetTestimonialTimer();
        });
    }

    // Auto-advance testimonials every 6 seconds
    let testimonialTimer = setInterval(() => {
        showTestimonial(currentTestimonialIndex + 1);
    }, 6000);

    function resetTestimonialTimer() {
        clearInterval(testimonialTimer);
        testimonialTimer = setInterval(() => {
            showTestimonial(currentTestimonialIndex + 1);
        }, 6000);
    }

    // -------------------------------------------------------------------------
    // Book Personality Quiz Wizard
    // -------------------------------------------------------------------------
    const quizCard = document.getElementById('quiz-card');
    if (quizCard) {
        let selectedGenre = '';
        const step1 = document.getElementById('quiz-step-1');
        const step2 = document.getElementById('quiz-step-2');
        const stepResult = document.getElementById('quiz-step-result');
        const resultTitle = document.getElementById('quiz-result-title');
        const resultDesc = document.getElementById('quiz-result-desc');
        const quizShopBtn = document.getElementById('quiz-shop-btn');
        const resetBtn = document.getElementById('quiz-reset-btn');

        // Step 1 Options Click
        step1.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedGenre = btn.getAttribute('data-genre');
                step1.classList.remove('active');
                step2.classList.add('active');
            });
        });

        // Step 2 Options Click
        step2.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                step2.classList.remove('active');
                stepResult.classList.add('active');

                // Determine recommendation
                if (selectedGenre === 'Fiction') {
                    resultTitle.textContent = 'The Prose Explorer';
                    resultDesc.textContent = 'You appreciate deep characters and rich story prose. We recommend Margaret Atwood\'s "The Testaments".';
                    quizShopBtn.href = '/shop?q=Testaments';
                } else if (selectedGenre === 'Thriller') {
                    resultTitle.textContent = 'The Suspense Seeker';
                    resultDesc.textContent = 'You love racing hearts and mind-bending mysteries. We recommend Stephen King\'s "The Institute".';
                    quizShopBtn.href = '/shop?q=Institute';
                } else {
                    resultTitle.textContent = 'The Self-Growth Guide';
                    resultDesc.textContent = 'You seek practical inspiration and mind development. We recommend Rachel Hollis\'s "Girl, stop apologizing".';
                    quizShopBtn.href = '/shop?q=apologizing';
                }
                
                window.InSightApp.showToast(`Quiz completed! Recommending matches.`);
            });
        });

        // Reset Quiz
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                selectedGenre = '';
                stepResult.classList.remove('active');
                step1.classList.add('active');
            });
        }
    }

    // -------------------------------------------------------------------------
    // RSVP Buttons and Particle Confetti
    // -------------------------------------------------------------------------
    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    rsvpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const countSpan = btn.querySelector('.rsvp-count');
            if (countSpan) {
                let currentCount = parseInt(countSpan.textContent, 10);
                countSpan.textContent = currentCount + 1;
            }
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Registered';
            btn.style.backgroundColor = 'var(--text-light)';
            
            // Confetti particle burst
            createConfettiBurst(btn);
            window.InSightApp.showToast('RSVP registered! We sent details to your drawer.');
        });
    });

    function createConfettiBurst(btnEl) {
        const rect = btnEl.getBoundingClientRect();
        const container = document.body;
        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            // Curated colorful palette
            particle.style.backgroundColor = ['#0A8754', '#81C784', '#FFA726', '#26C6DA', '#AB47BC'][Math.floor(Math.random() * 5)];
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;
            particle.style.zIndex = '99999';
            particle.style.pointerEvents = 'none';
            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 80;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 40; // upward bias

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 700 + Math.random() * 500,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });

            setTimeout(() => particle.remove(), 1200);
        }
    }

    // -------------------------------------------------------------------------
    // Scroll Reveal Intersection Observer
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
