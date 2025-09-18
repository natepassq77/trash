// Poetry Website JavaScript - Gothic Romantic Theme
// Handles navigation, poem display, animations, and falling leaves effect

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let currentPoemIndex = -1; // Start with no poem selected
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

    // DOM Elements
    const poemItems = document.querySelectorAll('.poem-item');
    const poemDisplay = document.getElementById('poem-display');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const randomBtn = document.querySelector('.random-poem-btn');
    const enterBtn = document.querySelector('.enter-button');
    const navLinks = document.querySelectorAll('.nav-link, .secret-link');

    // Touch handling variables
    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    // Initialize
    init();

    function init() {
        setupNavigation();
        setupPoemInteractions();
        setupTouchHandling();
        setupFallingLeaves();
        setupAnimations();
        updateNavigationButtons();
        setupAccessibility();
    }

    // Navigation setup
    function setupNavigation() {
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                if (target.startsWith('#')) {
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
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Poem interactions setup
    function setupPoemInteractions() {
        console.log('Setting up poem interactions...'); // Debug log
        
        // Poem selection
        poemItems.forEach((item, index) => {
            console.log(`Setting up poem item ${index}:`, item); // Debug log
            
            // Remove any existing event listeners
            item.removeEventListener('click', handlePoemClick);
            item.removeEventListener('touchend', handlePoemClick);
            
            // Add click event listener
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Poem ${index} clicked`); // Debug log
                selectPoem(index);
            });
            
            // Add touch event for mobile
            item.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Poem ${index} touched`); // Debug log
                selectPoem(index);
            });
            
            // Keyboard accessibility
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log(`Poem ${index} keyboard activated`); // Debug log
                    selectPoem(index);
                }
            });
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPoemIndex > 0) {
                    selectPoem(currentPoemIndex - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
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
                console.log(`Random poem selected: ${randomIndex}`); // Debug log
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
            if (document.activeElement.closest('.poems-section')) {
                if (e.key === 'ArrowLeft' && currentPoemIndex > 0) {
                    selectPoem(currentPoemIndex - 1);
                } else if (e.key === 'ArrowRight' && currentPoemIndex < poems.length - 1) {
                    selectPoem(currentPoemIndex + 1);
                }
            }
        });
    }

    function selectPoem(index) {
        console.log(`Selecting poem ${index}...`); // Debug log
        
        if (index < 0 || index >= poems.length) {
            console.log('Invalid poem index'); // Debug log
            return;
        }

        currentPoemIndex = index;
        const poemId = poems[index];
        console.log(`Poem ID: ${poemId}`); // Debug log
        
        // Update active poem in list
        poemItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
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
        console.log(`Displaying poem: ${poemId}`); // Debug log
        
        const poemContent = document.getElementById(`${poemId}-content`);
        console.log('Found poem content:', poemContent); // Debug log
        
        if (poemContent && poemDisplay) {
            // Fade out current content
            poemDisplay.style.opacity = '0';
            poemDisplay.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // Replace content
                poemDisplay.innerHTML = poemContent.innerHTML;
                console.log('Poem content updated'); // Debug log
                
                // Fade in new content
                poemDisplay.style.opacity = '1';
                poemDisplay.style.transform = 'translateY(0)';
                
                // Announce to screen readers
                const poemTitle = poemContent.querySelector('h3');
                if (poemTitle && window.announcePoem) {
                    window.announcePoem(poemTitle.textContent);
                }
            }, 300);
        } else {
            console.error('Could not find poem content or display element'); // Debug log
        }
    }

    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentPoemIndex <= 0;
            prevBtn.style.opacity = currentPoemIndex <= 0 ? '0.5' : '1';
        }
        if (nextBtn) {
            nextBtn.disabled = currentPoemIndex >= poems.length - 1;
            nextBtn.style.opacity = currentPoemIndex >= poems.length - 1 ? '0.5' : '1';
        }
    }

    // Touch handling for mobile devices
    function setupTouchHandling() {
        // Handle touch events for poem navigation
        const poemsSection = document.getElementById('poems');
        if (poemsSection) {
            poemsSection.addEventListener('touchstart', handleTouchStart, { passive: true });
            poemsSection.addEventListener('touchmove', handleTouchMove, { passive: true });
            poemsSection.addEventListener('touchend', handleTouchEnd, { passive: false });
        }
    }

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isScrolling = false;
        }
    }

    function handleTouchMove(e) {
        if (!touchStartY || !touchStartX || e.touches.length > 1) {
            return;
        }

        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const diffY = touchStartY - touchY;
        const diffX = touchStartX - touchX;

        // Determine if user is scrolling
        if (Math.abs(diffY) > Math.abs(diffX)) {
            isScrolling = true;
        }
    }

    function handleTouchEnd(e) {
        if (isScrolling || !touchStartY || !touchStartX) {
            return;
        }

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

        // Reset touch values
        touchStartY = 0;
        touchStartX = 0;
        isScrolling = false;
    }

    // Accessibility improvements
    function setupAccessibility() {
        // Announce poem changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);

        // Function to announce poem changes
        window.announcePoem = function(poemTitle) {
            announcer.textContent = `Now reading: ${poemTitle}`;
        };

        // Add focus indicators for better keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Falling leaves animation
    function setupFallingLeaves() {
        const canvas = document.getElementById('leavesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let leaves = [];
        let animationId = null;
        const maxLeaves = window.innerWidth < 768 ? 10 : 20; // Reduced for mobile performance

        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Leaf constructor
        function Leaf(x, y) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || -10;
            this.size = Math.random() * 6 + 3;
            this.speed = Math.random() * 1.5 + 0.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 3;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.drift = Math.random() * 1.5 - 0.75;
            this.color = this.getLeafColor();
        }

        Leaf.prototype.getLeafColor = function() {
            const colors = [
                'rgba(122, 82, 48, 0.6)',    // burnt umber
                'rgba(75, 44, 44, 0.5)',     // deep burgundy  
                'rgba(212, 175, 55, 0.4)',   // muted gold
                'rgba(139, 69, 19, 0.5)',    // saddle brown
                'rgba(160, 82, 45, 0.4)'     // sienna
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        Leaf.prototype.update = function() {
            this.y += this.speed;
            this.x += this.drift * 0.3;
            this.rotation += this.rotationSpeed;

            // Gentle sine wave motion
            this.x += Math.sin(this.y * 0.008) * 0.3;

            // Reset when leaf goes off screen
            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width + 10) {
                this.x = -10;
            } else if (this.x < -10) {
                this.x = canvas.width + 10;
            }
        };

        Leaf.prototype.draw = function() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;

            // Draw leaf shape
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, 2 * Math.PI);
            ctx.fill();

            // Draw leaf stem (simplified for mobile)
            if (this.size > 4) {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, this.size * 1.5);
                ctx.lineTo(0, this.size * 2);
                ctx.stroke();
            }

            ctx.restore();
        };

        // Initialize leaves
        function initLeaves() {
            leaves = [];
            for (let i = 0; i < maxLeaves; i++) {
                leaves.push(new Leaf(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height
                ));
            }
        }

        // Animation loop with performance optimization
        function animate() {
            // Check if reduced motion is preferred or page is hidden
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            leaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });

            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        resizeCanvas();
        initLeaves();
        animate();

        // Handle window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                // Adjust number of leaves based on screen size
                const newMaxLeaves = window.innerWidth < 768 ? 10 : 20;
                if (newMaxLeaves !== maxLeaves) {
                    initLeaves();
                }
            }, 250);
        });

        // Pause/resume animation based on page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            } else {
                if (!animationId) {
                    animate();
                }
            }
        });

        // Clean up animation when leaving page
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    // Scroll animations setup
    function setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for fade-in effect
        document.querySelectorAll('.section').forEach(section => {
            if (section.id !== 'home') { // Home section already has animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            }
        });

        // Icon hover animations (simplified for mobile)
        document.querySelectorAll('.poem-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 768) { // Only on desktop
                    this.style.animation = 'none';
                    setTimeout(() => {
                        this.style.animation = 'iconHover 0.6s ease-in-out';
                    }, 10);
                }
            });
        });

        // Secret page letter unfold animation
        const secretSection = document.getElementById('secret');
        if (secretSection) {
            const secretObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const letterContainer = entry.target.querySelector('.letter-container');
                        if (letterContainer) {
                            letterContainer.style.animation = 'letterUnfold 0.8s ease-out';
                        }
                    }
                });
            }, { threshold: 0.2 });
            
            secretObserver.observe(secretSection);
        }
    }

    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Add CSS for transitions that need to be set via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        .poem-content {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus {
            outline: 2px solid var(--muted-gold);
            outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .poem-content {
                transition: none;
            }
            
            .section {
                transition: none !important;
            }
        }
        
        @media (max-width: 767px) {
            .poem-item {
                -webkit-tap-highlight-color: rgba(212, 175, 55, 0.2);
                tap-highlight-color: rgba(212, 175, 55, 0.2);
            }
            
            button {
                -webkit-tap-highlight-color: rgba(212, 175, 55, 0.3);
                tap-highlight-color: rgba(212, 175, 55, 0.3);
            }
        }
    `;
    document.head.appendChild(style);

    // Debug function for testing
    window.poemDebug = {
        currentPoem: () => poems[currentPoemIndex],
        selectPoem: selectPoem,
        poemCount: poems.length,
        isMobile: () => window.innerWidth < 768,
        testPoem: (index) => {
            console.log(`Testing poem ${index}`);
            selectPoem(index);
        }
    };

    // Log initialization completion
    console.log('Poetry website initialized successfully');
    console.log(`Found ${poemItems.length} poem items`);
    console.log(`Found ${poems.length} poems`);
});
