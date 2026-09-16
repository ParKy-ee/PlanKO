// Global States
let activeTab = 'game';
let audioContext = null;
let audioSource = null;
let analyser = null;
let audioBuffer = null;
let audioFile = null;
let isPlaying = false;
let currentSongName = "เพลงตัวอย่าง (Synthwave Beat)";
let audioDuration = 0;
let playbackTime = 0;
let lastFrameTime = 0;
let animationFrameId = null;

// Game Config & Metrics
let score = 0;
let combo = 0;
let maxCombo = 0;
let totalHits = 0;
let perfectHits = 0;
let goodHits = 0;
let okHits = 0;
let missHits = 0;
let heartRate = 137;
let heartRateInterval = null;

// Audio player elements
const audioEl = new Audio();
let audioNode = null;
let audioTrack = null;

// Beatmap Data
// Note structure: { time: seconds, buttonId: "L1" }
let beatmap = [];
let activePlayNotes = []; // Notes currently active for scoring
let hitNotesMap = new Set(); // Keep track of note indexes that were hit

// Default Beatmap for the built-in Synthesized Beat (approx. 120 BPM)
const defaultBeatmap = [
  { time: 1.0, buttonId: "L1" },
  { time: 1.5, buttonId: "R1" },
  { time: 2.0, buttonId: "L2" },
  { time: 2.5, buttonId: "R2" },
  { time: 3.0, buttonId: "L3" },
  { time: 3.0, buttonId: "R3" },
  { time: 4.0, buttonId: "L4" },
  { time: 4.5, buttonId: "R4" },
  { time: 5.0, buttonId: "L5" },
  { time: 5.5, buttonId: "R5" },
  { time: 6.0, buttonId: "L6" },
  { time: 6.0, buttonId: "R6" },
  { time: 7.0, buttonId: "L7" },
  { time: 7.5, buttonId: "R7" },
  { time: 8.0, buttonId: "L8" },
  { time: 8.5, buttonId: "R8" },
  { time: 9.5, buttonId: "L1" },
  { time: 9.5, buttonId: "R1" },
  { time: 10.0, buttonId: "L3" },
  { time: 10.0, buttonId: "R3" },
  { time: 11.0, buttonId: "L4" },
  { time: 11.5, buttonId: "R4" },
  { time: 12.0, buttonId: "L5" },
  { time: 12.5, buttonId: "R5" },
  { time: 13.0, buttonId: "L6" },
  { time: 13.5, buttonId: "R6" },
  { time: 14.0, buttonId: "L7" },
  { time: 14.5, buttonId: "R7" },
  { time: 15.0, buttonId: "L8" },
  { time: 15.5, buttonId: "R8" }
];

// Map Keyboard Keys to Board Buttons
const keyMap = {
  // Left Hand
  'q': 'L2', 'w': 'L1',
  'a': 'L5', 's': 'L4',
  'z': 'L8', 'x': 'L7',
  
  // Right Hand
  'i': 'R1', 'o': 'R2',
  'k': 'R4', 'l': 'R5',
  'm': 'R7', '.': 'R8',
  
  // Center Buttons
  'e': 'L3', 'u': 'R3',
  'd': 'L6', 'j': 'R6'
};

// WebSocket status
let socket = null;

// Initialize on window load
window.addEventListener('load', () => {
  beatmap = [...defaultBeatmap];
  updateBeatmapJSON();
  setupEventListeners();
  setupAudioVisualizer();
  startHeartRateSimulation();
  
  // Create a default synthesized audio track (sine/square pulse generator)
  createDefaultAudio();
});

// Switch between Tabs
function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  if (tabId === 'game') {
    document.querySelector('.tab-btn[onclick*="game"]').classList.add('active');
    document.getElementById('tab-game').classList.add('active');
    resetGame();
  } else if (tabId === 'editor') {
    document.querySelector('.tab-btn[onclick*="editor"]').classList.add('active');
    document.getElementById('tab-editor').classList.add('active');
    renderTimelineNotes();
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Play/Pause Button
  document.getElementById('btn-play-pause').addEventListener('click', togglePlay);
  
  // Stop Button
  document.getElementById('btn-stop').addEventListener('click', stopAudio);
  
  // Metronome Button
  document.getElementById('btn-metronome').addEventListener('click', () => {
    const btn = document.getElementById('btn-metronome');
    btn.classList.toggle('active');
    showToast(btn.classList.contains('active') ? "เปิดเครื่องให้จังหวะ (Metronome)" : "ปิดเครื่องให้จังหวะ");
  });

  // Audio File input
  document.getElementById('audio-file').addEventListener('change', handleAudioUpload);

  // Keyboard Event for game controls
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Timeline click seeking
  const timelineTrack = document.getElementById('timeline-track');
  timelineTrack.addEventListener('click', (e) => {
    if (!audioDuration) return;
    const rect = timelineTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seekAudio(percentage * audioDuration);
  });

  // Web Board Buttons Clicks (simulate sensor tap)
  document.querySelectorAll('.board-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      const buttonId = btn.getAttribute('data-id');
      triggerButtonPress(buttonId);
    });
  });

  // WS Connect Button
  document.getElementById('btn-ws-connect').addEventListener('click', toggleWSConnection);
}

