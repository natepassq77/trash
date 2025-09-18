// Poetry Website JavaScript - Fixed version for proper poem interaction
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

    // DOM Elements
    let poemItems, poemDisplay, prevBtn, nextBtn, randomBtn, enterBtn, navLinks;

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
        setupFallingLeaves();
        updateNavigationButtons();

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
    }

    // Poem interactions setup
    function setupPoemInteractions() {
        console.log(`Setting up interactions for ${poemItems.length} poem items...`);

        // Poem selection
        poemItems.forEach((item, index) => {
            console.log(`Setting up poem item ${index}`);

            // Add click event listener
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Poem ${index} clicked - ${poems[index]}`);
                selectPoem(index);
            });

            // Add touch event for mobile
            item.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Poem ${index} touched - ${poems[index]}`);
                selectPoem(index);
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
            } else {
                item.classList.remove('active');
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
            console.log('Available content elements:', Array.from(document.querySelectorAll('[id$="-content"]')).map(el => el.id));
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
        }, 300);
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

    // Falling leaves animation (simplified for performance)
    function setupFallingLeaves() {
        const canvas = document.getElementById('leavesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let leaves = [];
        const maxLeaves = window.innerWidth < 768 ? 8 : 15;

        // Resize canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Leaf constructor
        function Leaf() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 5 + 3;
            this.speed = Math.random() * 1.2 + 0.4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.drift = Math.random() * 1.2 - 0.6;
            this.color = 'rgba(122, 82, 48, 0.5)';
        }

        Leaf.prototype.update = function() {
            this.y += this.speed;
            this.x += this.drift * 0.3;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        };

        Leaf.prototype.draw = function() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.4, 0, 0, 2 * Math.PI);
            ctx.fill();

            ctx.restore();
        };

        // Initialize leaves
        for (let i = 0; i < maxLeaves; i++) {
            leaves.push(new Leaf());
        }

        // Animation loop
        function animate() {
            if (document.hidden) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            leaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });

            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);
    }

    // Debug utilities
    window.poemDebug = {
        currentPoem: () => currentPoemIndex >= 0 ? poems[currentPoemIndex] : 'none',
        selectPoem: selectPoem,
        poemCount: poems.length,
        testPoem: (index) => {
            console.log(`Testing poem ${index}`);
            selectPoem(index);
        },
        listAllPoems: () => {
            console.log('All poems:', poems);
            console.log('Poem elements found:');
            poems.forEach((poemId, index) => {
                const element = document.getElementById(`${poemId}-content`);
                console.log(`${index}: ${poemId} - ${element ? 'FOUND' : 'MISSING'}`);
            });
        }
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
