
/* Gym Log v2.3 — Profiles + Themes/Logo + Video Links + In‑app Player + Shortcut Export */
const $ = (q) => document.querySelector(q);
const $$ = (q) => Array.from(document.querySelectorAll(q));

// ---------- Storage ----------
const store = {
  get(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

// Profile model: { id, name, title, theme:{...}, logoDataUrl:'', exercises:[], workouts:[], sessions:[], active:null }
const state = {
  profiles: store.get('profiles_v23', {}),
  currentId: store.get('currentProfileId_v23', null),
};

const defaultTheme = {
  bg: '#0f1115',
  card: '#181b22',
  text: '#eceff4',
  muted: '#8b8fa3',
  accent: '#6aa6ff',
  danger: '#ff6b6b',
  primary: '#7ee787',
};

function uid(){ return Math.random().toString(36).slice(2,10); }

function ensureInitialProfile() {
  const ids = Object.keys(state.profiles);
  if (!ids.length) {
    const id = uid();
    state.currentId = id;
    state.profiles[id] = makeEmptyProfile('You');
    seedProfile(state.profiles[id]);
    saveAll();
  } else if (!state.currentId) {
    state.currentId = ids[0];
    saveAll();
  }
}
function makeEmptyProfile(name) {
  return {
    id: uid(),
    name,
    title: 'Gym Log',
    theme: { ...defaultTheme },
    logoDataUrl: '',
    exercises: [],
    workouts: [],
    sessions: [],
    active: null,
  };
}
function seedProfile(p) {
  const ex = [
    {name:'Back Squat', bodypart:'Legs', unit:'kg', videoUrl:'https://www.youtube.com/embed/ultWZbUMPL8'},
    {name:'Romanian Deadlift', bodypart:'Hamstrings', unit:'kg', videoUrl:'https://www.youtube.com/embed/2SHsk9AzdjA'},
    {name:'Leg Press', bodypart:'Legs', unit:'kg', videoUrl:'https://www.youtube.com/embed/IZxyjW7MPJQ'},
    {name:'Leg Curl', bodypart:'Hamstrings', unit:'kg', videoUrl:'https://www.youtube.com/embed/1Tq3QdYUuHs'},
    {name:'Standing Calf Raise', bodypart:'Calves', unit:'kg', videoUrl:'https://www.youtube.com/embed/-M4-G8p8fmc'},
    {name:'Barbell Bench Press', bodypart:'Chest', unit:'kg', videoUrl:'https://www.youtube.com/embed/vthMCtgVtFw'},
    {name:'Incline Dumbbell Press', bodypart:'Chest', unit:'kg', videoUrl:'https://www.youtube.com/embed/8iPEnn-ltC8'},
    {name:'Overhead Press', bodypart:'Shoulders', unit:'kg', videoUrl:'https://www.youtube.com/embed/F3QY5vMz_6I'},
    {name:'Lateral Raise', bodypart:'Shoulders', unit:'kg', videoUrl:'https://www.youtube.com/embed/3VcKaXpzqRo'},
    {name:'Triceps Rope Pushdown', bodypart:'Triceps', unit:'kg', videoUrl:'https://www.youtube.com/embed/2-LAMcpzODU'},
    {name:'Conventional Deadlift', bodypart:'Back', unit:'kg', videoUrl:'https://www.youtube.com/embed/op9kVnSso6Q'},
    {name:'Lat Pulldown', bodypart:'Back', unit:'kg', videoUrl:'https://www.youtube.com/embed/CAwf7n6Luuc'},
    {name:'Seated Row', bodypart:'Back', unit:'kg', videoUrl:'https://www.youtube.com/embed/GZbfZ033f74'},
    {name:'Face Pull', bodypart:'Rear Delts', unit:'kg', videoUrl:'https://www.youtube.com/embed/rep-qVOkqgk'},
    {name:'EZ-Bar Curl', bodypart:'Biceps', unit:'kg', videoUrl:'https://www.youtube.com/embed/kwG2ipFRgfo'},
    {name:'Plank', bodypart:'Core', unit:'bw', videoUrl:'https://www.youtube.com/embed/pSHjTRCQxIw'},
  ];
  ex.forEach(e => p.exercises.push({id:uid(), ...e}));
  const findId = (name) => p.exercises.find(e=>e.name===name)?.id;
  p.workouts.push(
    {id:uid(), name:'Leg Day', exerciseIds:[findId('Back Squat'), findId('Romanian Deadlift'), findId('Leg Press'), findId('Leg Curl'), findId('Standing Calf Raise')].filter(Boolean)},
    {id:uid(), name:'Push Day', exerciseIds:[findId('Barbell Bench Press'), findId('Incline Dumbbell Press'), findId('Overhead Press'), findId('Lateral Raise'), findId('Triceps Rope Pushdown')].filter(Boolean)},
    {id:uid(), name:'Pull Day', exerciseIds:[findId('Conventional Deadlift'), findId('Lat Pulldown'), findId('Seated Row'), findId('Face Pull'), findId('EZ-Bar Curl')].filter(Boolean)},
    {id:uid(), name:'Full Body A', exerciseIds:[findId('Back Squat'), findId('Barbell Bench Press'), findId('Seated Row'), findId('Plank')].filter(Boolean)},
  );
}

// Helpers to get current profile object
function P(){ return state.profiles[state.currentId]; }

function saveAll(){
  store.set('profiles_v23', state.profiles);
  store.set('currentProfileId_v23', state.currentId);
}

// ---------- Theming & Logo ----------
function applyTheme() {
  const t = P().theme || defaultTheme;
  const r = document.documentElement.style;
  r.setProperty('--bg', t.bg);
  r.setProperty('--card', t.card);
  r.setProperty('--text', t.text);
  r.setProperty('--muted', t.muted);
  r.setProperty('--accent', t.accent);
  r.setProperty('--danger', t.danger);
  r.setProperty('--primary', t.primary);
  $('#appTitle').textContent = P().title || 'Gym Log';
  const logo = $('#headerLogo');
  if (P().logoDataUrl) {
    logo.src = P().logoDataUrl;
    logo.classList.remove('hidden');
  } else {
    logo.classList.add('hidden');
  }
}

// ---------- Tabs ----------
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $('#tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ---------- Profile Select ----------
function renderProfileSelect(){
  const sel = $('#profileSelect');
  sel.innerHTML = '';
  Object.values(state.profiles).forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    if (p.id === state.currentId) opt.selected = true;
    sel.appendChild(opt);
  });
}
$('#profileSelect').addEventListener('change', (e)=>{
  state.currentId = e.target.value;
  saveAll();
  refreshAll();
});

// ---------- Exercise Library ----------
function renderExercises(){
  const list = $('#exerciseList');
  list.innerHTML = '';
  P().exercises.forEach(ex => {
    const li = document.createElement('li');
    li.className = 'card';
    const btn = ex.videoUrl ? `<button class="video-btn" data-url="${ex.videoUrl}">▶</button>` : '';
    li.innerHTML = `
      <div class="exercise-item">
        <div>
          <strong>${ex.name}</strong> <span class="small">• ${ex.bodypart || '—'} • ${ex.unit}</span>
        </div>
        <div>
          ${btn}
          <button data-act="edit" data-id="${ex.id}">Edit</button>
          <button data-act="del" data-id="${ex.id}" class="danger">Delete</button>
        </div>
      </div>`;
    list.appendChild(li);
  });
  // Fill selects
  const exSel = $('#woExerciseSelect');
  const statsSel = $('#statsExerciseSelect');
  [exSel, statsSel].forEach(sel => sel.innerHTML = '');
  P().exercises.forEach(ex => {
    const opt = document.createElement('option');
    opt.value = ex.id; opt.textContent = ex.name;
    exSel.appendChild(opt.cloneNode(true));
    statsSel.appendChild(opt);
  });
}
$('#exerciseForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#exName').value.trim();
  if(!name) return;
  P().exercises.push({
    id: uid(),
    name,
    bodypart: $('#exBodypart').value.trim(),
    unit: $('#exUnit').value,
    videoUrl: $('#exVideo').value.trim(),
  });
  saveAll(); e.target.reset(); renderExercises();
});
$('#exerciseList').addEventListener('click', (e)=>{
  if (e.target.classList.contains('video-btn')) { openVideo(e.target.dataset.url); return; }
  const id = e.target.dataset.id;
  const act = e.target.dataset.act;
  if (!id || !act) return;
  const ex = P().exercises.find(x=>x.id===id);
  if (act === 'del') {
    if (!confirm('Delete exercise?')) return;
    P().exercises = P().exercises.filter(x=>x.id!==id);
  } else if (act === 'edit') {
    const name = prompt('Name', ex.name) ?? ex.name;
    const bodypart = prompt('Body part', ex.bodypart || '') ?? ex.bodypart;
    const unit = prompt('Unit (kg/lb/bw)', ex.unit) ?? ex.unit;
    const videoUrl = prompt('Video URL (YouTube or MP4)', ex.videoUrl || '') ?? ex.videoUrl;
    ex.name = (name||'').trim() || ex.name;
    ex.bodypart = (bodypart||'').trim();
    ex.unit = (unit||'kg').trim();
    ex.videoUrl = (videoUrl||'').trim();
  }
  saveAll(); renderExercises();
});

