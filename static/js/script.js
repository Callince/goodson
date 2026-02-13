/* =============================================
   ROMANTIC PROPOSAL WEBSITE - JAVASCRIPT
   ============================================= */

// ---- Background Music Setup ----
function initMusic() {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    // Set volume to 30% (0.3)
    music.volume = 0.3;

    // Check if there's a saved playback position from previous page
    const savedTime = sessionStorage.getItem("musicTime");
    const savedPlaying = sessionStorage.getItem("musicPlaying");

    if (savedTime) {
        music.currentTime = parseFloat(savedTime);
    }

    // Try to play (browsers may block autoplay)
    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Autoplay blocked - play on first user interaction
            const playOnInteraction = () => {
                music.play();
                sessionStorage.setItem("musicPlaying", "true");
                document.removeEventListener("click", playOnInteraction);
                document.removeEventListener("keydown", playOnInteraction);
            };
            document.addEventListener("click", playOnInteraction);
            document.addEventListener("keydown", playOnInteraction);
        });
    }

    // Save playback position when leaving the page
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("musicTime", music.currentTime.toString());
        sessionStorage.setItem("musicPlaying", music.paused ? "false" : "true");
    });

    // Update saved time periodically
    setInterval(() => {
        if (!music.paused) {
            sessionStorage.setItem("musicTime", music.currentTime.toString());
        }
    }, 1000);
}

// ---- Floating Hearts (used on all pages) ----
function spawnFloatingHearts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const hearts = ["\u2764", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\u2665", "\uD83E\uDE77", "🐼", "🌸", "✨", "🐼", "💕"];

    function createHeart() {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = (Math.random() * 18 + 14) + "px";
        heart.style.animationDuration = (Math.random() * 5 + 6) + "s";
        heart.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 12000);
    }

    setInterval(createHeart, 2500);
    // Create a few immediately
    for (let i = 0; i < 3; i++) {
        setTimeout(createHeart, i * 800);
    }
}


// ---- Starry Sky Canvas ----
function initStars(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let shootingStars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.8 + 0.3,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.005 + 0.002,
                direction: Math.random() > 0.5 ? 1 : -1,
            });
        }
    }

    function createShootingStar() {
        if (Math.random() > 0.985) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5,
                length: Math.random() * 60 + 40,
                speed: Math.random() * 6 + 4,
                angle: (Math.PI / 4) + (Math.random() * 0.3 - 0.15),
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stars with blinking effect
        stars.forEach((star) => {
            star.alpha += star.speed * star.direction;
            if (star.alpha >= 1) star.direction = -1;
            if (star.alpha <= 0.2) star.direction = 1;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

            // Add subtle random blink
            const blinkEffect = Math.random() > 0.98 ? 0.3 : 1;
            const finalAlpha = star.alpha * blinkEffect;

            ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
            ctx.fill();
        });

        // Draw shooting stars
        shootingStars.forEach((ss, index) => {
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            const endX = ss.x - Math.cos(ss.angle) * ss.length;
            const endY = ss.y + Math.sin(ss.angle) * ss.length;
            const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.alpha -= ss.decay;

            if (ss.alpha <= 0) shootingStars.splice(index, 1);
        });

        createShootingStar();
        requestAnimationFrame(draw);
    }

    resize();
    createStars(200);
    draw();
    window.addEventListener("resize", () => {
        resize();
        createStars(200);
    });
}


