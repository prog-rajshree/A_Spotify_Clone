console.log("Welcome to Spotify — Mood Theme + Journey Map 🗺️");

// ── Song Data with Mood ─────────────────────────────────
const songs = [
    { songName: "Warriyo - Mortals [NCS Release]",               filePath: "songs/1.mp3",  coverPath: "covers/1.jpg",  mood: "energetic" },
    { songName: "Cielo - Huma-Huma",                             filePath: "songs/2.mp3",  coverPath: "covers/2.jpg",  mood: "happy"     },
    { songName: "DEAF KEV - Invincible [NCS Release]",           filePath: "songs/3.mp3",  coverPath: "covers/3.jpg",  mood: "energetic" },
    { songName: "Different Heaven & EH!DE - My Heart",           filePath: "songs/4.mp3",  coverPath: "covers/4.jpg",  mood: "happy"     },
    { songName: "Janji - Heroes Tonight feat. Johnning",         filePath: "songs/5.mp3",  coverPath: "covers/5.jpg",  mood: "energetic" },
    { songName: "Rabba - Salam-e-Ishq",                         filePath: "songs/6.mp3",  coverPath: "covers/6.jpg",  mood: "sad"       },
    { songName: "Sakhiyaan - Salam-e-Ishq",                     filePath: "songs/7.mp3",  coverPath: "covers/7.jpg",  mood: "sad"       },
    { songName: "Bhula Dena - Salam-e-Ishq",                    filePath: "songs/8.mp3",  coverPath: "covers/8.jpg",  mood: "sad"       },
    { songName: "Tumhari Kasam - Salam-e-Ishq",                 filePath: "songs/9.mp3",  coverPath: "covers/9.jpg",  mood: "night"     },
    { songName: "Na Jaana - Salam-e-Ishq",                      filePath: "songs/10.mp3", coverPath: "covers/10.jpg", mood: "night"     },
];

// ── Mood Config ─────────────────────────────────────────
const moodConfig = {
    happy:     { label: "😊 Happy",     emoji: "😊" },
    sad:       { label: "😔 Sad",       emoji: "😔" },
    night:     { label: "🌙 Night",     emoji: "🌙" },
    energetic: { label: "⚡ Energetic", emoji: "⚡" },
};

// ── State ────────────────────────────────────────────────
let songIndex    = 0;
let currentMood  = null;
let audioElement = new Audio(songs[0].filePath);

// Journey: array of { songName, coverPath, mood, time }
let journeyLog   = [];

// ── DOM Refs ─────────────────────────────────────────────
const masterPlay     = document.getElementById('masterPlay');
const myProgressBar  = document.getElementById('myProgressBar');
const gif            = document.getElementById('gif');
const masterSongName = document.getElementById('masterSongName');
const moodBadge      = document.getElementById('moodBadge');
const themeFlash     = document.getElementById('themeFlash');
const songItemsEl    = Array.from(document.getElementsByClassName('songItem'));
const journeyPanel   = document.getElementById('journeyPanel');
const journeyList    = document.getElementById('journeyList');
const journeyToggle  = document.getElementById('journeyToggle');
const journeyCount   = document.getElementById('journeyCount');
const clearJourney   = document.getElementById('clearJourney');

// ── Render Song List ─────────────────────────────────────
songItemsEl.forEach((el, i) => {
    el.getElementsByTagName('img')[0].src = songs[i].coverPath;
    el.getElementsByClassName('songName')[0].innerText = songs[i].songName;
    const cfg = moodConfig[songs[i].mood];
    const tag = el.querySelector('.moodTag');
    if (tag) tag.textContent = cfg.emoji + ' ' + songs[i].mood;
});

// ── Apply Mood Theme ─────────────────────────────────────
function applyMood(mood) {
    if (mood === currentMood) return;
    document.body.classList.remove('mood-happy', 'mood-sad', 'mood-night', 'mood-energetic');
    document.body.classList.add('mood-' + mood);

    themeFlash.style.background = getComputedStyle(document.body).getPropertyValue('--mood-accent');
    themeFlash.classList.remove('flash');
    void themeFlash.offsetWidth;
    themeFlash.classList.add('flash');

    const cfg = moodConfig[mood];
    moodBadge.textContent = cfg.label;
    moodBadge.style.display = 'inline-block';
    currentMood = mood;
}

