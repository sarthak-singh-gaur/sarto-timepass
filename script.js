// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");
const bgAudio = document.getElementById("bg-audio");
const audioToggle = document.getElementById("audio-toggle");
const audioStatus = document.getElementById("audio-status");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope
if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.style.display = "none";
        if (bgAudio) {
            try { bgAudio.volume = 0.8; bgAudio.muted = false; } catch (e) {}
            bgAudio.play().then(() => updateAudioToggle()).catch(() => updateAudioToggle());
        }
        if (letter) letter.style.display = "flex";

        setTimeout(() => {
            document.querySelector(".letter-window")?.classList.add("open");
        }, 50);
    });
}

function updateAudioToggle() {
    if (!audioToggle || !bgAudio) return;
    if (bgAudio.paused) {
        audioToggle.textContent = "▶️";
        audioToggle.title = "Play music";
        audioToggle.setAttribute('aria-pressed', 'false');
        if (audioStatus) audioStatus.textContent = '(paused)';
    } else {
        audioToggle.textContent = "⏸️";
        audioToggle.title = "Pause music";
        audioToggle.setAttribute('aria-pressed', 'true');
        if (audioStatus) audioStatus.textContent = '(playing)';
    }
}

// Try to start playback on load (autoplay may be blocked); reflect state in toggle.
if (bgAudio) {
    try { bgAudio.volume = 0.8; bgAudio.muted = false; } catch (e) {}
    bgAudio.play().then(() => updateAudioToggle()).catch(() => updateAudioToggle());
} else if (audioStatus) {
    audioStatus.textContent = '(no audio element)';
}

// Audio diagnostic events
if (bgAudio) {
    bgAudio.addEventListener('canplay', () => { if (audioStatus) audioStatus.textContent = '(can play)'; });
    bgAudio.addEventListener('loadeddata', () => { if (audioStatus) audioStatus.textContent = '(loaded)'; });
    bgAudio.addEventListener('playing', () => { if (audioStatus) audioStatus.textContent = '(playing)'; });
    bgAudio.addEventListener('pause', () => { if (audioStatus) audioStatus.textContent = '(paused)'; });
    bgAudio.addEventListener('ended', () => { if (audioStatus) audioStatus.textContent = '(ended)'; });
    bgAudio.addEventListener('waiting', () => { if (audioStatus) audioStatus.textContent = '(waiting)'; });
    bgAudio.addEventListener('stalled', () => { if (audioStatus) audioStatus.textContent = '(stalled)'; });
    bgAudio.addEventListener('error', () => {
        const err = bgAudio.error;
        let msg = '(audio error)';
        if (err) msg += ` code:${err.code}`;
        if (audioStatus) audioStatus.textContent = msg;
        console.error('bgAudio error', err);
    });
}

if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!bgAudio) return;
        if (bgAudio.paused) {
            bgAudio.play().then(() => updateAudioToggle()).catch(() => updateAudioToggle());
        } else {
            bgAudio.pause();
            updateAudioToggle();
        }
    });
}

// Logic to move the NO btn (click moves YES)
let yesScale = 1;

if (yesBtn) {
    yesBtn.style.position = "relative";
    yesBtn.style.transformOrigin = "center center";
    yesBtn.style.transition = "transform 0.3s ease";
}

if (noBtn) {
    noBtn.addEventListener("click", () => {
        yesScale += 2;
        if (yesBtn) {
            if (yesBtn.style.position !== "fixed") {
                yesBtn.style.position = "fixed";
                yesBtn.style.top = "50%";
                yesBtn.style.left = "50%";
                yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
            } else {
                yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
            }
        }
    });
}

// YES is clicked
if (yesBtn) {
    yesBtn.addEventListener("click", () => {
        if (title) title.textContent = "Yippeeee!";
        if (catImg) catImg.src = "cat_dance.gif";
        document.querySelector(".letter-window")?.classList.add("final");
        if (buttons) buttons.style.display = "none";
        if (finalText) finalText.style.display = "block";
            // show next button at bottom
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.style.display = 'block';
    });
}

    // Next button -> show end screen
    const nextBtn = document.getElementById('next-btn');
    const endScreen = document.getElementById('end-screen');
    const endCat = document.getElementById('end-cat');
    const madeBy = document.getElementById('made-by');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // hide letter container and hearts (keep if desired)
            if (letter) letter.style.display = 'none';
            // hide next button itself
            nextBtn.style.display = 'none';
            // show end screen
            if (endScreen) endScreen.style.display = 'flex';
            // ensure audio controls are visible on the end screen (bring to front)
            const audioControls = document.getElementById('audio-controls');
            if (audioControls) {
                audioControls.style.display = 'flex';
                audioControls.style.zIndex = '10002';
            }
            // ensure end gif is loaded / plays
            if (endCat) {
                // reload src to restart gif if needed
                const src = endCat.src;
                endCat.src = '';
                endCat.src = src;
            }
            // update made-by text (already set in HTML, but ensure capitalization)
            if (madeBy) madeBy.textContent = 'made with love by sarto';
        });
    }

    // Retry button -> reset UI to starting page WITHOUT reloading audio
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            // hide end screen
            if (endScreen) endScreen.style.display = 'none';

            // show envelope (start state)
            if (envelope) envelope.style.display = 'block';

            // hide letter and reset its window state
            if (letter) letter.style.display = 'none';
            const letterWindow = document.querySelector('.letter-window');
            if (letterWindow) {
                letterWindow.classList.remove('open', 'final');
            }

            // reset content to initial values
            if (title) title.textContent = "Will you be my Valentine for today dear timepass? ";
            if (catImg) catImg.src = 'cat_sarto.gif';
            if (buttons) buttons.style.display = 'flex';
            if (finalText) finalText.style.display = 'none';

            // hide next button
            if (nextBtn) nextBtn.style.display = 'none';

            // reset YES button position/scale
            if (yesBtn) {
                yesBtn.style.position = 'relative';
                yesBtn.style.top = '';
                yesBtn.style.left = '';
                yesBtn.style.transform = '';
                yesScale = 1;
            }

            // audio: keep playing and update UI state
            if (bgAudio) {
                try { updateAudioToggle(); } catch (e) {}
            }
        });
    }

// --- Floating hearts background (creates many hearts with random size/speed) ---
(() => {
    const container = document.querySelector('.hearts-bg');
    if (!container) return;

    const HEARTS = 25;
    for (let i = 0; i < HEARTS; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerText = '❤️';

        // Random horizontal position
        heart.style.left = Math.random() * 100 + 'vw';

        // Random animation duration and staggered delay
        const dur = 4 + Math.random() * 6; // 4s - 10s
        heart.style.animationDuration = dur + 's';
        heart.style.animationDelay = (Math.random() * -dur) + 's';

        // Random size
        heart.style.fontSize = (14 + Math.random() * 30) + 'px';

        // Slight horizontal drift using transform translateX via CSS variable
        const drift = (Math.random() - 0.5) * 20; // -10 to 10 vw
        heart.style.setProperty('--drift', drift + 'vw');

        container.appendChild(heart);
    }
})();

