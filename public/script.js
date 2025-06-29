document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menuIcon');
    const navLinks = document.getElementById('navLinks');

    // Toggle the mobile menu
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuIcon.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);
        });

        // Close menu when clicking on any link
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Scroll animation: Reveal sections as they come into view
    const sections = document.querySelectorAll('.profile-container, .skills, .experience, .about-hero, .about-section, .quote-section, .contact-hero, .contact-info, .contact-form-section, .social-connect');

    const revealSection = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;

            if (sectionTop < window.innerHeight - sectionHeight / 5) {
                section.classList.add('visible');
            }
        });
    };

    if (sections.length > 0) {
        revealSection();
        window.addEventListener('scroll', revealSection);
    }

    // Touch support for .hover effect on mobile
    const hoverTargets = document.querySelectorAll(
        '.project-card, .skill-card, .info-card, .value-item, .projects-btn, .social-icon, .social-card, .submit-btn, .contact-method'
    );

    hoverTargets.forEach(el => {
        el.addEventListener('touchstart', () => el.classList.add('hover'), { passive: true });
        el.addEventListener('touchend', () => {
            setTimeout(() => el.classList.remove('hover'), 400); // brief glow
        });
    });
});