// ---------- Workouts ----------
function renderWorkouts(){
  const container = $('#workoutList');
  container.innerHTML = '';
  P().workouts.forEach(wo => {
    const div = document.createElement('div');
    div.className = 'card workout-card';
    const exNames = wo.exerciseIds.map(id => P().exercises.find(e=>e.id===id)?.name || '—');
    div.innerHTML = `
      <h3>${wo.name}</h3>
      <div class="small">${exNames.length ? exNames.join(', ') : 'No exercises yet'}</div>
      <div class="row" style="margin-top:6px;">
        <button data-act="open" data-id="${wo.id}">Edit</button>
        <button data-act="del" data-id="${wo.id}" class="danger">Delete</button>
      </div>`;
    container.appendChild(div);
  });
  const startSel = $('#startWorkoutSelect');
  startSel.innerHTML = '';
  P().workouts.forEach(wo => {
    const opt = document.createElement('option');
    opt.value = wo.id; opt.textContent = wo.name;
    startSel.appendChild(opt);
  });
}
$('#workoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = $('#woName').value.trim();
  if (!name) return;
  P().workouts.push({ id: uid(), name, exerciseIds: [] });
  saveAll(); e.target.reset(); renderWorkouts();
});
$('#workoutList').addEventListener('click', (e)=>{
  const id = e.target.dataset.id; const act = e.target.dataset.act;
  if (!id || !act) return;
  if (act === 'del') {
    if (!confirm('Delete workout?')) return;
    P().workouts = P().workouts.filter(w=>w.id!==id);
    saveAll(); renderWorkouts();
  } else if (act === 'open') {
    openEditor(id);
  }
});

