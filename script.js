// Poetry Website JavaScript - Gothic Romantic Theme
// Enhanced for GitHub Pages compatibility with better event handling

(function() {
    'use strict';

    // State management
    let currentPoemIndex = -1;
    const poems = [
        'altars-of-salt',
        'guillotine-of-sugar', 
        'library-of-ash',
        'cartography-of-time',
        'winters-not-a-season',
        'cathedral-of-ruin',
        'hunger-psalm',
        'elegy-with-your-name',
        'secret-door'
    ];

    // DOM Elements - will be initialized after DOM load
    let poemItems, poemDisplay, prevBtn, nextBtn, randomBtn, enterBtn, navLinks;

    // Touch handling variables
    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    // Initialize when DOM is ready
    function init() {
        console.log('Initializing poetry website...');
        
        // Get DOM elements
        poemItems = document.querySelectorAll('.poem-item');
        poemDisplay = document.getElementById('poem-display');
        prevBtn = document.querySelector('.prev-btn');
        nextBtn = document.querySelector('.next-btn');
        randomBtn = document.querySelector('.random-poem-btn');
        enterBtn = document.querySelector('.enter-button');
        navLinks = document.querySelectorAll('.nav-link, .secret-link');

        if (!poemDisplay) {
            console.error('Critical elements not found');
            return;
        }

        setupNavigation();
        setupPoemInteractions();
        setupTouchHandling();
        setupFallingLeaves();
        setupAnimations();
        updateNavigationButtons();
        setupAccessibility();
        
        console.log('Poetry website initialized successfully');
        console.log('Available poems:', poems);
        console.log('Poem items found:', poemItems.length);
    }

    // Navigation setup
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                if (target && target.startsWith('#')) {
                    const section = document.querySelector(target);
                    if (section) {
                        section.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Enter the Archive button
        if (enterBtn) {
            enterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const poemsSection = document.getElementById('poems');
                if (poemsSection) {
                    poemsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }

        // Update active nav link on scroll
        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${id}"]`);

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Poem interactions setup
    function setupPoemInteractions() {
        console.log(`Setting up interactions for ${poemItems.length} poem items...`);
        
        // Poem selection with better event handling
        poemItems.forEach((item, index) => {
            console.log(`Setting up poem item ${index}`);
            
            // Multiple event types for better compatibility
            const events = ['click', 'touchend'];
            
            events.forEach(eventType => {
                item.addEventListener(eventType, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Avoid double-firing on devices that support both touch and mouse
                    if (eventType === 'click' && e.type === 'click' && this.touchHandled) {
                        this.touchHandled = false;
                        return;
                    }
                    if (eventType === 'touchend') {
                        this.touchHandled = true;
                    }
                    
                    console.log(`Poem ${index} activated via ${eventType} - ${poems[index]}`);
                    selectPoem(index);
                }, { passive: false });
            });
            
            // Keyboard accessibility
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log(`Poem ${index} keyboard activated`);
                    selectPoem(index);
                }
            });

            // Make sure it's properly focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Previous button clicked');
                if (currentPoemIndex > 0) {
                    selectPoem(currentPoemIndex - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Next button clicked');
                if (currentPoemIndex < poems.length - 1) {
                    selectPoem(currentPoemIndex + 1);
                }
            });
        }

        // Random poem button
        if (randomBtn) {
            randomBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const randomIndex = Math.floor(Math.random() * poems.length);
                console.log(`Random poem selected: ${randomIndex}`);
                selectPoem(randomIndex);
                
                // Simple ink blot animation
                const inkBlot = this.querySelector('.ink-blot');
                if (inkBlot) {
                    inkBlot.classList.add('clicked');
                    setTimeout(() => {
                        inkBlot.classList.remove('clicked');
                    }, 600);
                }
            });
        }

        // Keyboard navigation for poems
        document.addEventListener('keydown', function(e) {
            if (document.activeElement && document.activeElement.closest('.poems-section')) {
                if (e.key === 'ArrowLeft' && currentPoemIndex > 0) {
                    selectPoem(currentPoemIndex - 1);
                } else if (e.key === 'ArrowRight' && currentPoemIndex < poems.length - 1) {
                    selectPoem(currentPoemIndex + 1);
                }
            }
        });
    }

    function selectPoem(index) {
        console.log(`Selecting poem ${index} (${poems[index]})`);
        
        if (index < 0 || index >= poems.length) {
            console.log('Invalid poem index:', index);
            return;
        }

        currentPoemIndex = index;
        const poemId = poems[index];
        
        // Update active poem in list
        poemItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                item.setAttribute('aria-pressed', 'true');
            } else {
                item.classList.remove('active');
                item.setAttribute('aria-pressed', 'false');
            }
        });

        // Display poem content
        displayPoem(poemId);
        updateNavigationButtons();

        // Smooth scroll to poem reader on mobile
        if (window.innerWidth < 768) {
            const poemReader = document.querySelector('.poem-reader');
            if (poemReader) {
                setTimeout(() => {
                    poemReader.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }

    function displayPoem(poemId) {
        console.log(`Displaying poem: ${poemId}`);
        
        const poemContent = document.getElementById(`${poemId}-content`);
        
        if (!poemContent) {
            console.error(`Could not find poem content for: ${poemId}`);
            return;
        }
        
        if (!poemDisplay) {
            console.error('Could not find poem display element');
            return;
        }
        
        // Fade out current content
        poemDisplay.style.opacity = '0';
        poemDisplay.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            // Replace content
            poemDisplay.innerHTML = poemContent.innerHTML;
            console.log('Poem content updated successfully');
            
            // Fade in new content
            poemDisplay.style.opacity = '1';
            poemDisplay.style.transform = 'translateY(0)';
            
            // Announce to screen readers
            const poemTitle = poemContent.querySelector('h3');
            if (poemTitle && window.announcePoem) {
                window.announcePoem(poemTitle.textContent);
            }
        }, 300);
    }

    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentPoemIndex <= 0;
            prevBtn.style.opacity = currentPoemIndex <= 0 ? '0.5' : '1';
            prevBtn.setAttribute('aria-disabled', currentPoemIndex <= 0 ? 'true' : 'false');
        }
        if (nextBtn) {
            nextBtn.disabled = currentPoemIndex >= poems.length - 1;
            nextBtn.style.opacity = currentPoemIndex >= poems.length - 1 ? '0.5' : '1';
            nextBtn.setAttribute('aria-disabled', currentPoemIndex >= poems.length - 1 ? 'true' : 'false');
        }
    }

    // Touch handling for mobile devices
    function setupTouchHandling() {
        const poemsSection = document.getElementById('poems');
        if (poemsSection) {
            poemsSection.addEventListener('touchstart', handleTouchStart, { passive: true });
            poemsSection.addEventListener('touchmove', handleTouchMove, { passive: true });
            poemsSection.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    }

    function handleTouchStart(e) {
        if (e.touches && e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isScrolling = false;
        }
    }

    function handleTouchMove(e) {
        if (!touchStartY || !touchStartX || (e.touches && e.touches.length > 1)) {
            return;
        }

        if (e.touches && e.touches[0]) {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const diffY = touchStartY - touchY;
            const diffX = touchStartX - touchX;

            // Determine if user is scrolling
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isScrolling = true;
            }
        }
    }

    function handleTouchEnd(e) {
        if (isScrolling || !touchStartY || !touchStartX) {
            return;
        }

        if (e.changedTouches && e.changedTouches[0]) {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const diffY = touchStartY - touchEndY;
            const diffX = touchStartX - touchEndX;

            // Swipe gestures for poem navigation (only on mobile)
            if (window.innerWidth < 768 && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && currentPoemIndex < poems.length - 1) {
                    // Swipe left - next poem
                    selectPoem(currentPoemIndex + 1);
                } else if (diffX < 0 && currentPoemIndex > 0) {
                    // Swipe right - previous poem
                    selectPoem(currentPoemIndex - 1);
                }
            }
        }

        // Reset touch values
        touchStartY = 0;
        touchStartX = 0;
        isScrolling = false;
    }

    // Accessibility improvements
