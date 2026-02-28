// --- Club Affaires Sociales INPT - Custom Scripts ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Scroll for Navbar Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                document.querySelector(hash).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Simple Scroll Reveal Animation
    // Adds a 'visible' class to sections as they enter the viewport
    const sections = document.querySelectorAll('section');
    const revealOptions = {
        threshold: 0.15 // Section must be 15% visible to trigger
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, revealOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden'); // Initial state
        sectionObserver.observe(section);
    });

    // 3. Contact Form Submission Handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get the button to change its state
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            btn.disabled = true;

            // Simulate an API call delay
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Sent Successfully!';
                btn.classList.replace('btn-primary', 'btn-success');
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-success', 'btn-primary');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});