function openEditor(id){
  const wo = P().workouts.find(w=>w.id===id);
  $('#workoutEditor').classList.remove('hidden');
  $('#woTitle').textContent = wo.name;
  $('#workoutEditor').dataset.id = id;
  renderEditorList(wo);
}
$('#closeEditor').addEventListener('click', ()=> $('#workoutEditor').classList.add('hidden'));
$('#addExToWo').addEventListener('click', ()=>{
  const id = $('#workoutEditor').dataset.id;
  const wo = P().workouts.find(w=>w.id===id);
  const exId = $('#woExerciseSelect').value;
  if (exId && !wo.exerciseIds.includes(exId)) {
    wo.exerciseIds.push(exId);
    saveAll(); renderEditorList(wo);
  }
});
function renderEditorList(wo){
  const ul = $('#woExercises');
  ul.innerHTML = '';
  wo.exerciseIds.forEach(exId => {
    const li = document.createElement('li');
    const ex = P().exercises.find(e=>e.id===exId);
    const btn = ex?.videoUrl ? `<button class="video-btn" data-url="${ex.videoUrl}">▶</button>` : '';
    li.innerHTML = `
      <div class="exercise-item">
        <span>${ex?.name || 'Exercise'}</span>
        <div>${btn}<button data-act="remove-ex" data-id="${exId}">Remove</button></div>
      </div>`;
    ul.appendChild(li);
  });
}
$('#woExercises').addEventListener('click', (e)=>{
  if (e.target.classList.contains('video-btn')) { openVideo(e.target.dataset.url); return; }
  if (e.target.dataset.act === 'remove-ex') {
    const id = $('#workoutEditor').dataset.id;
    const wo = P().workouts.find(w=>w.id===id);
    const exId = e.target.dataset.id;
    wo.exerciseIds = wo.exerciseIds.filter(x=>x!==exId);
    saveAll(); renderEditorList(wo);
  }
});
$('#saveWorkout').addEventListener('click', ()=>{
  alert('Saved!'); $('#workoutEditor').classList.add('hidden');
});

