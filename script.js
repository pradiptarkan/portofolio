document.addEventListener('DOMContentLoaded', function() {
    // --- Component Loading ---
    const headPlaceholder = document.querySelector('head');
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const breadcrumbPlaceholder = document.getElementById('breadcrumbs-placeholder');

    async function loadHtmlSnippet(url, element) {
        if (!element) return;
        try {
            // Add a cache-busting query parameter
            const cacheBustUrl = `${url}?v=${new Date().getTime()}`;
            const response = await fetch(cacheBustUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            if (element === headPlaceholder) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                doc.head.childNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        headPlaceholder.appendChild(document.importNode(node, true));
                    }
                });
            } else {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error(`Could not load ${url}:`, error);
        }
    }

    function setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- UX Enhancements ---

    // 3. Navbar Enhancement
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
    }

    // 1. Scroll-based Animations
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 1. Parallax Effect
    function handleParallaxEffect() {
        const heroImage = document.querySelector('.hero-image');
        if (!heroImage) return;

        const scrollY = window.scrollY;
        // Apply a subtle vertical movement. The divisor controls the effect's strength.
        heroImage.style.transform = `translateY(${scrollY * 0.1}px)`;
    }

    // Main execution flow
    async function initializePage() {
        await loadHtmlSnippet('_head.html', headPlaceholder);
        
        // Load navbar and footer in parallel
        await Promise.all([
            loadHtmlSnippet('_navbar.html', navbarPlaceholder),
            loadHtmlSnippet('_footer.html', footerPlaceholder)
        ]);

        setActiveNavLink();

        // Load breadcrumbs if the placeholder exists
        if (breadcrumbPlaceholder) {
            await loadHtmlSnippet('_breadcrumbs.html', breadcrumbPlaceholder);
            const currentPageTitle = document.title.split(' - ')[0];
            const breadcrumbActiveItem = document.querySelector('.breadcrumb-item.active');
            if (breadcrumbActiveItem) {
                breadcrumbActiveItem.textContent = currentPageTitle;
            }
        }
        
        // Initialize UX enhancements after content is loaded
        handleScrollAnimations();
        handleNavbarScroll(); // Initial check

        // Add scroll listeners for dynamic effects
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            handleParallaxEffect();
        });
    }

    initializePage();
});
