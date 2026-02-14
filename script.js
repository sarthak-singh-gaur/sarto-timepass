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
    bgAudio.addEventListener('suspend', () => { if (audioStatus) audioStatus.textContent = '(suspended)'; });
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
    });
}