// ---------- Today (Active workout) ----------
function renderActive(){
  const container = $('#activeWorkout');
  container.innerHTML = '';
  const active = P().active;
  if (!active) { container.innerHTML = '<div class="card">No active workout. Start one above.</div>'; return; }
  const wo = P().workouts.find(w=>w.id===active.workoutId);
  const wrap = document.createElement('div');
  wrap.className = 'card';
  wrap.innerHTML = `<h3>${wo?.name || 'Custom'}</h3>`;
  active.items.forEach((it, idx) => {
    const ex = P().exercises.find(e=>e.id===it.exerciseId);
    const btn = ex?.videoUrl ? `<button class="video-btn" data-url="${ex.videoUrl}">▶</button>` : '';
    const sec = document.createElement('div');
    sec.className = 'card';
    sec.innerHTML = `
      <div class="row">
        <strong>${ex?.name || 'Exercise'}</strong> ${btn}
        <button data-act="add-set" data-idx="${idx}">Add Set</button>
        <button data-act="del-ex" data-idx="${idx}" class="danger">Remove Exercise</button>
      </div>
      <div class="sets" id="sets-${idx}"></div>
      <input placeholder="Notes" data-act="note" data-idx="${idx}" value="${it.note || ''}" />
    `;
    wrap.appendChild(sec);
    renderSets(idx);
  });
  // add exercise picker
  const picker = document.createElement('div');
  picker.className = 'row';
  const sel = document.createElement('select');
  P().exercises.forEach(ex => {
    const opt = document.createElement('option'); opt.value = ex.id; opt.textContent = ex.name;
    sel.appendChild(opt);
  });
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Exercise';
  addBtn.addEventListener('click', ()=>{
    const exId = sel.value;
    P().active.items.push({ exerciseId: exId, sets: [], note: '' });
    saveAll(); renderActive();
  });
  picker.appendChild(sel); picker.appendChild(addBtn);
  wrap.appendChild(picker);
  container.appendChild(wrap);
}
function renderSets(idx){
  const it = P().active.items[idx];
  const box = document.getElementById('sets-' + idx);
  box.innerHTML = '';
  it.sets.forEach((s,i)=>{
    const row = document.createElement('div');
    row.className = 'set-row row';
    row.innerHTML = `
      <span class="small">Set ${i+1}</span>
      <input type="number" step="0.5" placeholder="Weight" value="${s.weight ?? ''}" data-act="w" data-idx="${idx}" data-i="${i}">
      <input type="number" step="1" placeholder="Reps" value="${s.reps ?? ''}" data-act="r" data-idx="${idx}" data-i="${i}">
      <input type="text" placeholder="Notes" value="${s.notes ?? ''}" data-act="n" data-idx="${idx}" data-i="${i}">
      <button data-act="del-set" data-idx="${idx}" data-i="${i}" class="danger">X</button>
    `;
    box.appendChild(row);
  });
}
$('#activeWorkout').addEventListener('click', (e)=>{
  if (!P().active) return;
  if (e.target.classList.contains('video-btn')) { openVideo(e.target.dataset.url); return; }
  const act = e.target.dataset.act;
  if (!act) return;
  if (act === 'add-set') {
    const idx = +e.target.dataset.idx;
    P().active.items[idx].sets.push({weight:null,reps:null,notes:''});
    saveAll(); renderSets(idx);
  } else if (act === 'del-set') {
    const {idx, i} = e.target.dataset;
    P().active.items[+idx].sets.splice(+i,1);
    saveAll(); renderSets(+idx);
  } else if (act === 'del-ex') {
    const idx = +e.target.dataset.idx;
    P().active.items.splice(idx,1);
    saveAll(); renderActive();
  }
});
$('#activeWorkout').addEventListener('input', (e)=>{
  if (!P().active) return;
  const act = e.target.dataset.act;
  if (!act) return;
  if (act === 'w' || act === 'r' || act === 'n') {
    const idx = +e.target.dataset.idx;
    const i = +e.target.dataset.i;
    const key = act === 'w' ? 'weight' : act === 'r' ? 'reps' : 'notes';
    P().active.items[idx].sets[i][key] = (key === 'notes') ? e.target.value : Number(e.target.value);
  } else if (act === 'note') {
    const idx = +e.target.dataset.idx;
    P().active.items[idx].note = e.target.value;
  }
  saveAll();
});

