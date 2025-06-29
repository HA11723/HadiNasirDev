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
    // Updated to include about page sections (removed duplicate .about-section)
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

    // Run once on load and then on scroll
    if (sections.length > 0) {
        revealSection();
        window.addEventListener('scroll', revealSection);
    }
});