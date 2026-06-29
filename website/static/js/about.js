// -------------------------------------------------------------------------
// About Page Script - Timeline highlights & scroll reveals
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Timeline interactivity
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            timelineItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            
            // Add a micro-toast or log
            const year = item.querySelector('.timeline-date').textContent;
            window.InSightApp.showToast(`Exploring our milestones from ${year}!`);
        });
    });

    // 2. Scroll Reveal implementation using Intersection Observer
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
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without observer
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