$('#startWorkoutBtn').addEventListener('click', ()=>{
  const id = $('#startWorkoutSelect').value;
  if (!id) return;
  const base = P().workouts.find(w=>w.id===id);
  P().active = { id: uid(), workoutId: id, dateISO: new Date().toISOString(), items: (base?.exerciseIds || []).map(exId => ({exerciseId: exId, sets:[], note:''})) };
  saveAll(); renderActive();
});
$('#endWorkoutBtn').addEventListener('click', ()=>{
  if (!P().active) return;
  if (!confirm('End workout and save to history?')) return;
  P().sessions.unshift(P().active);
  P().active = null;
  saveAll(); renderActive(); renderHistory();
});

// Timer
let timerId = null, elapsed = 0, sessionStart = null;
function updateTimer(){ const m = String(Math.floor(elapsed/60)).padStart(2,'0'); const s = String(elapsed%60).padStart(2,'0'); $('#timerDisplay').textContent = `${m}:${s}`; }
$('#startTimer').addEventListener('click', ()=>{ if (timerId) return; if (!sessionStart) sessionStart = new Date(); timerId = setInterval(()=>{ elapsed++; updateTimer(); }, 1000); });
$('#stopTimer').addEventListener('click', ()=>{ clearInterval(timerId); timerId=null; });
$('#resetTimer').addEventListener('click', ()=>{ elapsed=0; sessionStart=null; updateTimer(); });

// ---------- History ----------
function renderHistory(){
  const box = $('#historyList');
  box.innerHTML = '';
  if (!P().sessions.length) { box.innerHTML = '<div class="card">No sessions yet.</div>'; return; }
  P().sessions.forEach(s => {
    const wo = P().workouts.find(w=>w.id===s.workoutId);
    const div = document.createElement('div');
    div.className = 'card';
    let volTotal = 0;
    s.items.forEach(it => it.sets.forEach(set => { if (set.weight && set.reps) volTotal += set.weight*set.reps; }));
    div.innerHTML = `
      <strong>${wo?.name || 'Workout'}</strong>
      <div class="small">${new Date(s.dateISO).toLocaleString()} • Volume: ${volTotal.toFixed(1)}</div>
      <details>
        <summary>View details</summary>
        ${s.items.map(it => {
          const ex = P().exercises.find(e=>e.id===it.exerciseId);
          const sets = it.sets.map((v,i)=>`Set ${i+1}: ${v.weight ?? '-'} x ${v.reps ?? '-'} ${v.notes?('('+v.notes+')'):''}`).join('<br>');
          const btn = ex?.videoUrl ? `<div><button class="video-btn" data-url="${ex.videoUrl}">▶ Play video</button></div>` : '';
          return `<div class="card"><strong>${ex?.name || 'Exercise'}</strong>${btn}<div class="small">${sets || 'No sets'}</div></div>`;
        }).join('')}
      </details>
    `;
    box.appendChild(div);
  });
}
$('#historyList').addEventListener('click', (e)=>{ if (e.target.classList.contains('video-btn')) openVideo(e.target.dataset.url); });

