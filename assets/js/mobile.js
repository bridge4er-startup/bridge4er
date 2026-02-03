// assets/js/mobile.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation scroll indicators
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        // Check if navigation needs scrolling
        function checkNavScroll() {
            if (navLinks.scrollWidth > nav.clientWidth) {
                nav.classList.add('scrollable');
            } else {
                nav.classList.remove('scrollable');
            }
        }
        
        // Initial check
        checkNavScroll();
        
        // Check on resize
        window.addEventListener('resize', checkNavScroll);
        
        // Add touch/swipe support for navigation
        let startX = 0;
        let scrollLeft = 0;
        
        nav.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX;
            scrollLeft = nav.scrollLeft;
        });
        
        nav.addEventListener('touchmove', function(e) {
            if (!e.cancelable) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            nav.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Mobile field dropdown with overlay
    const fieldDropdownBtn = document.querySelector('.field-dropdown-btn');
    const fieldDropdownContent = document.querySelector('.field-dropdown-content');
    
    if (fieldDropdownBtn && fieldDropdownContent) {
        // Create overlay for mobile
        const fieldDropdownOverlay = document.createElement('div');
        fieldDropdownOverlay.className = 'field-dropdown-overlay';
        document.body.appendChild(fieldDropdownOverlay);
        
        // Add close button to dropdown
        const closeBtn = document.createElement('button');
        closeBtn.className = 'field-dropdown-mobile-close';
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close dropdown');
        fieldDropdownContent.appendChild(closeBtn);
        
        // Toggle dropdown
        fieldDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fieldDropdownContent.classList.toggle('show');
            fieldDropdownOverlay.classList.toggle('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close dropdown when clicking close button
        closeBtn.addEventListener('click', function() {
            fieldDropdownContent.classList.remove('show');
            fieldDropdownOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close dropdown when clicking overlay
        fieldDropdownOverlay.addEventListener('click', function() {
            fieldDropdownContent.classList.remove('show');
            this.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close dropdown when selecting an option
        const fieldOptions = fieldDropdownContent.querySelectorAll('.field-option');
        fieldOptions.forEach(option => {
            option.addEventListener('click', function() {
                fieldDropdownContent.classList.remove('show');
                fieldDropdownOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && fieldDropdownContent.classList.contains('show')) {
                fieldDropdownContent.classList.remove('show');
                fieldDropdownOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle mobile viewport height
    function handleViewport() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', handleViewport);
    window.addEventListener('orientationchange', handleViewport);
    handleViewport();
    
    // Fix for iOS Safari 100vh issue
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        
        const style = document.createElement('style');
        style.textContent = `
            .mcq-exam-container,
            .exam-main-content {
                height: -webkit-fill-available !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add mobile touch improvements
    const mcqOptions = document.querySelectorAll('.mcq-option');
    mcqOptions.forEach(option => {
        option.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        option.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // Prevent zoom on double tap for buttons
    const buttons = document.querySelectorAll('.btn, .nav-links a, .field-dropdown-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    });
});