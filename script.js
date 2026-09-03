/* ==========================================================================
   CONGRATULATIONS OFFICER DEV - JAVASCRIPT (LIGHT ELEGANT THEME)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. MUSIC & ENVELOPE OPENING LOGIC
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const openInvitationBtn = document.getElementById('openInvitationBtn');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    const discIcon = document.getElementById('discIcon');
    const musicStatus = document.getElementById('musicStatus');
    const volumeIcon = document.getElementById('volumeIcon');

    let isPlaying = false;

    if (openInvitationBtn) {
        openInvitationBtn.addEventListener('click', () => {
            envelopeOverlay.classList.add('hide');
            mainContent.classList.remove('hidden');
            playMusic();
        });
    }

    function playMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
            discIcon.classList.add('spinning');
            musicStatus.textContent = 'Music On';
            volumeIcon.className = 'fa-solid fa-volume-high';
        }).catch(err => {
            console.log('Audio playback prevented or error:', err);
            isPlaying = false;
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        isPlaying = false;
        discIcon.classList.remove('spinning');
        musicStatus.textContent = 'Music Off';
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    }

    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // 2. IMAGE UPLOADERS (DEV & MAIN COUPLE)
    setupImageUploader('uploadDevInput', 'devImg', 'savedDevPhoto');
    setupImageUploader('uploadCoupleMainInput', 'coupleImg', 'savedCoupleMainPhoto');

    function setupImageUploader(inputId, imgId, storageKey) {
        const input = document.getElementById(inputId);
        const img = document.getElementById(imgId);

        const savedPhoto = localStorage.getItem(storageKey);
        if (savedPhoto && img) {
            img.src = savedPhoto;
        }

        if (input) {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        img.src = event.target.result;
                        localStorage.setItem(storageKey, event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // 3. GALLERY PHOTO PREVIEW & LIGHTBOX
    window.previewGalleryImage = function(event, imgId) {
        const file = event.target.files[0];
        const img = document.getElementById(imgId);
        if (file && img) {
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
                localStorage.setItem('saved_' + imgId, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    ['coupleImg1', 'coupleImg2', 'coupleImg3'].forEach(id => {
        const saved = localStorage.getItem('saved_' + id);
        const imgEl = document.getElementById(id);
        if (saved && imgEl) {
            imgEl.src = saved;
        }
    });

    window.openLightbox = function(imgId, captionText) {
        const imgEl = document.getElementById(imgId);
        const modal = document.getElementById('lightboxModal');
        const modalImg = document.getElementById('lightboxImg');
        const caption = document.getElementById('lightboxCaption');

        if (imgEl && modal) {
            modal.classList.add('active');
            modalImg.src = imgEl.src;
            caption.textContent = captionText || imgEl.alt;
        }
    };

    window.closeLightbox = function() {
        const modal = document.getElementById('lightboxModal');
        if (modal) modal.classList.remove('active');
    };

    // 4. LIKE & SALUTE COUNTERS
    const devLikesEl = document.getElementById('devLikes');
    const coupleLikesEl = document.getElementById('coupleLikes');

    let devLikes = parseInt(localStorage.getItem('devLikesCount')) || 184;
    let coupleLikes = parseInt(localStorage.getItem('coupleLikesCount')) || 210;

    if (devLikesEl) devLikesEl.textContent = devLikes;
    if (coupleLikesEl) coupleLikesEl.textContent = coupleLikes;

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const person = btn.getAttribute('data-person');
            if (person === 'dev') {
                devLikes++;
                localStorage.setItem('devLikesCount', devLikes);
                if (devLikesEl) devLikesEl.textContent = devLikes;
                createFloatingSparkle(e.clientX, e.clientY, '✨');
            } else if (person === 'couple') {
                coupleLikes++;
                localStorage.setItem('coupleLikesCount', coupleLikes);
                if (coupleLikesEl) coupleLikesEl.textContent = coupleLikes;
                createFloatingSparkle(e.clientX, e.clientY, '💖');
            }
        });
    });

    function createFloatingSparkle(x, y, char) {
        const item = document.createElement('span');
        item.textContent = char;
        item.style.position = 'fixed';
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.fontSize = '24px';
        item.style.pointerEvents = 'none';
        item.style.zIndex = '9999';
        item.style.transition = 'all 1s ease-out';
        document.body.appendChild(item);

        setTimeout(() => {
            item.style.transform = 'translateY(-80px) scale(1.5)';
            item.style.opacity = '0';
        }, 10);

        setTimeout(() => { item.remove(); }, 1000);
    }

    // 5. WISH WALL LOGIC
    const wishForm = document.getElementById('wishForm');
    const wishWall = document.getElementById('wishWall');

    const defaultWishes = [
        { name: 'Pooja', relation: 'Proud Partner', message: 'Watching you reach the dreams you once worked so hard for fills my heart with endless pride. Your real journey starts today, Officer Dev! ❤️✨' },
        { name: 'Rohan & Family', relation: 'Family Member', message: 'Heartiest congratulations Dev on your Passing Out Parade at NPA! So proud of you Officer!' },
        { name: 'Inspector Vikram', relation: 'Fellow Officer', message: 'Welcome to the officer fraternity! May you achieve great heights and inspire generations ahead.' }
    ];

    let wishes = JSON.parse(localStorage.getItem('officerDevWishes')) || defaultWishes;

    function renderWishes() {
        if (!wishWall) return;
        wishWall.innerHTML = '';
        wishes.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.innerHTML = `
                <div class="wish-author">
                    <span class="author-name">${escapeHtml(item.name)}</span>
                    <span class="author-relation">${escapeHtml(item.relation)}</span>
                </div>
                <p class="wish-text">${escapeHtml(item.message)}</p>
            `;
            wishWall.prepend(card);
        });
    }

    if (wishForm) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guestName').value;
            const relation = document.getElementById('guestRelation').value;
            const message = document.getElementById('guestMessage').value;

            if (name && message) {
                wishes.push({ name, relation, message });
                localStorage.setItem('officerDevWishes', JSON.stringify(wishes));
                renderWishes();
                wishForm.reset();
                alert('Thank you for your warm message! ✨');
            }
        });
    }

    renderWishes();

    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    // 6. ROMANTIC KISS BUTTON LOGIC
    const sendKissBtn = document.getElementById('sendKissBtn');
    const kissCountEl = document.getElementById('kissCount');
    let kissCount = parseInt(localStorage.getItem('devKissCount')) || 999;

    if (kissCountEl) kissCountEl.textContent = kissCount;

    if (sendKissBtn) {
        sendKissBtn.addEventListener('click', (e) => {
            kissCount++;
            localStorage.setItem('devKissCount', kissCount);
            if (kissCountEl) kissCountEl.textContent = kissCount;

            const romanticSymbols = ['💖', '💕', '💋', '❤️', '🌹', '✨'];
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 120;
                    const offsetY = (Math.random() - 0.5) * 60;
                    const sym = romanticSymbols[Math.floor(Math.random() * romanticSymbols.length)];
                    createFloatingSparkle(e.clientX + offsetX, e.clientY + offsetY, sym);
                }, i * 100);
            }
        });
    }

    // 7. SECRET LOVE NOTE MODAL LOGIC
    const secretNoteModal = document.getElementById('secretNoteModal');
    const openSecretNoteBtn = document.getElementById('openSecretNoteBtn');
    const closeSecretNoteBtn = document.getElementById('closeSecretNoteBtn');

    if (openSecretNoteBtn && secretNoteModal) {
        openSecretNoteBtn.addEventListener('click', () => {
            secretNoteModal.classList.add('active');
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const randomX = Math.random() * window.innerWidth;
                    const randomY = Math.random() * window.innerHeight;
                    createFloatingSparkle(randomX, randomY, '💖');
                }, i * 150);
            }
        });
    }

    if (closeSecretNoteBtn && secretNoteModal) {
        closeSecretNoteBtn.addEventListener('click', () => {
            secretNoteModal.classList.remove('active');
        });
    }

    // 8. FLOATING LIGHT PARTICLES & SPARKLES CANVAS
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const chars = ['✨', '🌸', '💫', '💖'];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 10 + 10,
                speedY: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.2,
                char: chars[Math.floor(Math.random() * chars.length)]
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += Math.sin(p.y * 0.01) * 0.4;

                if (p.y < -20) {
                    p.y = height + 20;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.font = `${p.size}px serif`;
                ctx.fillText(p.char, p.x, p.y);
                ctx.restore();
            });

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }
});