// Web Audio API Synthesizer & Audio Setup
function initAudioContext() {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Connect audio element source to analyzer
    audioTrack = audioContext.createMediaElementSource(audioEl);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    audioTrack.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

// Create a synthesized default track using periodic synth loop
function createDefaultAudio() {
  // Generate a silent dummy track so audio element runs and counts time
  // This helps maintain accurate audio timeline even offline without CORS errors.
  const sampleRate = 44100;
  const duration = 30; // 30 seconds
  const numSamples = sampleRate * duration;
  const audioBufferData = new AudioContext().createBuffer(1, numSamples, sampleRate);
  
  // Put small ticking noises at each second to simulate a basic rhythm track
  const channelData = audioBufferData.getChannelData(0);
  for (let i = 0; i < numSamples; i++) {
    // Generate simple synth click sound every 0.5s (120 BPM)
    if (i % (sampleRate / 2) < 2000) {
      const angle = (i % (sampleRate / 2)) * 0.05;
      channelData[i] = Math.sin(angle) * Math.exp(-(i % (sampleRate / 2)) * 0.005);
    } else {
      channelData[i] = 0;
    }
  }

  // Turn buffer into object URL
  const wavBlob = bufferToWav(audioBufferData);
  audioEl.src = URL.createObjectURL(wavBlob);
  audioEl.load();
  audioDuration = duration;
  document.getElementById('song-duration').innerText = formatTime(duration);
  document.getElementById('editor-duration-text').innerText = duration.toFixed(2) + 's';
}

// Helper to convert audio buffer to playable wav file blob
function bufferToWav(buffer) {
  let numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArr = new ArrayBuffer(length),
      view = new DataView(bufferArr),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16);         // length = 16
  setUint16(1);          // PCM = 1
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16);         // 16-bit
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4); // chunk length

  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  return new Blob([bufferArr], { type: 'audio/wav' });
}

// Handle Custom Audio File Upload
function handleAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  initAudioContext();
  
  currentSongName = file.name;
  document.getElementById('song-name').innerText = file.name;
  
  // Set audio source
  const objectUrl = URL.createObjectURL(file);
  audioEl.src = objectUrl;
  audioEl.load();
  
  audioEl.onloadedmetadata = () => {
    audioDuration = audioEl.duration;
    document.getElementById('song-duration').innerText = formatTime(audioDuration);
    document.getElementById('editor-duration-text').innerText = audioDuration.toFixed(2) + 's';
    showToast("โหลดไฟล์เพลงสำเร็จ!");
    
    // Clear old beatmap if loading a new song, or let them keep it
    beatmap = [];
    updateBeatmapJSON();
    renderTimelineNotes();
  };
}

// Play & Pause Mechanics
function togglePlay() {
  initAudioContext();
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (isPlaying) {
    audioEl.pause();
    isPlaying = false;
    document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
    cancelAnimationFrame(animationFrameId);
  } else {
    audioEl.play().then(() => {
      isPlaying = true;
      document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-pause"></i>';
      
      // Reset active notes to play from current timestamp forward
      prepareNotesForPlay();
      
      lastFrameTime = performance.now();
      gameLoop();
    }).catch(err => {
      console.error("Audio playback error:", err);
      showToast("กรุณาเลือกไฟล์เพลงหรือเปิดใช้งานเสียงบนเบราว์เซอร์");
    });
  }
}

// Stop Audio
function stopAudio() {
  audioEl.pause();
  audioEl.currentTime = 0;
  isPlaying = false;
  document.getElementById('btn-play-pause').innerHTML = '<i class="fa-solid fa-play"></i>';
  cancelAnimationFrame(animationFrameId);
  
  playbackTime = 0;
  document.getElementById('game-time').innerText = "0:00";
  document.getElementById('editor-time').innerText = "0.00";
  document.getElementById('timeline-cursor').style.left = '0%';
  
  resetGame();
}

