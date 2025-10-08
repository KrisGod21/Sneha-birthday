// Global variables
let isPlaying = false;
let confettiInterval;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'why-i-love-you':
            initializeLovePage();
            break;
        case 'birthday-wishes':
            initializeWishesPage();
            break;
        case 'your-favorites':
            initializeFavoritesPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

// Home Page Functions
function initializeHomePage() {
    setupSoundTrigger();
    attemptAutoplay();
    startFloatingHearts();
    animateTitle();
    initializeCake();
}

function setupSoundTrigger() {
    const soundTrigger = document.getElementById('soundTrigger');
    const birthdayMusic = document.getElementById('birthdayMusic');
    
    if (soundTrigger && birthdayMusic) {
        soundTrigger.addEventListener('click', function() {
            if (!isPlaying) {
                // Try to play music (note: might need user interaction first)
                birthdayMusic.play().then(() => {
                    isPlaying = true;
                    soundTrigger.innerHTML = `
                        <div class="music-icon playing">🎵</div>
                        <p>Music is playing! 🎶</p>
                    `;
                    startConfetti();
                }).catch(error => {
                    console.log('Audio play failed:', error);
                    // Show message even if audio fails
                    soundTrigger.innerHTML = `
                        <div class="music-icon">🎵</div>
                        <p>Happy Birthday Song! 🎶</p>
                    `;
                    startConfetti();
                });
            } else {
                birthdayMusic.pause();
                isPlaying = false;
                soundTrigger.innerHTML = `
                    <div class="music-icon">🎵</div>
                    <p>Click for birthday music!</p>
                `;
                stopConfetti();
            }
        });
    }
}

// Try autoplay on load (will be blocked on many browsers until interaction)
function attemptAutoplay() {
    const soundTrigger = document.getElementById('soundTrigger');
    const birthdayMusic = document.getElementById('birthdayMusic');
    if (!birthdayMusic || !soundTrigger) return;
    birthdayMusic.play().then(() => {
        isPlaying = true;
        soundTrigger.innerHTML = `
            <div class="music-icon playing">🎵</div>
            <p>Music is playing! 🎶</p>
        `;
        startConfetti();
    }).catch(() => {
        // Autoplay blocked; keep the UI as a prompt to click
    });
}

function startConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    // Clear any existing confetti
    confettiContainer.innerHTML = '';
    
    confettiInterval = setInterval(() => {
        createConfetti(confettiContainer);
    }, 100);
    
    // Stop confetti after 10 seconds
    setTimeout(() => {
        stopConfetti();
    }, 10000);
}

function stopConfetti() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
}

function createConfetti(container) {
    const colors = ['#FF69B4', '#DA70D6', '#FFB6C1', '#DDA0DD', '#F0E68C'];
    
    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

function animateTitle() {
    const letters = document.querySelectorAll('.birthday-title .letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = (index * 0.1) + 's';
    });
}

function startFloatingHearts() {
    const hearts = document.querySelectorAll('.floating-hearts .heart, .floating-particles .particle, .floating-waffles .waffle');
    hearts.forEach((heart, index) => {
        heart.style.animationDelay = (index * 1) + 's';
        heart.style.left = Math.random() * 90 + '%';
    });
}

// Love Page Functions
function initializeLovePage() {
    setupRevealAnimation();
    startFloatingHearts();
}

function setupRevealAnimation() {
    const reasonCards = document.querySelectorAll('.reason-card');
    
    // Create intersection observer for reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reasonCards.forEach(card => {
        observer.observe(card);
    });
}

// Birthday Wishes Page Functions
function initializeWishesPage() {
    setupVideoUpload();
    startFloatingHearts();
}

function setupVideoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const videoUpload = document.getElementById('videoUpload');
    
    if (uploadArea && videoUpload) {
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.background = 'rgba(255, 105, 180, 0.1)';
            uploadArea.style.borderColor = '#DA70D6';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '#FF69B4';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '#FF69B4';
            
            const files = e.dataTransfer.files;
            handleVideoFiles(files);
        });
        
        // File input change
        videoUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            handleVideoFiles(files);
        });
    }
}

