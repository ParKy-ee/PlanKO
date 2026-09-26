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

// Content Studio project state. The browser file itself is kept in memory;
// the exported JSON stores the portable asset path that Expo can bundle.
let activeLevelIndex = 0;
let gameProject = null;
const levelAudioFiles = new Map();
const levelAudioUrls = new Map();

// Optional local content loaded when this mock is opened from the project root.
// Keep the paths relative so the page also works from a local HTTP server.
const LOCAL_GAME_JSON_URL = '../moc-api/planko-neon-sessions%20(1)%20(1).json';
const LOCAL_SPARKS_AUDIO_URL = '../Sparks.mp3';

// Fast beat placement state for the editor.
let selectedBeatButton = null;
let noteSnapMode = 'free';
let timelineRangeStart = null;
let timelineRangeEnd = null;
let isDraggingTimeline = false;
let timelineDragStartX = 0;
let timelineDragMoved = false;
let suppressTimelineClick = false;
let selectedNoteIndex = null;

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

function createInitialGameProject() {
  return {
    schemaVersion: "1.0",
    type: "planKo.game",
    id: "planko-neon-sessions",
    title: "PlanKO Neon Sessions",
    description: "Rhythm plank training levels for PlanKO.",
    version: 1,
    levels: [
      {
        id: "level-01-neon-warmup",
        title: "Neon Warmup",
        difficulty: "normal",
        bpm: 120,
        description: "ฝึกจังหวะพื้นฐานก่อนเข้าสู่ด่านจริง",
        audio: {
          fileName: "synthwave-beat.wav",
          mimeType: "audio/wav",
          duration: 30,
          uri: "assets/audio/synthwave-beat.wav"
        },
        beatmap: defaultBeatmap.map((note, index) => ({
          id: index + 1,
          ...note
        }))
      }
    ]
  };
}

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
  gameProject = createInitialGameProject();
  beatmap = [...defaultBeatmap];
  updateBeatmapJSON();
  setupEventListeners();
  setupStudioListeners();
  renderStudio();
  setupAudioVisualizer();
  startHeartRateSimulation();
  
  // Create a default synthesized audio track (sine/square pulse generator)
  createDefaultAudio();

  // Load the supplied game JSON and Sparks track when available.
  loadLocalGameProject();
});

// Switch between Tabs
function switchTab(tabId) {
  activeTab = tabId;
  document.body.classList.toggle('editor-mode', tabId === 'editor');
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  if (tabId === 'game') {
    document.querySelector('.tab-btn[onclick*="game"]').classList.add('active');
    document.getElementById('tab-game').classList.add('active');
    resetGame();
  } else if (tabId === 'editor') {
    document.querySelector('.tab-btn[onclick*="editor"]').classList.add('active');
    document.getElementById('tab-editor').classList.add('active');
    renderStudio();
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
  document.getElementById('audio-file').addEventListener('change', handleStudioAudioUpload);
  document.getElementById('level-audio-file').addEventListener('change', handleLinkedLevelAudioUpload);
  document.getElementById('game-json-file').addEventListener('change', handleGameJsonFileUpload);

  // Keyboard Event for game controls
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Timeline click/drag placement and seeking
  setupTimelinePlacement();

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

// Content Studio controls: project metadata, level management and JSON export.
function setupStudioListeners() {
  const projectFields = [
    ['game-title-input', 'title'],
    ['game-slug-input', 'id'],
    ['game-description-input', 'description']
  ];

  projectFields.forEach(([elementId, projectKey]) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.addEventListener('input', () => {
      if (!gameProject) return;
      gameProject[projectKey] = element.value;
      if (projectKey === 'title' && !document.getElementById('game-slug-input').dataset.userEdited) {
        document.getElementById('game-slug-input').value = slugify(element.value);
        gameProject.id = document.getElementById('game-slug-input').value;
      }
      renderProjectJSONPreview();
    });
  });

  const levelFields = [
    ['level-title-input', 'title'],
    ['level-difficulty-input', 'difficulty'],
    ['level-bpm-input', 'bpm'],
    ['level-description-input', 'description']
  ];

  levelFields.forEach(([elementId, levelKey]) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.addEventListener('input', () => updateActiveLevelField(levelKey, element.value));
    element.addEventListener('change', () => updateActiveLevelField(levelKey, element.value));
  });

  const slugInput = document.getElementById('game-slug-input');
  slugInput.addEventListener('input', () => {
    slugInput.dataset.userEdited = 'true';
  });

  document.getElementById('btn-add-level').addEventListener('click', addLevel);
  document.getElementById('btn-new-project').addEventListener('click', createNewProject);
  document.getElementById('btn-export-game').addEventListener('click', downloadGameJSON);
  document.getElementById('btn-download-game-json').addEventListener('click', downloadGameJSON);
  document.getElementById('btn-copy-game-json').addEventListener('click', copyGameJSON);
  document.getElementById('btn-api-save-game').addEventListener('click', saveGameToMockApi);
  document.getElementById('btn-api-load-game').addEventListener('click', loadGameFromMockApi);

  document.getElementById('note-snap-select').addEventListener('change', (event) => {
    noteSnapMode = event.target.value;
    updateTimelineBuilderUI();
  });
  document.getElementById('range-step-input').addEventListener('input', updateTimelineBuilderUI);
  document.getElementById('btn-add-range').addEventListener('click', addNotesInSelectedRange);
  document.getElementById('btn-delete-range').addEventListener('click', deleteNotesInSelectedRange);
  document.getElementById('btn-add-current-time').addEventListener('click', addNoteAtCurrentTime);
  document.getElementById('btn-clear-range').addEventListener('click', clearTimelineRange);
  document.getElementById('btn-delete-selected-note').addEventListener('click', deleteSelectedNote);
  document.getElementById('btn-editor-play-pause').addEventListener('click', togglePlay);
  document.getElementById('btn-editor-stop').addEventListener('click', stopAudio);

  // Keep the beat builder in the same visual zone as the Timeline.
  const timelineBuilderMount = document.getElementById('timeline-builder-mount');
  const noteBuilder = document.querySelector('.editor-sidebar .note-builder');
  if (timelineBuilderMount && noteBuilder) {
    timelineBuilderMount.appendChild(noteBuilder);
  }

  renderBeatPalette();
}

