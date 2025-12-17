
// Lecture avec playlist dynamique depuis sounds.json
let currentAudio = null;
let currentButton = null;
let currentStatus = null;

async function fetchPlaylist() {
  try {
    const res = await fetch('sounds.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Impossible de charger sounds.json. Utilisation d'exemples.', e);
    return [];
  }
}

function renderPlaylist(items) {
  const container = document.getElementById('playlist');
  container.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `
      <h3>Aucun son pour l'instant</h3>
      <p>Ajoute des fichiers dans <code>sounds/</code> puis déclare-les dans <code>sounds.json</code>.</p>
      <pre style="white-space:pre-wrap;">Exemple de sounds.json:

[
  { "title": "Son 1", "file": "sounds/son1.mp3" },
  { "title": "Son 2", "file": "sounds/son2.mp3" }
]</pre>
    `;
    container.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = item.title || item.file;

    const btn = document.createElement('button');
    btn.className = 'play-btn';
    btn.setAttribute('aria-label', 'Jouer ' + (item.title || item.file));
    btn.textContent = '▶ Lecture';

    const status = document.createElement('span');
    status.className = 'status';

    btn.addEventListener('click', () => playSound(item.file, btn, status));

    card.appendChild(title);
    card.appendChild(btn);
    card.appendChild(status);

    container.appendChild(card);
  });
}

function playSound(src, button, statusEl) {
  if (currentAudio && currentButton === button) {
    if (currentAudio.paused) currentAudio.play().catch(console.error);
    else currentAudio.pause();
    updateUI();
    return;
  }
  stopCurrent();
  currentAudio = new Audio(src);
  currentAudio.preload = 'auto';
  currentButton = button;
  currentStatus = statusEl;
  currentAudio.addEventListener('playing', updateUI);
  currentAudio.addEventListener('pause', updateUI);
  currentAudio.addEventListener('ended', () => { updateUI(true); stopCurrent(); });
  currentAudio.addEventListener('error', (e) => { statusEl.textContent = 'Erreur de lecture'; console.error(e); stopCurrent(); });
  currentAudio.play().catch(err => { statusEl.textContent = 'Lecture bloquée (politique navigateur)'; console.error(err); });
  updateUI();
}

function stopCurrent() {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  if (currentButton) { currentButton.textContent = currentButton.textContent.replace('⏸', '▶'); }
  if (currentStatus) currentStatus.textContent = '';
  currentAudio = null; currentButton = null; currentStatus = null;
}

function updateUI(ended = false) {
  if (!currentButton || !currentAudio) return;
  if (ended) { currentButton.textContent = currentButton.textContent.replace('⏸', '▶'); currentStatus.textContent = 'Terminé'; return; }
  const isPlaying = !currentAudio.paused;
  currentButton.textContent = (isPlaying ? '⏸ Pause' : '▶ Lecture');
  currentStatus.textContent = isPlaying ? 'Lecture en cours…' : 'En pause';
}

// Bouton stop all
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('stopAll').addEventListener('click', stopCurrent);
});

// Charger et afficher la playlist
window.addEventListener('DOMContentLoaded', async () => {
  const items = await fetchPlaylist();
  renderPlaylist(items);
});