// ── Journey Map ──────────────────────────────────────────
function addToJourney(song) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Don't duplicate back-to-back same song
    if (journeyLog.length > 0 && journeyLog[journeyLog.length - 1].songName === song.songName) return;

    journeyLog.push({ ...song, time });
    renderJourney();
}

function renderJourney() {
    journeyCount.textContent = journeyLog.length;

    if (journeyLog.length === 0) {
        journeyList.innerHTML = `
            <div class="journey-empty">
                <span>🎵</span>
                <p>Play a song to start your journey</p>
            </div>`;
        return;
    }

    journeyList.innerHTML = journeyLog.map((entry, i) => {
        const isFirst  = i === 0;
        const isLast   = i === journeyLog.length - 1;
        const cfg      = moodConfig[entry.mood];
        return `
            <div class="journey-node ${isLast ? 'journey-node--active' : ''}">
                ${isFirst ? `<div class="journey-start-label">START</div>` : ''}
                <div class="journey-connector">
                    <div class="journey-dot mood-dot-${entry.mood}"></div>
                    ${!isLast ? `<div class="journey-line"></div>` : ''}
                </div>
                <div class="journey-card mood-card-${entry.mood}">
                    <img src="${entry.coverPath}" alt="cover" class="journey-cover">
                    <div class="journey-info">
                        <span class="journey-song-name">${entry.songName}</span>
                        <span class="journey-meta">${cfg.emoji} ${entry.mood} · ${entry.time}</span>
                    </div>
                    ${isLast ? `<span class="journey-now-badge">NOW</span>` : ''}
                </div>
            </div>`;
    }).join('');

    // Auto-scroll to bottom (latest song)
    journeyList.scrollTop = journeyList.scrollHeight;
}

// Toggle panel open/close
journeyToggle.addEventListener('click', () => {
    journeyPanel.classList.toggle('open');
    journeyToggle.textContent = journeyPanel.classList.contains('open') ? '✕ Close Map' : '🗺️ My Journey';
});

clearJourney.addEventListener('click', () => {
    journeyLog = [];
    renderJourney();
    journeyCount.textContent = 0;
});

// ── Highlight active song row ────────────────────────────
function highlightActiveSong(index) {
    songItemsEl.forEach((el, i) => el.classList.toggle('playing', i === index));
}

// ── Play a song by index ─────────────────────────────────
function playSong(index) {
    songIndex = index;
    const song = songs[index];

    audioElement.src = song.filePath;
    audioElement.currentTime = 0;
    audioElement.play();

    masterSongName.innerHTML = `<span class="nowPlayingDot"></span>${song.songName}`;
    gif.style.opacity = 1;
    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');

    highlightActiveSong(index);
    applyMood(song.mood);
    makeAllPlays();

    const icons = document.getElementsByClassName('songItemPlay');
    if (icons[index]) icons[index].classList.replace('fa-play-circle', 'fa-pause-circle');

    // ← Add to journey map
    addToJourney(song);
}

// ── Master play/pause ────────────────────────────────────
masterPlay.addEventListener('click', () => {
    if (audioElement.paused) {
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        gif.style.opacity = 0;
    }
});

// ── Progress bar sync ────────────────────────────────────
audioElement.addEventListener('timeupdate', () => {
    const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = isNaN(progress) ? 0 : progress;
});

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// ── Auto-play next ───────────────────────────────────────
audioElement.addEventListener('ended', () => {
    playSong((songIndex + 1) % songs.length);
});

// ── Reset all item play icons ────────────────────────────
function makeAllPlays() {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach(el => {
        el.classList.replace('fa-pause-circle', 'fa-play-circle');
    });
}

// ── Per-song play buttons ────────────────────────────────
Array.from(document.getElementsByClassName('songItemPlay')).forEach((el) => {
    el.addEventListener('click', (e) => {
        const index = parseInt(e.target.id);
        if (songIndex === index && !audioElement.paused) {
            audioElement.pause();
            masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
            gif.style.opacity = 0;
            e.target.classList.replace('fa-pause-circle', 'fa-play-circle');
        } else {
            playSong(index);
        }
    });
});

// ── Next / Previous ──────────────────────────────────────
document.getElementById('next').addEventListener('click', () => {
    playSong((songIndex + 1) % songs.length);
});

document.getElementById('previous').addEventListener('click', () => {
    playSong((songIndex - 1 + songs.length) % songs.length);
});

// Init empty journey
renderJourney();