const editorPadIds = [
  'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8',
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'
];

function renderBeatPalette() {
  const palette = document.getElementById('pad-palette');
  if (!palette) return;

  palette.innerHTML = editorPadIds.map((buttonId) => {
    const isMid = ['L3', 'L6', 'R3', 'R6'].includes(buttonId);
    const sideClass = isMid ? 'mid-choice' : buttonId.startsWith('L') ? 'left-choice' : 'right-choice';
    return `<button type="button" class="pad-choice ${sideClass}" data-pad-id="${buttonId}">${buttonId}</button>`;
  }).join('');

  palette.querySelectorAll('[data-pad-id]').forEach((button) => {
    button.addEventListener('click', () => selectBeatButton(button.dataset.padId));
  });
}

function selectBeatButton(buttonId) {
  if (!buttonId) return;
  selectedBeatButton = buttonId;

  document.querySelectorAll('.pad-choice').forEach((button) => {
    button.classList.toggle('active', button.dataset.padId === buttonId);
  });

  const label = document.getElementById('selected-pad-label');
  if (label) label.innerText = `เลือก ${buttonId}`;

  const track = document.getElementById('timeline-track');
  if (track) track.classList.add('note-entry-mode');
  updateTimelineBuilderUI();
}

function setupTimelinePlacement() {
  const track = document.getElementById('timeline-track');
  if (!track) return;

  track.addEventListener('click', handleTimelineClick);
  track.addEventListener('mousedown', beginTimelineDrag);
  window.addEventListener('mousemove', updateTimelineDrag);
  window.addEventListener('mouseup', finishTimelineDrag);
}

function timelineTimeFromClientX(clientX) {
  const track = document.getElementById('timeline-track');
  if (!track || !audioDuration) return 0;
  const rect = track.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return ratio * audioDuration;
}

function beginTimelineDrag(event) {
  if (event.button !== 0 || !audioDuration || event.target.closest('.timeline-note')) return;
  isDraggingTimeline = true;
  timelineDragStartX = event.clientX;
  timelineDragMoved = false;
}

function updateTimelineDrag(event) {
  if (!isDraggingTimeline) return;
  if (Math.abs(event.clientX - timelineDragStartX) < 5 && !timelineDragMoved) return;

  timelineDragMoved = true;
  const start = timelineTimeFromClientX(timelineDragStartX);
  const end = timelineTimeFromClientX(event.clientX);
  setTimelineRange(start, end);
}

function finishTimelineDrag() {
  if (!isDraggingTimeline) return;
  isDraggingTimeline = false;

  if (timelineDragMoved) {
    suppressTimelineClick = true;
    updateTimelineBuilderUI();
  }
}

function handleTimelineClick(event) {
  if (!audioDuration) return;
  if (event.target.closest('.timeline-note')) return;
  if (suppressTimelineClick) {
    suppressTimelineClick = false;
    return;
  }

  const time = snapTimelineTime(timelineTimeFromClientX(event.clientX));
  seekAudio(time);

  if (selectedBeatButton) {
    addNoteAtTime(selectedBeatButton, time, true);
  } else {
    showToast('เลือกปุ่มจากแผงเพิ่มจังหวะก่อน แล้วคลิก Timeline อีกครั้ง');
  }
}