// Seek Audio Timeline
function seekAudio(seconds) {
  audioEl.currentTime = seconds;
  playbackTime = seconds;
  document.getElementById('game-time').innerText = formatTime(seconds);
  document.getElementById('editor-time').innerText = seconds.toFixed(2);
  
  const pct = (seconds / audioDuration) * 100;
  document.getElementById('timeline-cursor').style.left = pct + '%';
  
  // Re-sync playback notes
  prepareNotesForPlay();
}

// Reset Game scoring state
function resetGame() {
  score = 0;
  combo = 0;
  totalHits = 0;
  perfectHits = 0;
  goodHits = 0;
  okHits = 0;
  missHits = 0;
  
  document.getElementById('score-display').innerText = "00000 Point";
  document.getElementById('combo-display').style.display = 'none';
  document.getElementById('live-acc').innerText = "100%";
  
  hitNotesMap.clear();
  prepareNotesForPlay();
  
  // Reset visual board indicators
  document.querySelectorAll('.board-btn .note-indicator').forEach(ind => {
    ind.style.transform = 'scale(2.5)';
    ind.style.opacity = '0';
  });
}

// Prepare notes to display according to current timeline position
function prepareNotesForPlay() {
  // filter beatmap to find notes that haven't passed yet
  activePlayNotes = beatmap.map((note, index) => ({ ...note, originalIndex: index }));
  // clear hits for notes after current time
  hitNotesMap.forEach(index => {
    if (beatmap[index] && beatmap[index].time >= audioEl.currentTime) {
      hitNotesMap.delete(index);
    }
  });
}

// Game Loop (Updates visual notes and syncs)
function gameLoop() {
  if (!isPlaying) return;
  
  playbackTime = audioEl.currentTime;
  
  // Update HUD values
  document.getElementById('game-time').innerText = formatTime(playbackTime);
  document.getElementById('editor-time').innerText = playbackTime.toFixed(2);
  
  const pct = (playbackTime / audioDuration) * 100;
  document.getElementById('timeline-cursor').style.left = pct + '%';
  
  // Process Game Rhythm Logic
  updateRhythmNodes();
  
  // Draw Audio Visualizer
  drawVisualizer();
  
  animationFrameId = requestAnimationFrame(gameLoop);
}

// Update Expanding/Shrinking target indicators on the buttons (rhythm game display)
function updateRhythmNodes() {
  const lookAheadTime = 1.0; // Show note 1.0s before hitting
  const current = playbackTime;
  
  // Check active notes
  activePlayNotes.forEach(note => {
    const timeDiff = note.time - current;
    const btn = document.querySelector(`.board-btn[data-id="${note.buttonId}"]`);
    if (!btn) return;
    
    const indicator = btn.querySelector('.note-indicator');
    
    // Note is approaching
    if (timeDiff > 0 && timeDiff <= lookAheadTime && !hitNotesMap.has(note.originalIndex)) {
      // Scale goes from 2.5x to 1.0x
      const scale = 1.0 + (timeDiff / lookAheadTime) * 1.5;
      const opacity = 1.0 - (timeDiff / lookAheadTime);
      
      indicator.style.transform = `scale(${scale})`;
      indicator.style.opacity = opacity;
    } 
    // Exactly on hit window, keep showing full ring briefly
    else if (timeDiff <= 0 && timeDiff > -0.2 && !hitNotesMap.has(note.originalIndex)) {
      indicator.style.transform = `scale(1.0)`;
      indicator.style.opacity = 1.0;
    }
    // Note is missed (200ms passed and wasn't hit)
    else if (timeDiff <= -0.2 && !hitNotesMap.has(note.originalIndex)) {
      indicator.style.transform = `scale(2.5)`;
      indicator.style.opacity = '0';
      
      // Register Miss
      registerHit(null, note);
    }
  });
}

// Handle key down mapping to physical board
function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  if (keyMap[key]) {
    triggerButtonPress(keyMap[key]);
  }
}

// Handle key up mapping to restore button state
function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  if (keyMap[key]) {
    const btnId = keyMap[key];
    const btn = document.querySelector(`.board-btn[data-id="${btnId}"]`);
    if (btn) {
      btn.classList.remove('pressed');
      btn.classList.remove('pressed-right');
    }
  }
}