function handleVideoFiles(files) {
    const wishesGrid = document.querySelector('.wishes-grid');
    const addMoreCard = document.querySelector('.add-more');
    
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('video/')) {
            createVideoWishCard(file, wishesGrid, addMoreCard);
        }
    });
}

function createVideoWishCard(file, container, addMoreCard) {
    const videoURL = URL.createObjectURL(file);
    
    const wishCard = document.createElement('div');
    wishCard.className = 'wish-card';
    wishCard.innerHTML = `
        <div class="video-wrapper">
            <video controls>
                <source src="${videoURL}" type="${file.type}">
                Your browser doesn't support video playback.
            </video>
        </div>
        <div class="wish-info">
            <h4>${file.name}</h4>
            <p>A special birthday wish just uploaded! 🎉</p>
        </div>
    `;
    
    // Insert before the "add more" card
    container.insertBefore(wishCard, addMoreCard);
    
    // Add animation
    setTimeout(() => {
        wishCard.style.opacity = '0';
        wishCard.style.transform = 'translateY(50px)';
        wishCard.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            wishCard.style.opacity = '1';
            wishCard.style.transform = 'translateY(0)';
        }, 100);
    }, 100);
}

// Favorites Page Functions
function initializeFavoritesPage() {
    setupFavoriteCards();
    startFloatingHearts();
}

function setupFavoriteCards() {
    const favoriteCards = document.querySelectorAll('.favorite-card');
    
    // Add stagger animation to cards
    favoriteCards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.2) + 's';
        card.classList.add('fade-in');
    });
    
    // Add hover effects to favorite items
    const favoriteItems = document.querySelectorAll('.favorite-item');
    favoriteItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
}

// Utility Functions
function createFloatingElement(className, content, container) {
    const element = document.createElement('div');
    element.className = className;
    element.innerHTML = content;
    element.style.left = Math.random() * 90 + '%';
    element.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(element);
    
    // Remove element after animation completes
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, 8000);
}

// Add smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add page transition effects
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .music-icon.playing {
        animation: pulse 1s infinite, rotate 2s infinite linear;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Add some interactive sound effects (optional)
function playClickSound() {
    // Create a simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add click sounds to navigation links
document.querySelectorAll('.nav-link, .back-btn').forEach(link => {
    link.addEventListener('click', playClickSound);
});

// Birthday Cake Functionality
let candlesBlown = 0;
let totalCandles = 3;
let blowAudio = null;

function initializeCake() {
    const cakeSection = document.querySelector('.cake-section');
    if (!cakeSection) return;
    
    setupCandleBlowing();
    createSparkles();
}

function setupCandleBlowing() {
    const candles = document.querySelectorAll('.candle');
    
    candles.forEach((candle, index) => {
        candle.addEventListener('click', function() {
            blowOutCandle(candle, index);
        });
        
        // Add keyboard support for accessibility
        candle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                blowOutCandle(candle, index);
            }
        });
        
        // Make candles focusable
        candle.setAttribute('tabindex', '0');
        candle.setAttribute('role', 'button');
        candle.setAttribute('aria-label', `Candle ${index + 1} - Click to blow out`);
    });
}

function blowOutCandle(candle, index) {
    const flame = candle.querySelector('.candle-flame');
    const candleStick = candle.querySelector('.candle-stick');
    
    if (flame.classList.contains('blown-out')) return; // Already blown out
    
    // Blow out the flame
    flame.classList.add('blown-out');
    
    // Create smoke effect
    createSmoke(candle);
    
    // Create blow particles
    createBlowParticles(candle);
    
    // Increment blown candles counter
    candlesBlown++;
    
    // Update aria-label
    candle.setAttribute('aria-label', `Candle ${index + 1} - Blown out`);
    
    // Play blow sound effect
    playBlowSound();
    
    // Check if all candles are blown out
    if (candlesBlown >= totalCandles) {
        setTimeout(() => {
            showBirthdayMessage();
            startCelebration();
        }, 1000);
    }
    
    // Hide instruction if first candle blown
    if (candlesBlown === 1) {
        const instruction = document.querySelector('.blow-instruction');
        if (instruction) {
            instruction.classList.add('hidden');
        }
    }
}