function getSnapStep() {
  const level = getActiveLevel();
  const bpm = Number(level?.bpm) || 120;
  if (noteSnapMode === 'quarter') return 60 / bpm;
  if (noteSnapMode === 'eighth') return 30 / bpm;
  if (noteSnapMode === 'sixteenth') return 15 / bpm;
  return 0;
}

function snapTimelineTime(time) {
  const boundedTime = Math.max(0, Math.min(audioDuration || time, time));
  const step = getSnapStep();
  if (!step) return Number(boundedTime.toFixed(2));
  return Number((Math.round(boundedTime / step) * step).toFixed(2));
}

function setTimelineRange(start, end) {
  timelineRangeStart = snapTimelineTime(Math.min(start, end));
  timelineRangeEnd = snapTimelineTime(Math.max(start, end));
  renderTimelineRange();
  updateTimelineBuilderUI();
}

function renderTimelineRange() {
  const selection = document.getElementById('timeline-selection');
  if (!selection || !audioDuration || timelineRangeStart === null || timelineRangeEnd === null) return;

  const left = (timelineRangeStart / audioDuration) * 100;
  const width = Math.max(0.5, ((timelineRangeEnd - timelineRangeStart) / audioDuration) * 100);
  selection.style.left = `${left}%`;
  selection.style.width = `${width}%`;
  selection.classList.add('visible');
}

function clearTimelineRange() {
  timelineRangeStart = null;
  timelineRangeEnd = null;
  const selection = document.getElementById('timeline-selection');
  if (selection) selection.classList.remove('visible');
  updateTimelineBuilderUI();
}

function updateTimelineBuilderUI() {
  const timeLabel = document.getElementById('current-add-time');
  if (timeLabel) timeLabel.innerText = `${playbackTime.toFixed(2)}s`;

  const summary = document.getElementById('range-summary');
  const addRangeButton = document.getElementById('btn-add-range');
  const deleteRangeButton = document.getElementById('btn-delete-range');
  const hasRange = timelineRangeStart !== null && timelineRangeEnd !== null;
  if (summary) {
    summary.classList.toggle('empty', !hasRange);
    summary.innerText = hasRange
      ? `ช่วง ${timelineRangeStart.toFixed(2)}s – ${timelineRangeEnd.toFixed(2)}s (${Math.max(0, timelineRangeEnd - timelineRangeStart).toFixed(2)}s)`
      : 'ยังไม่ได้เลือกช่วงเวลา';
  }
  if (addRangeButton) addRangeButton.disabled = !hasRange || !selectedBeatButton;
  if (deleteRangeButton) deleteRangeButton.disabled = !hasRange;

  const hint = document.getElementById('timeline-action-hint');
  if (hint) {
    hint.innerText = selectedBeatButton
      ? `เลือก ${selectedBeatButton} แล้ว · คลิกเพื่อวาง 1 โน้ต · ลากเพื่อเลือกช่วงเวลา`
      : 'เลือกปุ่มด้านขวา แล้วคลิก Timeline เพื่อวางโน้ต หรือ ลากเพื่อเลือกช่วงเวลา';
  }
}

function addNoteAtTime(buttonId, time, notify) {
  if (!buttonId || !audioDuration) return false;
  const normalizedTime = snapTimelineTime(time);
  const duplicate = beatmap.some((note) => note.buttonId === buttonId && Math.abs(note.time - normalizedTime) < 0.01);
  if (duplicate) {
    if (notify) showToast(`${buttonId} มีอยู่ที่ ${normalizedTime.toFixed(2)}s แล้ว`);
    return false;
  }

  beatmap.push({ time: normalizedTime, buttonId });
  beatmap.sort((a, b) => a.time - b.time);
  updateBeatmapJSON();
  renderTimelineNotes();
  if (notify) showToast(`เพิ่ม ${buttonId} ที่ ${normalizedTime.toFixed(2)}s`);
  return true;
}

function addNoteAtCurrentTime() {
  if (!selectedBeatButton) {
    showToast('เลือกปุ่มที่จะเพิ่มก่อน');
    return;
  }
  addNoteAtTime(selectedBeatButton, playbackTime, true);
}

function addNotesInSelectedRange() {
  if (!selectedBeatButton || timelineRangeStart === null || timelineRangeEnd === null) {
    showToast('เลือกปุ่มและลากช่วงเวลาบน Timeline ก่อน');
    return;
  }

  const step = Math.max(0.05, Number(document.getElementById('range-step-input').value) || 0.5);
  const start = Math.min(timelineRangeStart, timelineRangeEnd);
  const end = Math.max(timelineRangeStart, timelineRangeEnd);
  let addedCount = 0;

  for (let time = start; time <= end + 0.001; time += step) {
    if (addNoteAtTime(selectedBeatButton, time, false)) addedCount += 1;
  }

  showToast(`เพิ่ม ${selectedBeatButton} ในช่วงแล้ว ${addedCount} โน้ต`);
}