// ---- Confetti ----
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;

    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = [
        "#ff6b9d", "#ff3366", "#ff85b1", "#c44569",
        "#ffd700", "#ff69b4", "#ff1493", "#ff91af",
        "#e74c3c", "#f39c12", "#9b59b6", "#ffffff",
    ];

    for (let i = 0; i < 250; i++) {
        confetti.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: -Math.random() * 18 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            gravity: 0.25,
            drag: 0.98,
            alpha: 1,
            shape: Math.random() > 0.5 ? "rect" : "circle",
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        confetti.forEach((c) => {
            if (c.alpha <= 0) return;
            alive = true;

            c.vy += c.gravity;
            c.vx *= c.drag;
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotSpeed;

            if (c.y > canvas.height + 50) {
                c.alpha -= 0.05;
            }

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.fillStyle = c.color;

            if (c.shape === "rect") {
                ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        if (alive) {
            requestAnimationFrame(drawConfetti);
        }
    }

    drawConfetti();

    // Launch a second burst after a short delay
    setTimeout(() => {
        for (let i = 0; i < 150; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: -20,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.15,
                drag: 0.99,
                alpha: 1,
                shape: Math.random() > 0.5 ? "rect" : "circle",
            });
        }
    }, 800);
}


// ---- Heart Burst (on YES) ----
function createHeartBurst() {
    const burst = document.getElementById("heartBurst");
    if (!burst) return;

    const hearts = ["\u2764\uFE0F", "\uD83D\uDC96", "\uD83D\uDC95", "\uD83D\uDC97", "\uD83E\uDE77", "\uD83D\uDC9E", "🐼", "🌸", "✨", "🐼", "💕"];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement("span");
        heart.className = "burst-heart";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (Math.PI * 2 * i) / 30;
        const distance = Math.random() * 300 + 150;
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.setProperty("--tx", Math.cos(angle) * distance + "px");
        heart.style.setProperty("--ty", Math.sin(angle) * distance + "px");
        heart.style.setProperty("--rot", Math.random() * 360 + "deg");
        heart.style.fontSize = (Math.random() * 20 + 16) + "px";
        heart.style.animationDelay = Math.random() * 0.3 + "s";
        burst.appendChild(heart);
    }
}


// ---- Typewriter Effect ----
function typeWriter(elementId, text, speed, callback) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const container = element.closest('.typewriter-container');
    let i = 0;
    const cursor = document.createElement("span");
    cursor.className = "typewriter-cursor";
    element.appendChild(cursor);

    function type() {
        if (i < text.length) {
            if (text[i] === "\n") {
                element.insertBefore(document.createElement("br"), cursor);
            } else {
                element.insertBefore(document.createTextNode(text[i]), cursor);
            }
            i++;

            // Auto-scroll to keep cursor visible
            if (container) {
                const cursorRect = cursor.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // If cursor is near bottom of container, scroll down
                if (cursorRect.bottom > containerRect.bottom - 50) {
                    container.scrollTop = container.scrollHeight;
                }
            }

            setTimeout(type, speed);
        } else {
            // Blink cursor a few times then remove
            setTimeout(() => {
                cursor.remove();
                if (callback) callback();
            }, 1500);
        }
    }

    type();
}


// ---- NO Button Disappear on Hover ----
function setupNoButton() {
    const btn = document.getElementById("noBtn");
    const yesBtn = document.getElementById("yesBtn");
    const buttonsContainer = document.querySelector(".proposal-buttons");
    if (!btn || !yesBtn) return;

    btn.addEventListener("mouseenter", function () {
        // Fade out and shrink the NO button
        btn.style.opacity = "0";
        btn.style.transform = "scale(0.3)";
        btn.style.pointerEvents = "none";

        // After fade-out, hide it and center YES
        setTimeout(function () {
            btn.style.display = "none";
            buttonsContainer.style.justifyContent = "center";
            yesBtn.style.transform = "scale(1.2)";
            yesBtn.style.boxShadow = "0 0 50px rgba(255, 107, 157, 0.7)";
        }, 300);
    });

    // Also handle touch (tap) for mobile
    btn.addEventListener("click", function () {
        btn.style.opacity = "0";
        btn.style.transform = "scale(0.3)";
        btn.style.pointerEvents = "none";

        setTimeout(function () {
            btn.style.display = "none";
            buttonsContainer.style.justifyContent = "center";
            yesBtn.style.transform = "scale(1.2)";
            yesBtn.style.boxShadow = "0 0 50px rgba(255, 107, 157, 0.7)";
        }, 300);
    });
}

