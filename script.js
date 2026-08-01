// Elements Setup
const envelopeContainer = document.getElementById("envelope-container");
const mainApp = document.getElementById("main-app");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");
const bgAudio = document.getElementById("bg-audio");
const audioToggle = document.getElementById("audio-toggle");
const audioNext = document.getElementById("audio-next");
const audioPrev = document.getElementById("audio-prev");
const songTitle = document.getElementById("song-title");
const audioStatus = document.getElementById("audio-status");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const nextBtn = document.getElementById("next-btn");

// Playlist with track names
const playlist = [
  { src: 'song.wav', title: '🎶 Track 1 - Cozy Serenade' },
  { src: 'song2.wav', title: '🎶 Track 2 - Sweet Romance' },
  { src: 'song3.wav', title: '🎶 Track 3 - Mogu & Baigan' },
  { src: 'song4.wav', title: '🎶 Track 4 - Forever Together' }
];

let currentSongIndex = Math.floor(Math.random() * playlist.length);

// Typewriter effect function
function typewriterEffect(element, text, speed = 40) {
  return new Promise((resolve) => {
    element.textContent = '';
    let index = 0;
    
    function typeChar() {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        setTimeout(typeChar, speed);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

// Open Envelope -> Show Main Experience
if (envelopeContainer) {
  envelopeContainer.addEventListener("click", () => {
    envelopeContainer.classList.remove("active-screen");
    envelopeContainer.classList.add("hidden-screen");
    
    if (mainApp) {
      mainApp.classList.remove("hidden-screen");
    }

    if (bgAudio) {
      bgAudio.volume = 0.85;
      bgAudio.play().then(() => updateAudioToggle()).catch(() => updateAudioToggle());
    }
  });
}

// Navigation Tabs Switching
const navTabs = document.querySelectorAll(".nav-tab");
const appSections = document.querySelectorAll(".app-section");

navTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetId = tab.getAttribute("data-target");

    navTabs.forEach(t => t.classList.remove("active"));
    appSections.forEach(s => s.classList.remove("active-section"));

    tab.classList.add("active");
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add("active-section");
    }
  });
});

// Audio Playlist Manager
function updateAudioToggle() {
  if (!audioToggle || !bgAudio) return;
  
  if (songTitle && playlist[currentSongIndex]) {
    songTitle.textContent = playlist[currentSongIndex].title;
  }

  if (bgAudio.paused) {
    audioToggle.textContent = "▶️";
    if (audioStatus) audioStatus.textContent = "(paused)";
  } else {
    audioToggle.textContent = "⏸️";
    if (audioStatus) audioStatus.textContent = "(playing)";
  }
}

function changeSong(index) {
  if (index < 0) currentSongIndex = playlist.length - 1;
  else if (index >= playlist.length) currentSongIndex = 0;
  else currentSongIndex = index;
  
  if (bgAudio) {
    bgAudio.src = playlist[currentSongIndex].src;
    bgAudio.load();
    bgAudio.play().then(() => updateAudioToggle()).catch(() => updateAudioToggle());
  }
}

if (bgAudio) {
  bgAudio.src = playlist[currentSongIndex].src;
  updateAudioToggle();
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

if (audioNext) {
  audioNext.addEventListener('click', (e) => {
    e.stopPropagation();
    changeSong(currentSongIndex + 1);
  });
}

if (audioPrev) {
  audioPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    changeSong(currentSongIndex - 1);
  });
}

// Playful YES / NO Button Mechanics
let yesScale = 1;

if (yesBtn) {
  yesBtn.style.transition = "transform 0.25s ease";
}

if (noBtn) {
  const moveNoBtn = () => {
    yesScale += 0.4;
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Move NO button randomly
    const wrapper = document.querySelector(".buttons");
    if (wrapper) {
      const randomX = (Math.random() - 0.5) * 160;
      const randomY = (Math.random() - 0.5) * 80;
      noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }
  };

  noBtn.addEventListener("mouseenter", moveNoBtn);
  noBtn.addEventListener("click", moveNoBtn);
}

// YES Button Clicked -> Celebration Confetti
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    if (title) title.textContent = "YIPPEEE! Mogu Baby Said YES! 🎉💖";
    if (catImg) catImg.src = "cat_dance.gif";
    if (buttons) buttons.style.display = "none";

    if (finalText) {
      finalText.style.display = "block";
    }

    if (nextBtn) {
      nextBtn.style.display = "inline-block";
    }

    triggerConfetti();
  });
}

// Confetti Effect
function triggerConfetti() {
  const colors = ['#ff758c', '#ff4d6d', '#ffd166', '#ffffff', '#8b249e'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = (Math.random() * 8 + 6) + 'px';
    confetti.style.height = (Math.random() * 12 + 8) + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '3px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '99999';
    confetti.style.opacity = '0.9';
    
    const fallDuration = 2 + Math.random() * 2.5;
    confetti.style.transition = `transform ${fallDuration}s linear, opacity ${fallDuration}s ease`;
    
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translate3d(${(Math.random() - 0.5) * 300}px, 105vh, 0) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    }, 20);

    setTimeout(() => confetti.remove(), fallDuration * 1000 + 100);
  }
}

// Next Button -> Go to End Screen
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    const endScreen = document.getElementById('end-screen');
    if (endScreen) {
      endScreen.style.display = 'flex';
    }
  });
}

// Retry / Replay Button
const retryBtn = document.getElementById('retry-btn');
if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    location.reload();
  });
}

// Interactive Card Flips
const flipCards = document.querySelectorAll(".flip-card");
flipCards.forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

// Lightweight Floating Baigan & Heart Background Generator
(() => {
  const container = document.querySelector('.hearts-bg');
  if (!container) return;

  const textEmojis = ['💖', '🍆', '✨', '💕', '🥰', '💜'];
  const count = 10; // Optimized count for 60fps performance

  for (let i = 0; i < count; i++) {
    const isImage = i % 2 === 0;
    const el = document.createElement(isImage ? 'img' : 'span');
    el.className = 'floating-item';

    if (isImage) {
      el.src = 'cat_heart.gif';
      el.alt = 'Floating Heart Cat';
      el.style.width = (35 + Math.random() * 40) + 'px';
      el.style.height = 'auto';
    } else {
      el.textContent = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      el.style.fontSize = (18 + Math.random() * 20) + 'px';
    }

    el.style.left = Math.random() * 100 + 'vw';
    const duration = 7 + Math.random() * 7;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = (Math.random() * -duration) + 's';

    container.appendChild(el);
  }
})();

// Throttled Particle Trail Effect (Max 1 particle per 150ms for buttery performance)
let lastParticleTime = 0;
const createTrailParticle = (x, y) => {
  const now = Date.now();
  if (now - lastParticleTime < 150) return;
  lastParticleTime = now;
  
  const particle = document.createElement("span");
  particle.textContent = Math.random() > 0.5 ? "💖" : "🍆";
  particle.style.position = "fixed";
  particle.style.left = (x - 8) + "px";
  particle.style.top = (y - 8) + "px";
  particle.style.fontSize = "14px";
  particle.style.pointerEvents = "none";
  particle.style.zIndex = "99999";
  particle.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
  particle.style.opacity = "0.85";

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.style.transform = `translate3d(${(Math.random() - 0.5) * 20}px, -35px, 0) scale(0.5)`;
    particle.style.opacity = "0";
  }, 20);

  setTimeout(() => particle.remove(), 700);
};

document.addEventListener("mousemove", (e) => createTrailParticle(e.clientX, e.clientY));
document.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches[0]) {
    createTrailParticle(e.touches[0].clientX, e.touches[0].clientY);
  }
});