function deleteNotesInSelectedRange() {
  if (timelineRangeStart === null || timelineRangeEnd === null) {
    showToast('ลากเลือกช่วงเวลาบน Timeline ก่อน');
    return;
  }

  const start = Math.min(timelineRangeStart, timelineRangeEnd);
  const end = Math.max(timelineRangeStart, timelineRangeEnd);
  const previousCount = beatmap.length;
  beatmap = beatmap.filter((note) => note.time < start || note.time > end);
  const deletedCount = previousCount - beatmap.length;

  selectedNoteIndex = null;
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast(deletedCount > 0
    ? `ลบโน้ตในช่วง ${start.toFixed(2)}s – ${end.toFixed(2)}s แล้ว ${deletedCount} โน้ต`
    : 'ไม่มีโน้ตอยู่ในช่วงเวลาที่เลือก');
}

function slugify(value) {
  return String(value || 'game')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'planko-game';
}

function getActiveLevel() {
  return gameProject && gameProject.levels ? gameProject.levels[activeLevelIndex] : null;
}

function updateActiveLevelField(field, value) {
  const level = getActiveLevel();
  if (!level) return;

  if (field === 'bpm') {
    level.bpm = Math.max(1, Number(value) || 120);
  } else {
    level[field] = value;
  }

  renderLevelList();
  renderProjectJSONPreview();
}

function saveActiveLevel() {
  const level = getActiveLevel();
  if (!level) return;

  level.beatmap = beatmap.map((note, index) => ({
    id: index + 1,
    time: note.time,
    buttonId: note.buttonId
  }));

  if (audioDuration > 0 && levelAudioFiles.has(activeLevelIndex)) {
    level.audio.duration = Number(audioDuration.toFixed(2));
  }
}

function syncStudioInputs() {
  const level = getActiveLevel();
  if (!gameProject || !level) return;

  document.getElementById('game-title-input').value = gameProject.title;
  document.getElementById('game-slug-input').value = gameProject.id;
  document.getElementById('game-description-input').value = gameProject.description;
  document.getElementById('level-title-input').value = level.title;
  document.getElementById('level-difficulty-input').value = level.difficulty;
  document.getElementById('level-bpm-input').value = level.bpm;
  document.getElementById('level-description-input').value = level.description;
  document.getElementById('active-level-label').innerText = `Level ${String(activeLevelIndex + 1).padStart(2, '0')}`;

  const file = levelAudioFiles.get(activeLevelIndex);
  const fileName = file ? file.name : level.audio.fileName;
  document.getElementById('studio-audio-name').innerText = fileName || 'ยังไม่ได้เลือกเพลงของด่านนี้';
  document.getElementById('studio-audio-meta').innerText = file
    ? `${file.type || 'audio/*'} · ${(file.size / 1024 / 1024).toFixed(2)} MB · พร้อมสร้าง JSON`
    : `รองรับ MP3, WAV, M4A · ${level.audio.duration ? `${level.audio.duration}s` : 'ยังไม่ทราบความยาว'}`;
}

function renderLevelList() {
  const list = document.getElementById('level-list');
  if (!list || !gameProject) return;

  document.getElementById('level-count-label').innerText = `${gameProject.levels.length} level${gameProject.levels.length === 1 ? '' : 's'}`;
  list.innerHTML = gameProject.levels.map((level, index) => `
    <button class="level-item ${index === activeLevelIndex ? 'active' : ''}" data-level-index="${index}">
      <div class="level-item-top">
        <span class="level-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="level-item-title">${escapeHtml(level.title || 'Untitled level')}</span>
        <span class="level-status ${level.difficulty}">${String(level.difficulty).toUpperCase()}</span>
      </div>
      <div class="level-item-meta">
        <span><i class="fa-solid fa-music"></i> ${escapeHtml(level.audio.fileName || 'No audio')}</span>
        <span><i class="fa-solid fa-note-sticky"></i> ${level.beatmap.length} notes</span>
      </div>
    </button>
  `).join('');

  list.querySelectorAll('[data-level-index]').forEach((button) => {
    button.addEventListener('click', () => selectLevel(Number(button.dataset.levelIndex)));
  });
}