function handleNo() {
    // Fallback — should not be reached due to hover/tap above
}


// ---- YES Handler ----
function handleYes() {
    const phase2 = document.getElementById("phase2");
    const phase3 = document.getElementById("phase3");

    phase2.classList.remove("active");
    phase3.classList.add("active");

    launchConfetti();
    createHeartBurst();

    // Add love gif overlay
    showLoveGif();

    // Extra confetti bursts
    setTimeout(launchConfetti, 2000);
}

// ---- Love GIF Display (on YES) ----
function showLoveGif() {
    const loveOverlay = document.createElement("div");
    loveOverlay.className = "love-gif-overlay";
    loveOverlay.innerHTML = `
        <img src="/static/images/love you.gif" alt="Love" class="love-gif">
    `;
    document.body.appendChild(loveOverlay);

    // Show with delay
    setTimeout(() => loveOverlay.classList.add("active"), 500);

    // Fade out after 4 seconds
    setTimeout(() => {
        loveOverlay.classList.remove("active");
        setTimeout(() => loveOverlay.remove(), 1000);
    }, 4500);
}


// ---- Slideshow (1-minute auto slideshow) ----
let slideshowTimer = null;
let slideshowProgressTimer = null;

function startSlideshow() {
    const overlay = document.getElementById("slideshowOverlay");
    const slides = document.querySelectorAll(".slideshow-slide");
    const progressBar = document.getElementById("slideshowProgress");

    if (!overlay || slides.length === 0) return;

    let currentSlide = 0;
    const totalDuration = 60000; // 1 minute
    const slideInterval = totalDuration / slides.length; // ~6.67 seconds per slide
    let startTime = Date.now();

    // Show first slide
    slides[0].classList.add("active");

    // Update progress bar
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        progressBar.style.width = progress + "%";

        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            endSlideshow();
        }
    }
    updateProgress();

    // Cycle through slides
    function nextSlide() {
        slides[currentSlide].classList.remove("active");
        currentSlide++;

        if (currentSlide < slides.length) {
            slides[currentSlide].classList.add("active");
        } else {
            endSlideshow();
        }
    }

    // Set interval for slides
    slideshowTimer = setInterval(nextSlide, slideInterval);
}

function skipSlideshow() {
    endSlideshow();
}

function endSlideshow() {
    const overlay = document.getElementById("slideshowOverlay");
    if (overlay) {
        overlay.classList.add("hidden");
        setTimeout(() => {
            overlay.remove();
            // Redirect to game after slideshow ends
            setTimeout(() => {
                window.location.href = "/game";
            }, 500);
        }, 1000);
    }

    if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
    }
}

// ---- Lightbox (click to view full image) ----
function openLightbox(src, caption) {
    const overlay = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const cap = document.getElementById("lightboxCaption");
    img.src = src;
    cap.textContent = caption;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const overlay = document.getElementById("lightbox");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// Close lightbox on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
});


// ---- Page Initializers ----

function initHome() {
    initMusic();
    initStars("starsCanvas");
    spawnFloatingHearts("heartsContainer");
}

function initMemories() {
    initMusic();
    spawnFloatingHearts("heartsContainer");

    // Scroll-triggered fade-in using IntersectionObserver
    const cards = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = "running";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    cards.forEach((card) => {
        card.style.animationPlayState = "paused";
        observer.observe(card);
    });
}