// ---------- Stats ----------
$('#calcStatsBtn').addEventListener('click', ()=>{
  const exId = $('#statsExerciseSelect').value;
  const out = $('#statsOutput');
  if (!exId) { out.textContent = 'Pick an exercise.'; return; }
  let best1RM = 0, totalVolume = 0, sessionsCount = 0;
  const byDate = {};
  P().sessions.forEach(s => {
    s.items.filter(it=>it.exerciseId===exId).forEach(it=>{
      sessionsCount++;
      it.sets.forEach(set => {
        if (set.weight && set.reps) {
          totalVolume += set.weight*set.reps;
          const est = set.weight * (1 + set.reps/30);
          if (est > best1RM) best1RM = est;
          const d = s.dateISO.slice(0,10);
          byDate[d] = (byDate[d]||0) + set.weight*set.reps;
        }
      });
    });
  });
  const lines = Object.entries(byDate).sort((a,b)=>a[0].localeCompare(b[0])).map(([d,v])=>`${d}: ${v.toFixed(1)}`).join('<br>');
  out.innerHTML = `
    <div class="card">
      <div><strong>Estimated 1RM:</strong> ${best1RM.toFixed(1)}</div>
      <div><strong>Total Volume:</strong> ${totalVolume.toFixed(1)}</div>
      <div><strong>Sessions with exercise:</strong> ${sessionsCount}</div>
      <hr class="sep">
      <div class="small">${lines || 'No data yet'}</div>
    </div>`;
});