function renderProjectJSONPreview() {
  const output = document.getElementById('game-json-output');
  if (!output || !gameProject) return;

  saveActiveLevel();
  const exportedProject = serializeGameProject();
  output.value = JSON.stringify(exportedProject, null, 2);

  const noteCount = exportedProject.levels.reduce((sum, level) => sum + level.beatmap.length, 0);
  document.getElementById('studio-json-summary').innerHTML =
    `<strong>${exportedProject.levels.length}</strong> ด่าน · <strong>${noteCount}</strong> notes · schema <strong>${exportedProject.schemaVersion}</strong>`;
}

function serializeGameProject() {
  return {
    schemaVersion: gameProject.schemaVersion,
    type: gameProject.type,
    id: gameProject.id || slugify(gameProject.title),
    title: gameProject.title,
    description: gameProject.description,
    version: gameProject.version,
    levels: gameProject.levels.map((level, levelIndex) => ({
      id: level.id || `${slugify(gameProject.title)}-level-${levelIndex + 1}`,
      title: level.title,
      difficulty: level.difficulty,
      bpm: Number(level.bpm) || 120,
      description: level.description,
      duration: Number(level.audio.duration) || 0,
      audio: {
        fileName: level.audio.fileName || '',
        mimeType: level.audio.mimeType || 'audio/mpeg',
        uri: level.audio.uri || `assets/audio/${level.audio.fileName || 'replace-me.mp3'}`
      },
      beatmap: level.beatmap.map((note, noteIndex) => ({
        id: note.id || noteIndex + 1,
        time: Number(note.time.toFixed ? note.time.toFixed(2) : note.time),
        buttonId: note.buttonId
      }))
    }))
  };
}

function selectLevel(index) {
  if (!gameProject || index === activeLevelIndex || !gameProject.levels[index]) return;

  saveActiveLevel();
  activeLevelIndex = index;
  clearTimelineRange();
  const level = getActiveLevel();
  beatmap = (level.beatmap || []).map((note) => ({
    time: note.time,
    buttonId: note.buttonId
  }));

  stopAudio();
  audioDuration = Number(level.audio.duration) || 0;
  const file = levelAudioFiles.get(activeLevelIndex);
  if (file) {
    loadAudioFile(file, false, false);
  } else {
    currentSongName = level.audio.fileName || 'ยังไม่ได้เลือกเพลง';
    document.getElementById('song-name').innerText = currentSongName;
    document.getElementById('song-duration').innerText = formatTime(audioDuration);
    document.getElementById('editor-duration-text').innerText = `${audioDuration.toFixed(2)}s`;
  }

  syncStudioInputs();
  renderLevelList();
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast(`เปิดด่าน ${level.title}`);
}

function addLevel() {
  if (!gameProject) return;
  saveActiveLevel();
  const nextNumber = gameProject.levels.length + 1;
  gameProject.levels.push({
    id: `${slugify(gameProject.title)}-level-${String(nextNumber).padStart(2, '0')}`,
    title: `New Level ${String(nextNumber).padStart(2, '0')}`,
    difficulty: 'normal',
    bpm: 120,
    description: 'เพิ่มคำอธิบายของด่านนี้',
    audio: {
      fileName: '',
      mimeType: 'audio/mpeg',
      duration: 0,
      uri: `assets/audio/level-${String(nextNumber).padStart(2, '0')}.mp3`
    },
    beatmap: []
  });
  activeLevelIndex = gameProject.levels.length - 1;
  clearTimelineRange();
  beatmap = [];
  audioDuration = 0;
  stopAudio();
  syncStudioInputs();
  renderLevelList();
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast('เพิ่มด่านใหม่แล้ว — อัปโหลดเพลงแล้วเริ่มอัดโน้ตได้เลย');
}

function createNewProject() {
  if (!window.confirm('เริ่มเกมใหม่และล้างข้อมูล project นี้หรือไม่?')) return;
  gameProject = createInitialGameProject();
  activeLevelIndex = 0;
  clearTimelineRange();
  levelAudioFiles.clear();
  levelAudioUrls.clear();
  beatmap = [...defaultBeatmap];
  audioDuration = 30;
  stopAudio();
  syncStudioInputs();
  renderLevelList();
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast('สร้างเกมใหม่แล้ว');
}

function copyGameJSON() {
  const output = document.getElementById('game-json-output');
  if (!output) return;
  output.select();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).catch(() => document.execCommand('copy'));
  } else {
    document.execCommand('copy');
  }
  showToast('คัดลอก game JSON แล้ว');
}

