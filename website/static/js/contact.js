// -------------------------------------------------------------------------
// Contact Page Script - Handles form submissions and Live hours status
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Live library hours check (9:00 AM - 8:00 PM)
    function updateLibraryStatus() {
        const statusTag = document.getElementById('hours-status-tag');
        if (!statusTag) return;

        const now = new Date();
        const currentHour = now.getHours();

        // Open between 9 AM (9) and 8 PM (20)
        if (currentHour >= 9 && currentHour < 20) {
            statusTag.textContent = 'Open Now';
            statusTag.className = 'status-tag open';
        } else {
            statusTag.textContent = 'Closed Now';
            statusTag.className = 'status-tag closed';
        }
    }

    // Run initial check and set interval
    updateLibraryStatus();
    setInterval(updateLibraryStatus, 60000); // Check every minute

    // 2. Form validation helper (submits naturally to Flask backend)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                window.InSightApp.showToast('Please fill in all form inputs.', 'warning');
            }
        });
    }
});
