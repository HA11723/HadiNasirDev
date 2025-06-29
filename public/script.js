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

            // Trigger animation when section is 20% visible
            if (sectionTop < window.innerHeight - sectionHeight / 5) {
                section.classList.add('visible');
            }
        });
    };

    if (sections.length > 0) {
        revealSection();
        window.addEventListener('scroll', revealSection);
    }

    // 🔥 NEW: Simulate hover on mobile for .project-card
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.classList.add('hover');
        });

        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.classList.remove('hover');
            }, 500); // adjust duration as needed
        });
    });
});