function downloadGameJSON() {
  if (!gameProject) return;
  saveActiveLevel();
  const json = JSON.stringify(serializeGameProject(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugify(gameProject.title)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('ดาวน์โหลด game JSON แล้ว — นำไฟล์ไปไว้ใน planko_expo/src/mocks/');
}

async function saveGameToMockApi() {
  if (!gameProject || !window.MocApi) {
    showToast('ยังไม่พบ Mock API');
    return;
  }

  saveActiveLevel();
  const project = serializeGameProject();
  const result = await window.MocApi.saveGame(project);
  if (!result.ok) {
    showToast(`บันทึก Mock API ไม่สำเร็จ (${result.status})`);
    return;
  }

  showToast(`บันทึกเกม ${project.id} ลง Mock API แล้ว`);
}

async function loadGameFromMockApi() {
  if (!gameProject || !window.MocApi) {
    showToast('ยังไม่พบ Mock API');
    return;
  }

  const inputId = document.getElementById('game-slug-input').value.trim();
  const gameId = inputId || gameProject.id;
  const result = await window.MocApi.getGame(gameId);
  if (!result.ok) {
    showToast(`ยังไม่มีเกม ${gameId} ใน Mock API — กดบันทึกก่อน`);
    return;
  }

  applyMockApiProject(result.data);
  showToast(`โหลดเกม ${gameId} จาก Mock API แล้ว`);
}

function applyMockApiProject(project) {
  const projectId = project.id || slugify(project.title);
  const levels = Array.isArray(project.levels) ? project.levels : [];

  gameProject = {
    schemaVersion: project.schemaVersion || '1.0',
    type: project.type || 'planKo.game',
    id: projectId,
    title: project.title || 'Untitled PlanKO Game',
    description: project.description || '',
    version: Number(project.version) || 1,
    levels: levels.map((level, index) => ({
      id: level.id || `${projectId}-level-${String(index + 1).padStart(2, '0')}`,
      title: level.title || `Level ${String(index + 1).padStart(2, '0')}`,
      difficulty: level.difficulty || 'normal',
      bpm: Number(level.bpm) || 120,
      description: level.description || '',
      audio: {
        fileName: level.audio?.fileName || '',
        mimeType: level.audio?.mimeType || 'audio/mpeg',
        duration: Number(level.audio?.duration) || 0,
        uri: level.audio?.uri || ''
      },
      beatmap: Array.isArray(level.beatmap)
        ? level.beatmap.map((note, noteIndex) => ({
          id: note.id || noteIndex + 1,
          time: Number(note.time) || 0,
          buttonId: note.buttonId || 'L1'
        }))
        : []
    }))
  };

  if (!gameProject.levels.length) {
    gameProject.levels.push({
      id: `${projectId}-level-01`,
      title: 'Level 01',
      difficulty: 'normal',
      bpm: 120,
      description: '',
      audio: { fileName: '', mimeType: 'audio/mpeg', duration: 0, uri: '' },
      beatmap: []
    });
  }

  activeLevelIndex = 0;
  beatmap = gameProject.levels[0].beatmap.map((note) => ({
    time: Number(note.time) || 0,
    buttonId: note.buttonId
  }));
  audioDuration = Number(gameProject.levels[0].audio.duration) || 0;
  levelAudioFiles.clear();
  levelAudioUrls.clear();
  clearTimelineRange();
  selectedNoteIndex = null;
  stopAudio();
  audioEl.removeAttribute('src');
  audioEl.load();

  currentSongName = gameProject.levels[0].audio.fileName || 'ยังไม่ได้เลือกเพลง';
  document.getElementById('song-name').innerText = currentSongName;
  document.getElementById('song-duration').innerText = formatTime(audioDuration);
  document.getElementById('editor-duration-text').innerText = `${audioDuration.toFixed(2)}s`;
  syncStudioInputs();
  renderLevelList();
  updateBeatmapJSON();
  renderTimelineNotes();
}

// Load the project's JSON and attach the local Sparks.mp3 file to its Sparks level.
// This is intentionally best-effort: if the page is opened directly with file://,
// the browser may block fetch(), and the existing file pickers remain available.
async function loadLocalGameProject() {
  try {
    const response = await fetch(LOCAL_GAME_JSON_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const project = await response.json();
    applyMockApiProject(project);

    const sparksIndex = gameProject.levels.findIndex((level) =>
      String(level.audio?.fileName || '').toLowerCase() === 'sparks.mp3'
    );

    if (sparksIndex >= 0) {
      selectLevel(sparksIndex);
      loadAudioUrl(LOCAL_SPARKS_AUDIO_URL, false);
    }

    showToast('โหลด JSON และเพลง Sparks.mp3 แล้ว');
  } catch (error) {
    console.warn('Local game project auto-load skipped:', error);
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderStudio() {
  if (!gameProject) return;
  syncStudioInputs();
  renderLevelList();
  renderProjectJSONPreview();
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

// Studio audio loader. It keeps the browser file in memory and stores a
// portable assets/audio path in the game JSON for the Expo client.
function handleStudioAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  loadAudioFile(file, true, true);
}

function handleLinkedLevelAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // This picker belongs to the active level, so keep beatmap notes loaded from JSON.
  loadAudioFile(file, false, true);
  e.target.value = '';
}

async function handleGameJsonFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const parsed = JSON.parse(await file.text());

    if (Array.isArray(parsed?.levels)) {
      applyMockApiProject(parsed);
    } else if (Array.isArray(parsed?.beatmap)) {
      const currentProject = serializeGameProject();
      currentProject.levels = [{
        ...currentProject.levels[0],
        ...parsed,
        audio: { ...currentProject.levels[0].audio, ...(parsed.audio || {}) }
      }];
      applyMockApiProject(currentProject);
    } else if (Array.isArray(parsed)) {
      const currentProject = serializeGameProject();
      currentProject.levels[0].beatmap = parsed;
      applyMockApiProject(currentProject);
    } else {
      throw new Error('ไฟล์ต้องมี levels, beatmap หรือเป็น Array ของโน้ต');
    }

    showToast(`เลือกไฟล์ด่าน ${file.name} แล้ว — เลือกเพลงของด่านเพื่อเชื่อมต่อได้เลย`);
  } catch (error) {
    console.error('Level JSON import error:', error);
    showToast(`อ่านไฟล์ด่านไม่สำเร็จ: ${error.message}`);
  } finally {
    e.target.value = '';
  }
}

function loadAudioFile(file, clearBeatmap, showSuccess) {
  initAudioContext();

  levelAudioFiles.set(activeLevelIndex, file);
  currentSongName = file.name;
  document.getElementById('song-name').innerText = file.name;
  document.getElementById('studio-audio-name').innerText = file.name;
  document.getElementById('studio-audio-meta').innerText = `${file.type || 'audio/*'} · ${(file.size / 1024 / 1024).toFixed(2)} MB · กำลังอ่านความยาวเพลง...`;

  const previousUrl = levelAudioUrls.get(activeLevelIndex);
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  const objectUrl = URL.createObjectURL(file);
  levelAudioUrls.set(activeLevelIndex, objectUrl);
  audioEl.src = objectUrl;
  audioEl.load();

  audioEl.onloadedmetadata = () => {
    audioDuration = audioEl.duration;
    document.getElementById('song-duration').innerText = formatTime(audioDuration);
    document.getElementById('editor-duration-text').innerText = audioDuration.toFixed(2) + 's';

    const level = getActiveLevel();
    if (level) {
      level.audio.fileName = file.name;
      level.audio.mimeType = file.type || 'audio/mpeg';
      level.audio.duration = Number(audioDuration.toFixed(2));
      level.audio.uri = `assets/audio/${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    }

    if (clearBeatmap) {
      beatmap = [];
      clearTimelineRange();
    }
    syncStudioInputs();
    updateBeatmapJSON();
    renderTimelineNotes();
    if (showSuccess) showToast('อัปโหลดเพลงสำเร็จ — พร้อมอัด beatmap แล้ว');
  };
}

// Load an audio asset by URL (used for the checked-in Sparks.mp3 file).
function loadAudioUrl(url, showSuccess) {
  initAudioContext();
  currentSongName = 'Sparks.mp3';
  document.getElementById('song-name').innerText = currentSongName;

  audioEl.src = url;
  audioEl.load();

  audioEl.onloadedmetadata = () => {
    audioDuration = audioEl.duration;
    document.getElementById('song-duration').innerText = formatTime(audioDuration);
    document.getElementById('editor-duration-text').innerText = audioDuration.toFixed(2) + 's';

    const level = getActiveLevel();
    if (level) {
      level.audio.fileName = 'Sparks.mp3';
      level.audio.mimeType = 'audio/mpeg';
      level.audio.duration = Number(audioDuration.toFixed(2));
      level.audio.uri = url;
    }

    syncStudioInputs();
    updateBeatmapJSON();
    renderTimelineNotes();
    if (showSuccess) showToast('โหลดเพลง Sparks.mp3 สำเร็จ');
  };

  audioEl.onerror = () => {
    showToast('โหลด Sparks.mp3 ไม่สำเร็จ — ตรวจสอบว่าไฟล์อยู่ที่โฟลเดอร์หลักของโปรเจกต์');
  };
}

function updatePlaybackButtons() {
  const mainButton = document.getElementById('btn-play-pause');
  const editorButton = document.getElementById('btn-editor-play-pause');
  const icon = isPlaying ? 'fa-pause' : 'fa-play';

  if (mainButton) mainButton.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  if (editorButton) {
    editorButton.innerHTML = `<i class="fa-solid ${icon}"></i> ${isPlaying ? 'หยุดชั่วคราว' : 'เล่นเพลง'}`;
  }
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
    updatePlaybackButtons();
    cancelAnimationFrame(animationFrameId);
  } else {
    audioEl.play().then(() => {
      isPlaying = true;
      updatePlaybackButtons();
      
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
  updatePlaybackButtons();
  cancelAnimationFrame(animationFrameId);
  
  playbackTime = 0;
  document.getElementById('game-time').innerText = "0:00";
  document.getElementById('editor-time').innerText = "0.00";
  document.getElementById('timeline-cursor').style.left = '0%';
  updateTimelineBuilderUI();
  
  resetGame();
}

// Seek Audio Timeline
function seekAudio(seconds) {
  audioEl.currentTime = seconds;
  playbackTime = seconds;
  document.getElementById('game-time').innerText = formatTime(seconds);
  document.getElementById('editor-time').innerText = seconds.toFixed(2);
  updateTimelineBuilderUI();
  
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
  updateTimelineBuilderUI();
  
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
  const activeElementTag = document.activeElement?.tagName;
  if (
    activeTab === 'editor' &&
    (e.key === 'Delete' || e.key === 'Backspace') &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElementTag)
  ) {
    e.preventDefault();
    deleteSelectedNote();
    return;
  }

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
  // In editor: record to the current playhead while playing, or place at
  // the paused playhead when a pad has been selected in the builder.
  else if (activeTab === 'editor' && (isPlaying || selectedBeatButton)) {
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
  addNoteAtTime(buttonId, playbackTime, false);
}

// Render beat notes in Timeline track (editor tab)
function renderTimelineNotes() {
  const track = document.getElementById('timeline-track');
  
  // Clear existing notes (preserve cursor)
  const notes = track.querySelectorAll('.timeline-note');
  notes.forEach(n => n.remove());
  
  document.getElementById('editor-note-count').innerText = beatmap.length;
  if (selectedNoteIndex !== null && !beatmap[selectedNoteIndex]) selectedNoteIndex = null;
  updateSelectedNoteUI();
  
  if (!audioDuration) return;
  
  // Render each beatmap note visually
  beatmap.forEach((note, index) => {
    const pct = (note.time / audioDuration) * 100;
    
    const noteEl = document.createElement('div');
    noteEl.className = 'timeline-note';
    noteEl.dataset.noteIndex = String(index);
    if (index === selectedNoteIndex) noteEl.classList.add('selected');
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
    
    // Single click selects; double click keeps the original quick-delete flow.
    noteEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTimelineNote(index);
    });

    noteEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      deleteNoteIndex(index);
    });
    
    track.appendChild(noteEl);
  });
}

function selectTimelineNote(index) {
  if (!beatmap[index]) return;
  selectedNoteIndex = index;
  document.querySelectorAll('.timeline-note').forEach((noteEl) => {
    noteEl.classList.toggle('selected', Number(noteEl.dataset.noteIndex) === index);
  });
  updateSelectedNoteUI();
}

function updateSelectedNoteUI() {
  const deleteButton = document.getElementById('btn-delete-selected-note');
  const label = document.getElementById('selected-note-label');
  const hasSelection = selectedNoteIndex !== null && Boolean(beatmap[selectedNoteIndex]);
  if (deleteButton) deleteButton.disabled = !hasSelection;
  if (label) {
    label.innerText = hasSelection
      ? `(${beatmap[selectedNoteIndex].buttonId} ${beatmap[selectedNoteIndex].time.toFixed(2)}s)`
      : '(ยังไม่ได้เลือก)';
  }
}

function deleteSelectedNote() {
  if (selectedNoteIndex === null) {
    showToast('คลิกเลือกโน้ตบน Timeline ก่อน');
    return;
  }
  deleteNoteIndex(selectedNoteIndex);
}

// Delete Note at Index
function deleteNoteIndex(index) {
  if (!beatmap[index]) return;
  beatmap.splice(index, 1);
  selectedNoteIndex = null;
  updateBeatmapJSON();
  renderTimelineNotes();
  showToast("ลบโน้ตที่เลือกเรียบร้อย");
}

// Update JSON display textbox
function updateBeatmapJSON() {
  const textbox = document.getElementById('beatmap-json-output');
  if (textbox) textbox.value = JSON.stringify(beatmap, null, 2);
  saveActiveLevel();
  renderLevelList();
  renderProjectJSONPreview();
}

// Clear all beatmaps
function clearBeatmap() {
  beatmap = [];
  selectedNoteIndex = null;
  updateBeatmapJSON();
  renderTimelineNotes();
  resetGame();
  showToast("ล้างข้อมูลโน้ตทั้งหมดเรียบร้อย!");
}

// Delete last note in the beatmap (Undo)
function deleteLastNote() {
  if (beatmap.length > 0) {
    const removed = beatmap.pop();
    selectedNoteIndex = null;
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
    selectedNoteIndex = null;
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