// ---------- Export / Import (per profile) ----------
$('#exportBtn').addEventListener('click', ()=>{
  const p = P();
  const payload = {
    name: p.name, title: p.title, theme: p.theme, logoDataUrl: p.logoDataUrl,
    exercises: p.exercises, workouts: p.workouts, sessions: p.sessions
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${p.name || 'profile'}.json`; a.click();
  URL.revokeObjectURL(url);
});

// ---------- Apple Shortcuts JSON Export ----------
$('#exportHealthBtn').addEventListener('click', ()=>{
  const p = P();
  let target = null; // prefer active else latest finished
  if (p.active && p.active.items && p.active.items.length) {
    target = p.active;
  } else if (p.sessions.length) {
    target = p.sessions[0];
  }
  if (!target) { alert('No workout to export. Start one or end a workout first.'); return; }

  let totalVolume = 0;
  const sets = [];
  target.items.forEach(it => {
    const ex = p.exercises.find(e=>e.id===it.exerciseId)?.name || 'Exercise';
    it.sets.forEach(s => {
      if (s.weight || s.reps || s.notes) {
        sets.push({ exercise: ex, weight: Number(s.weight||0), reps: Number(s.reps||0), notes: s.notes||'' });
      }
      if (s.weight && s.reps) totalVolume += s.weight*s.reps;
    });
  });

  const now = new Date();
  const startISO = window.sessionStart ? window.sessionStart.toISOString() : target.dateISO;
  const durationMin = Math.max(1, Math.round((elapsed || 0) / 60)); // rough if timer used
  const payload = {
    schema: "com.mike.gymlog/health-export/v1",
    profile: p.name,
    workoutType: "Strength Training",
    start: startISO,
    end: now.toISOString(),
    durationMinutes: durationMin,
    totalVolume: Number(totalVolume.toFixed(1)),
    sets
  };

  const text = JSON.stringify(payload, null, 2);
  try {
    if (navigator.share) {
      navigator.share({ title: 'Gym Log Health Export', text });
    } else {
      throw new Error('no-share');
    }
  } catch (e) {
    const blob = new Blob([text], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `health-export-${p.name}.json`; a.click();
    URL.revokeObjectURL(url);
    // Also copy to clipboard for convenience
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
  }
});

$('#importFile').addEventListener('change', async (e)=>{
  const file = e.target.files[0]; if (!file) return;
  const text = await file.text();
  try {
    const obj = JSON.parse(text);
    // basic validation
    if (!obj.exercises || !obj.workouts || !obj.sessions) throw new Error('Invalid file');
    const p = P();
    p.exercises = obj.exercises; p.workouts = obj.workouts; p.sessions = obj.sessions;
    if (obj.theme) p.theme = obj.theme;
    if (obj.logoDataUrl !== undefined) p.logoDataUrl = obj.logoDataUrl;
    if (obj.title) p.title = obj.title;
    saveAll(); refreshAll(); alert('Import complete!');
  } catch (err) {
    alert('Invalid JSON.');
  }
});

// ---------- Settings: Profiles ----------
$('#addProfileBtn').addEventListener('click', ()=>{
  const name = ($('#newProfileName').value || '').trim() || 'New Profile';
  const id = uid();
  const p = makeEmptyProfile(name);
  p.id = id;
  state.profiles[id] = p;
  state.currentId = id;
  saveAll(); $('#newProfileName').value = ''; refreshAll();
});
$('#renameProfileBtn').addEventListener('click', ()=>{
  const p = P();
  const name = prompt('New name', p.name) ?? p.name;
  p.name = (name || '').trim() || p.name;
  saveAll(); renderProfileSelect();
});
$('#deleteProfileBtn').addEventListener('click', ()=>{
  const ids = Object.keys(state.profiles);
  if (ids.length <= 1) { alert('You need at least one profile.'); return; }
  if (!confirm('Delete this profile and all its data?')) return;
  delete state.profiles[state.currentId];
  state.currentId = Object.keys(state.profiles)[0];
  saveAll(); refreshAll();
});

// ---------- Settings: Appearance & Logo ----------
function loadThemeInputs(){
  const t = P().theme;
  $('#titleInput').value = P().title || 'Gym Log';
  $('#c_bg').value = t.bg; $('#c_card').value = t.card; $('#c_text').value = t.text; $('#c_muted').value = t.muted;
  $('#c_accent').value = t.accent; $('#c_primary').value = t.primary; $('#c_danger').value = t.danger;
}
$('#saveThemeBtn').addEventListener('click', ()=>{
  const t = P().theme;
  t.bg = $('#c_bg').value; t.card = $('#c_card').value; t.text = $('#c_text').value; t.muted = $('#c_muted').value;
  t.accent = $('#c_accent').value; t.primary = $('#c_primary').value; t.danger = $('#c_danger').value;
  P().title = ($('#titleInput').value || 'Gym Log');
  saveAll(); applyTheme();
});
$('#resetThemeBtn').addEventListener('click', ()=>{
  P().theme = { ...defaultTheme }; P().title = 'Gym Log'; saveAll(); applyTheme(); loadThemeInputs();
});
$('#presetDarkBtn').addEventListener('click', ()=>{
  P().theme = { ...defaultTheme }; saveAll(); applyTheme(); loadThemeInputs();
});
$('#presetLightBtn').addEventListener('click', ()=>{
  P().theme = { bg:'#ffffff', card:'#f2f5f9', text:'#0f1115', muted:'#626b80', accent:'#3366ff', danger:'#cc3333', primary:'#2aa876' };
  saveAll(); applyTheme(); loadThemeInputs();
});
$('#logoFile').addEventListener('change', (e)=>{
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ P().logoDataUrl = reader.result; saveAll(); applyTheme(); };
  reader.readAsDataURL(file);
});
$('#removeLogoBtn').addEventListener('click', ()=>{ P().logoDataUrl = ''; saveAll(); applyTheme(); });

// ---------- Video Modal ----------
const modal = $('#videoModal');
const vbox  = $('#videoContainer');
$('#closeModal').addEventListener('click', closeVideo);
modal.addEventListener('click', (e)=>{ if (e.target === modal) closeVideo(); });

function openVideo(url) {
  vbox.innerHTML = '';
  let el;
  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
    const embed = toYouTubeEmbed(url);
    el = document.createElement('iframe');
    el.src = embed;
    el.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    el.allowFullscreen = true;
    el.frameBorder = 0;
  } else {
    el = document.createElement('video');
    el.src = url;
    el.controls = true;
    el.playsInline = true;
  }
  vbox.appendChild(el);
  modal.classList.remove('hidden');
}
function closeVideo(){ vbox.innerHTML = ''; modal.classList.add('hidden'); }
function toYouTubeEmbed(url){
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return 'https://www.youtube.com/embed/' + u.pathname.slice(1);
    if (u.searchParams.get('v')) return 'https://www.youtube.com/embed/' + u.searchParams.get('v');
    return url;
  } catch { return url; }
}

// ---------- Refresh all UI ----------
function refreshAll(){
  applyTheme();
  renderProfileSelect();
  renderExercises();
  renderWorkouts();
  renderActive();
  renderHistory();
  loadThemeInputs();
}

// ---------- Init ----------
ensureInitialProfile();
refreshAll();