function createSmoke(candle) {
    const smoke = document.createElement('div');
    smoke.className = 'candle-smoke';
    candle.appendChild(smoke);
    
    // Remove smoke after animation
    setTimeout(() => {
        if (smoke.parentNode) {
            smoke.parentNode.removeChild(smoke);
        }
    }, 2000);
}

function createBlowParticles(candle) {
    const particlesContainer = document.querySelector('.blow-particles') || createBlowParticlesContainer();
    const rect = candle.getBoundingClientRect();
    
    // Create multiple particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-blow';
        
        // Position particle at candle location
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + 10) + 'px';
        
        // Random colors for particles
        const colors = ['#FFD700', '#FF6347', '#FF4500', '#FFA500', '#FFFF00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation direction
        const angle = (Math.random() * 60 - 30) * Math.PI / 180; // -30 to 30 degrees
        const distance = 100 + Math.random() * 100;
        const duration = 0.8 + Math.random() * 0.4;
        
        particle.style.animation = `blow-particle ${duration}s ease-out forwards`;
        particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
}

function createBlowParticlesContainer() {
    const container = document.createElement('div');
    container.className = 'blow-particles';
    document.body.appendChild(container);
    return container;
}

function playBlowSound() {
    // Create a whoosh sound effect using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Audio context not available:', error);
    }
}

function showBirthdayMessage() {
    const message = document.querySelector('.birthday-message');
    if (message) {
        message.classList.add('show');
        
        // Hide message after 4 seconds
        setTimeout(() => {
            message.classList.remove('show');
        }, 4000);
    }
}

function startCelebration() {
    // Start confetti
    startConfetti();
    
    // Play birthday music if available
    const birthdayMusic = document.getElementById('birthdayMusic');
    if (birthdayMusic) {
        birthdayMusic.play().catch(error => {
            console.log('Birthday music play failed:', error);
        });
    }
    
    // Create extra sparkles
    createCelebrationSparkles();
    
    // Trigger fireworks effect
    setTimeout(() => {
        createFireworks();
    }, 1500);
}

function createSparkles() {
    const sparklesContainer = document.querySelector('.cake-sparkles');
    if (!sparklesContainer) return;
    
    const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '🎆'];
    
    setInterval(() => {
        if (candlesBlown < totalCandles) { // Only show sparkles while candles are lit
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            
            sparklesContainer.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }
    }, 1000);
}

function createCelebrationSparkles() {
    const sparklesContainer = document.querySelector('.cake-sparkles');
    if (!sparklesContainer) return;
    
    const celebrationEmojis = ['🎉', '🎊', '🎈', '🎁', '💕', '💖', '✨', '🌟'];
    
    // Create burst of celebration sparkles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.fontSize = (1.5 + Math.random()) + 'rem';
            
            sparklesContainer.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 3000);
        }, i * 100);
    }
}

function createFireworks() {
    const colors = ['#FF69B4', '#DA70D6', '#FFB6C1', '#DDA0DD', '#F0E68C', '#FFD700'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(colors[i % colors.length]);
        }, i * 300);
    }
}

function createFirework(color) {
    const firework = document.createElement('div');
    firework.style.position = 'fixed';
    firework.style.left = (20 + Math.random() * 60) + '%';
    firework.style.top = (20 + Math.random() * 40) + '%';
    firework.style.pointerEvents = 'none';
    firework.style.zIndex = '1000';
    
    // Create firework particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        
        const angle = (i * 30) * Math.PI / 180;
        const distance = 50 + Math.random() * 30;
        
        particle.style.animation = `firework-particle 1s ease-out forwards`;
        particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
        
        firework.appendChild(particle);
    }
    
    document.body.appendChild(firework);
    
    // Remove firework after animation
    setTimeout(() => {
        if (firework.parentNode) {
            firework.parentNode.removeChild(firework);
        }
    }, 1000);
}

console.log('🎉 Happy Birthday Sneha! Website loaded successfully! 💕');