// Trigger button press (handles both scoring validation AND visual feedback)
function triggerButtonPress(buttonId) {
  const btn = document.querySelector(`.board-btn[data-id="${buttonId}"]`);
  if (!btn) return;
  
  // Highlight pressed state
  if (buttonId.startsWith('R')) {
    btn.classList.add('pressed-right');
  } else {
    btn.classList.add('pressed');
  }
  
  // Play immediate instant low-latency tap sound
  playTickSound();
  
  // Visual button animation ripple
  createButtonRipple(btn);
  
  // If active tab is game, process scoring
  if (activeTab === 'game' && isPlaying) {
    validateHit(buttonId);
  } 
  // If active tab is editor and song is playing, record beat!
  else if (activeTab === 'editor' && isPlaying) {
    recordBeat(buttonId);
  }
  
  // Auto-remove pressed class after short duration (for mouse clicks & simulated sensors)
  setTimeout(() => {
    btn.classList.remove('pressed');
    btn.classList.remove('pressed-right');
  }, 150);
}

// Metronome Synth sound generator using Web Audio API oscillator (zero latency!)
function playTickSound() {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  // Retro synth clap/pop sound
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(250, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.15);
}

// Create a visual ripple animation inside button
function createButtonRipple(btn) {
  const ripple = document.createElement('div');
  ripple.style.position = 'absolute';
  ripple.style.width = '100%';
  ripple.style.height = '100%';
  ripple.style.borderRadius = '50%';
  ripple.style.border = '2px solid var(--neon-cyan)';
  ripple.style.top = '0';
  ripple.style.left = '0';
  ripple.style.pointerEvents = 'none';
  ripple.style.animation = 'float-up-fade 0.3s ease-out forwards';
  
  if (btn.classList.contains('right-side')) {
    ripple.style.borderColor = 'var(--neon-pink)';
  } else if (btn.classList.contains('mid-side')) {
    ripple.style.borderColor = 'var(--neon-yellow)';
  }
  
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 400);
}

// Validate note hitting based on timestamp comparison
function validateHit(buttonId) {
  const current = playbackTime;
  
  // Find matching notes for this button around the current timestamp
  let bestNote = null;
  let minDiff = 999.0;
  
  activePlayNotes.forEach(note => {
    if (note.buttonId === buttonId && !hitNotesMap.has(note.originalIndex)) {
      const diff = Math.abs(note.time - current);
      if (diff < minDiff && diff < 0.4) { // 400ms hit threshold window
        minDiff = diff;
        bestNote = note;
      }
    }
  });
  
  if (bestNote) {
    registerHit(minDiff, bestNote);
  }
}

// Register hit result, update scoring values & spawn floating text
function registerHit(diff, note) {
  const btn = document.querySelector(`.board-btn[data-id="${note.buttonId}"]`);
  let rating = "MISS";
  let points = 0;
  
  // Hide active ring instantly
  if (btn) {
    const indicator = btn.querySelector('.note-indicator');
    indicator.style.transform = 'scale(2.5)';
    indicator.style.opacity = '0';
  }

  // Determine hit score based on latency difference
  if (diff !== null) {
    hitNotesMap.add(note.originalIndex);
    
    if (diff <= 0.08) {
      rating = "PERFECT";
      points = 100;
      perfectHits++;
      combo++;
    } else if (diff <= 0.18) {
      rating = "GOOD";
      points = 50;
      goodHits++;
      combo++;
    } else if (diff <= 0.32) {
      rating = "OK";
      points = 20;
      okHits++;
      combo++;
    } else {
      rating = "MISS";
      points = 0;
      missHits++;
      combo = 0;
    }
  } else {
    // Passed miss note
    hitNotesMap.add(note.originalIndex);
    rating = "MISS";
    points = 0;
    missHits++;
    combo = 0;
  }
  
  // Update combo / high combo metrics
  if (combo > maxCombo) maxCombo = combo;
  totalHits++;
  score += points;
  
  // Update GUI
  document.getElementById('score-display').innerText = score.toString().padStart(5, '0') + " Point";
  
  const comboDisplay = document.getElementById('combo-display');
  if (combo > 0) {
    comboDisplay.innerText = `Combo ${combo}x`;
    comboDisplay.style.display = 'block';
    // Trigger pop micro-animation
    comboDisplay.style.animation = 'none';
    comboDisplay.offsetHeight; // trigger reflow
    comboDisplay.style.animation = null;
  } else {
    comboDisplay.style.display = 'none';
  }
  
  // Calculate accuracy percentage
  const totalPossible = totalHits * 100;
  const currentActual = (perfectHits * 100) + (goodHits * 50) + (okHits * 20);
  const accuracy = totalPossible > 0 ? Math.round((currentActual / totalPossible) * 100) : 100;
  document.getElementById('live-acc').innerText = accuracy + '%';
  
  // Spawn Floating hit feedback on the button
  if (btn) {
    const floating = document.createElement('div');
    floating.className = `hit-rating rating-${rating.toLowerCase()}`;
    floating.innerText = rating;
    floating.style.left = '50%';
    floating.style.top = '50%';
    floating.style.transform = 'translate(-50%, -50%)';
    btn.appendChild(floating);
    
    setTimeout(() => floating.remove(), 500);
  }
}