function initGame() {
    initMusic();
    spawnFloatingHearts("heartsContainer");

    const gameBoard = document.getElementById("gameBoard");
    const movesEl = document.getElementById("moves");
    const pairsEl = document.getElementById("pairs");
    const winOverlay = document.getElementById("winOverlay");

    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    // Romantic quotes for each match (9 pairs)
    const romanticQuotes = [
        "Every moment with you feels like a dream come true 🐼💕",
        "You're the reason my heart smiles every single day 🌸✨",
        "In your eyes, I found my forever home 🐼❤️",
        "My love for you grows stronger with every heartbeat 💕🌸",
        "You're not just my love, you're my whole world 🐼✨",
        "With you, every day is a beautiful adventure 💖🌸",
        "You make my heart dance like nobody's watching 🐼💕",
        "Being with you feels like coming home 🌸❤️",
        "You're the best thing that ever happened to me 🐼💖"
    ];

    // Create card pairs (duplicate each photo)
    const cards = [];
    photosData.forEach(photo => {
        cards.push({ ...photo, uniqueId: `${photo.id}-a` });
        cards.push({ ...photo, uniqueId: `${photo.id}-b` });
    });

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    // Create card elements
    cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.className = "memory-card";
        cardEl.dataset.id = card.id;
        cardEl.dataset.uniqueId = card.uniqueId;

        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-front">🐼</div>
                <div class="card-back">
                    <img src="/static/${card.src}" alt="Memory">
                </div>
            </div>
        `;

        cardEl.addEventListener("click", () => flipCard(cardEl));
        gameBoard.appendChild(cardEl);
    });

    function showMatchCelebration(quote) {
        // Create celebration overlay
        const celebration = document.createElement("div");
        celebration.className = "match-celebration";
        celebration.innerHTML = `
            <div class="celebration-content">
                <img src="/static/images/danscing bear.gif" alt="Dancing Bears" class="dancing-bear">
                <p class="match-quote">${quote}</p>
            </div>
        `;
        document.body.appendChild(celebration);

        // Trigger animation
        setTimeout(() => celebration.classList.add("active"), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            celebration.classList.remove("active");
            setTimeout(() => celebration.remove(), 500);
        }, 3000);
    }

    function flipCard(card) {
        if (!canFlip) return;
        if (card.classList.contains("flipped") || card.classList.contains("matched")) return;
        if (flippedCards.length >= 2) return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesEl.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
        const id1 = card1.dataset.id;
        const id2 = card2.dataset.id;

        if (id1 === id2) {
            // Match!
            setTimeout(() => {
                card1.classList.add("matched");
                card2.classList.add("matched");
                matchedPairs++;
                pairsEl.textContent = matchedPairs;

                // Show celebration with dancing bear and romantic quote
                const quote = romanticQuotes[matchedPairs - 1];
                showMatchCelebration(quote);

                flippedCards = [];
                canFlip = true;

                // Check if game won
                if (matchedPairs === 9) {
                    setTimeout(() => {
                        winOverlay.classList.add("active");
                        launchConfetti();
                    }, 3500); // Delay to show last celebration
                }
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                flippedCards = [];
                canFlip = true;
            }, 1200);
        }
    }
}

function initProposal() {
    initMusic();
    initStars("starsCanvas");
    spawnFloatingHearts("heartsContainer");

    // Start typewriter sequence
    const lines = [
        "Devika, I don't need a long story,",
        "\nThese memories already say everything. 🐼💕",
        "\n\nWhen the world feels heavy,",
        "\nand I'm lost in distress,",
        "\nyou're the one who makes me feel stable again. 🌸",
        "\n\nYou're not just a part of my life,",
        "\nyou are my everything. ✨",
        "\n\nMy peace, my home, my reason to smile. 🐼❤️",
        "\n\nWith you, I found something I never want to lose...",
    ];
    const fullText = lines.join("\n");

    setTimeout(() => {
        typeWriter("typewriterText", fullText, 60, () => {
            // After typewriter finishes, transition to phase 2
            setTimeout(() => {
                document.getElementById("phase1").classList.remove("active");
                document.getElementById("phase2").classList.add("active");
                setupNoButton();
            }, 1200);
        });
    }, 800);
}