// Record Beat in Editor Mode
function recordBeat(buttonId) {
  const noteTime = parseFloat(playbackTime.toFixed(2));
  
  // Add note
  beatmap.push({ time: noteTime, buttonId: buttonId });
  
  // Sort beatmap chronological order
  beatmap.sort((a, b) => a.time - b.time);
  
  updateBeatmapJSON();
  renderTimelineNotes();
}

// Render beat notes in Timeline track (editor tab)
function renderTimelineNotes() {
  const track = document.getElementById('timeline-track');
  
  // Clear existing notes (preserve cursor)
  const notes = track.querySelectorAll('.timeline-note');
  notes.forEach(n => n.remove());
  
  document.getElementById('editor-note-count').innerText = beatmap.length;
  
  if (!audioDuration) return;
  
  // Render each beatmap note visually
  beatmap.forEach((note, index) => {
    const pct = (note.time / audioDuration) * 100;
    
    const noteEl = document.createElement('div');
    noteEl.className = 'timeline-note';
    noteEl.style.left = pct + '%';
    
    // Color coding matching side
    if (note.buttonId.startsWith('L') && note.buttonId !== 'L3' && note.buttonId !== 'L6') {
      noteEl.classList.add('left-note');
    } else if (note.buttonId.startsWith('R') && note.buttonId !== 'R3' && note.buttonId !== 'R6') {
      noteEl.classList.add('right-note');
    } else {
      noteEl.classList.add('mid-note');
    }
    
    noteEl.title = `วินาทีที่ ${note.time} [ปุ่ม ${note.buttonId}] - ดับเบิ้ลคลิกเพื่อลบ`;
    
    // Double click to remove note
    noteEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      deleteNoteIndex(index);
    });
    
    track.appendChild(noteEl);
  });
}

// Delete Note at Index
function deleteNoteIndex(index) {
  beatmap.splice(index, 1);
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast("ลบโน้ตที่เลือกเรียบร้อย");
}

// Update JSON display textbox
function updateBeatmapJSON() {
  const textbox = document.getElementById('beatmap-json-output');
  textbox.value = JSON.stringify(beatmap, null, 2);
}

// Clear all beatmaps
function clearBeatmap() {
  beatmap = [];
  updateBeatmapJSON();
  renderTimelineNotes();
  resetGame();
  showToast("ล้างข้อมูลโน้ตทั้งหมดเรียบร้อย!");
}

// Delete last note in the beatmap (Undo)
function deleteLastNote() {
  if (beatmap.length > 0) {
    const removed = beatmap.pop();
    updateBeatmapJSON();
    renderTimelineNotes();
    showToast(`ลบโน้ตล่าสุด (${removed.buttonId} ที่ ${removed.time}s) เรียบร้อย`);
  } else {
    showToast("ไม่มีโน้ตให้ลบ");
  }
}

// Copy JSON Output to Clipboard
function copyBeatmapJSON() {
  const textbox = document.getElementById('beatmap-json-output');
  textbox.select();
  document.execCommand('copy');
  showToast("คัดลอก JSON ไปยังบอร์ดคลิปบอร์ดแล้ว!");
}

// Import Custom JSON Beatmap
function importBeatmapJSON() {
  const val = document.getElementById('beatmap-json-input').value.trim();
  if (!val) {
    showToast("โปรดวางข้อมูล JSON ก่อนนำเข้า");
    return;
  }
  
  try {
    const parsed = JSON.parse(val);
    if (!Array.isArray(parsed)) throw new Error("ข้อมูลต้องเป็น Array ของ Notes");
    
    // Basic verification
    const isValid = parsed.every(n => typeof n.time === 'number' && typeof n.buttonId === 'string');
    if (!isValid) throw new Error("ฟอร์แมตโน้ตไม่ถูกต้อง (ต้องมี time และ buttonId)");
    
    beatmap = parsed;
    // Sort
    beatmap.sort((a, b) => a.time - b.time);
    
    updateBeatmapJSON();
    renderTimelineNotes();
    resetGame();
    
    showToast("นำเข้าด่านสำเร็จ!");
    document.getElementById('beatmap-json-input').value = "";
  } catch (err) {
    alert("ไม่สามารถนำเข้าได้: " + err.message);
  }
}

// Helper: Show notification toast
function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  toast.innerText = msg;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Format seconds into MM:SS format
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return mins + ":" + secs.toString().padStart(2, '0');
}

// Audio frequency visualizer drawing on canvas background
function setupAudioVisualizer() {
  const canvas = document.getElementById('canvas-visualizer');
  const ctx = canvas.getContext('2d');
  
  // Resize canvas
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function drawVisualizer() {
  const canvas = document.getElementById('canvas-visualizer');
  const ctx = canvas.getContext('2d');
  if (!ctx || !analyser) return;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;
  
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 0.75;
    
    // Neon purple/cyan gradient
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 0, 127, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
    
    x += barWidth;
  }
}

// Simulated Heart Rate fluctuation
function startHeartRateSimulation() {
  if (heartRateInterval) clearInterval(heartRateInterval);
  
  heartRateInterval = setInterval(() => {
    // Add small random variation to heart rate
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    heartRate = Math.max(125, Math.min(150, heartRate + change));
    
    document.getElementById('live-hr').innerText = heartRate + ' bpm';
  }, 2000);
}

// Simulate sensor trigger from the backend panel
function simulateSensorTrigger(buttonId) {
  triggerButtonPress(buttonId);
}

// WebSocket Integration for REAL Board Sensors
function toggleWSConnection() {
  const btn = document.getElementById('btn-ws-connect');
  const url = document.getElementById('ws-url').value.trim();
  const statusBadge = document.getElementById('ws-status');
  
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    // Disconnect
    socket.close();
    return;
  }
  
  btn.innerText = "กำลังเชื่อมต่อ...";
  btn.style.opacity = '0.7';
  
  try {
    socket = new WebSocket(url);
    
    socket.onopen = () => {
      btn.innerText = "ตัดการเชื่อมต่อ WS";
      btn.style.opacity = '1';
      btn.style.background = 'linear-gradient(135deg, var(--neon-pink), #ff0055)';
      btn.style.color = '#fff';
      
      statusBadge.innerText = "Sensor Connected";
      statusBadge.classList.add('connected');
      showToast("เชื่อมต่อ WebSocket สำเร็จ!");
    };
    
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("WebSocket Sensor Received:", payload);
        
        // Supposing the payload structure sends sensor triggers, e.g.:
        // { event: 'sensor-press', data: { sensorId: 'L1' } }
        // or simple flat structure: { sensorId: 'L1' }
        let sensorId = null;
        if (payload.sensorId) {
          sensorId = payload.sensorId;
        } else if (payload.data && payload.data.sensorId) {
          sensorId = payload.data.sensorId;
        } else if (payload.id) { // support other schemas
          sensorId = payload.id;
        }
        
        if (sensorId) {
          // Trigger matching board action!
          triggerButtonPress(sensorId);
        }
      } catch (err) {
        console.warn("WebSocket data is not valid JSON:", event.data);
      }
    };
    
    socket.onclose = () => {
      resetWSButtonState();
      statusBadge.innerText = "Sensor Offline";
      statusBadge.classList.remove('connected');
      showToast("ตัดการเชื่อมต่อ WebSocket");
    };
    
    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      resetWSButtonState();
      showToast("เชื่อมต่อ WebSocket ล้มเหลว!");
    };
    
  } catch (err) {
    console.error("WS Connection Init Error:", err);
    resetWSButtonState();
  }
}

function resetWSButtonState() {
  const btn = document.getElementById('btn-ws-connect');
  btn.innerText = "เชื่อมต่อ WS";
  btn.style.opacity = '1';
  btn.style.background = 'linear-gradient(135deg, var(--neon-cyan), #0072ff)';
  btn.style.color = '#000';
  socket = null;
}
