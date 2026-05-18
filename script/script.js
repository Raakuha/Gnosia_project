// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const API_URL = "http://127.0.0.1:8000";

// ─────────────────────────────────────────────
// SYMPTOM LIST
// ─────────────────────────────────────────────
const ALL_SYMPTOMS = [
  "abdominal_pain","abnormal_menstruation","acidity","acute_liver_failure",
  "altered_sensorium","anxiety","back_pain","belly_pain","blackheads",
  "bladder_discomfort","blister","blood_in_sputum","bloody_stool",
  "blurred_and_distorted_vision","breathlessness","brittle_nails","bruising",
  "burning_micturition","chest_pain","chills","cold_hands_and_feets","coma",
  "congestion","constipation","continuous_feel_of_urine","continuous_sneezing",
  "cough","cramps","dark_urine","dehydration","depression","diarrhoea",
  "dischromic_patches","distention_of_abdomen","dizziness",
  "drying_and_tingling_lips","enlarged_thyroid","excessive_hunger",
  "extra_marital_contacts","family_history","fast_heart_rate","fatigue",
  "fluid_overload","foul_smell_of_urine","headache","high_fever",
  "hip_joint_pain","history_of_alcohol_consumption","increased_appetite",
  "indigestion","inflammatory_nails","internal_itching","irregular_sugar_level",
  "irritability","irritation_in_anus","itching","joint_pain","knee_pain",
  "lack_of_concentration","lethargy","loss_of_appetite","loss_of_balance",
  "loss_of_smell","malaise","mild_fever","mood_swings","movement_stiffness",
  "mucoid_sputum","muscle_pain","muscle_wasting","muscle_weakness","nausea",
  "neck_pain","nodal_skin_eruptions","obesity","pain_behind_the_eyes",
  "pain_during_bowel_movements","pain_in_anal_region","painful_walking",
  "palpitations","passage_of_gases","patches_in_throat","phlegm","polyuria",
  "prominent_veins_on_calf","puffy_face_and_eyes","pus_filled_pimples",
  "receiving_blood_transfusion","receiving_unsterile_injections",
  "red_sore_around_nose","red_spots_over_body","redness_of_eyes","restlessness",
  "runny_nose","rusty_sputum","scurring","shivering","silver_like_dusting",
  "sinus_pressure","skin_peeling","skin_rash","slurred_speech",
  "small_dents_in_nails","spinning_movements","spotting_urination","stiff_neck",
  "stomach_bleeding","stomach_pain","sunken_eyes","sweating","swelled_lymph_nodes",
  "swelling_joints","swelling_of_stomach","swollen_blood_vessels",
  "swollen_extremeties","swollen_legs","throat_irritation","toxic_look_typhos",
  "ulcers_on_tongue","unsteadiness","visual_disturbances","vomiting",
  "watering_from_eyes","weakness_in_limbs","weakness_of_one_body_side",
  "weight_gain","weight_loss","yellow_crust_ooze","yellow_urine",
  "yellowing_of_eyes","yellowish_skin"
];

let selectedSymptoms = new Set();

// ─────────────────────────────────────────────
// SYMPTOM PICKER — HELPERS
// ─────────────────────────────────────────────
function formatLabel(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function injectSymptomModal() {
  if (document.getElementById('symptomModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="symptomModal" onclick="closeSymptomPicker(event)" style="
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(15,23,42,0.55); backdrop-filter:blur(4px);
      justify-content:center; align-items:center; padding:20px;">
      <div onclick="event.stopPropagation()" style="
        background:white; border-radius:24px; width:100%; max-width:680px;
        max-height:85vh; display:flex; flex-direction:column;
        box-shadow:0 25px 60px rgba(0,0,0,0.25); overflow:hidden;">
        <div style="padding:24px 28px 16px; border-bottom:1px solid #f1f5f9;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <div>
              <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:0;">Select Your Symptoms</h3>
              <p style="font-size:0.8rem; color:#64748b; margin:4px 0 0;">Click symptoms to select. Click again to deselect.</p>
            </div>
            <button onclick="closeModal()" style="
              background:#f1f5f9; border:none; border-radius:50%; width:36px; height:36px;
              cursor:pointer; font-size:1.1rem; color:#64748b; display:flex;
              align-items:center; justify-content:center;"
              onmouseover="this.style.background='#e2e8f0'"
              onmouseout="this.style.background='#f1f5f9'">✕</button>
          </div>
          <div style="position:relative;">
            <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:0.95rem; color:#94a3b8;">🔍</span>
            <input id="symptomSearch" type="text" placeholder="Search symptoms..."
              oninput="filterSymptoms()" style="
              width:100%; padding:10px 14px 10px 40px; border-radius:12px;
              border:2px solid #e2e8f0; font-size:0.9rem; outline:none;
              font-family:inherit; box-sizing:border-box;"
              onfocus="this.style.borderColor='#3b82f6'"
              onblur="this.style.borderColor='#e2e8f0'">
          </div>
        </div>
        <div id="selectedPills" style="
          padding:12px 28px; border-bottom:1px solid #f1f5f9;
          display:flex; flex-wrap:wrap; gap:8px; min-height:52px; align-items:center;">
          <span id="pillsPlaceholder" style="font-size:0.82rem; color:#94a3b8;">No symptoms selected yet.</span>
        </div>
        <div id="symptomGrid" style="
          padding:16px 28px; overflow-y:auto; flex:1;
          display:flex; flex-wrap:wrap; gap:8px; align-content:flex-start;">
        </div>
        <div style="
          padding:16px 28px; border-top:1px solid #f1f5f9;
          display:flex; justify-content:space-between; align-items:center; background:#fafafa;">
          <span id="selectedCount" style="font-size:0.85rem; color:#64748b; font-weight:600;">0 symptoms selected</span>
          <div style="display:flex; gap:10px;">
            <button onclick="clearSymptoms()" style="
              padding:9px 18px; border-radius:10px; border:2px solid #e2e8f0;
              background:white; cursor:pointer; font-size:0.85rem; font-weight:600;
              color:#64748b; font-family:inherit;"
              onmouseover="this.style.borderColor='#cbd5e1'"
              onmouseout="this.style.borderColor='#e2e8f0'">Clear All</button>
            <button onclick="applySymptoms()" style="
              padding:9px 20px; border-radius:10px; border:none;
              background:#3b82f6; color:white; cursor:pointer;
              font-size:0.85rem; font-weight:600; font-family:inherit;"
              onmouseover="this.style.background='#1d4ed8'"
              onmouseout="this.style.background='#3b82f6'">Analyze Now →</button>
          </div>
        </div>
      </div>
    </div>
  `);
  renderSymptomGrid(ALL_SYMPTOMS);
}

function renderSymptomGrid(list) {
  const grid = document.getElementById('symptomGrid');
  if (!grid) return;
  grid.innerHTML = list.length === 0
    ? `<p style="color:#94a3b8; font-size:0.9rem;">No symptoms found.</p>`
    : list.map(s => {
        const active = selectedSymptoms.has(s);
        return `<button onclick="toggleSymptom('${s}')" data-symptom="${s}" style="
          padding:7px 14px; border-radius:20px; cursor:pointer; font-size:0.8rem;
          font-weight:500; font-family:inherit; transition:all 0.18s;
          border:2px solid ${active ? '#3b82f6' : '#e2e8f0'};
          background:${active ? '#eff6ff' : 'white'};
          color:${active ? '#1d4ed8' : '#475569'};">
          ${active ? '✓ ' : ''}${formatLabel(s)}
        </button>`;
      }).join('');
}

function toggleSymptom(s) {
  selectedSymptoms.has(s) ? selectedSymptoms.delete(s) : selectedSymptoms.add(s);
  updateSelectedPills();
  const btn = document.querySelector(`[data-symptom="${s}"]`);
  if (btn) {
    const active = selectedSymptoms.has(s);
    btn.style.border = `2px solid ${active ? '#3b82f6' : '#e2e8f0'}`;
    btn.style.background = active ? '#eff6ff' : 'white';
    btn.style.color = active ? '#1d4ed8' : '#475569';
    btn.innerHTML = `${active ? '✓ ' : ''}${formatLabel(s)}`;
  }
}

function updateSelectedPills() {
  const container = document.getElementById('selectedPills');
  const placeholder = document.getElementById('pillsPlaceholder');
  const counter = document.getElementById('selectedCount');
  if (!container) return;
  const arr = [...selectedSymptoms];
  counter.textContent = `${arr.length} symptom${arr.length !== 1 ? 's' : ''} selected`;
  if (arr.length === 0) {
    placeholder.style.display = 'inline';
    container.querySelectorAll('.pill').forEach(p => p.remove());
    return;
  }
  placeholder.style.display = 'none';
  container.querySelectorAll('.pill').forEach(p => p.remove());
  arr.forEach(s => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.style.cssText = `display:inline-flex; align-items:center; gap:5px;
      padding:4px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;
      background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe;`;
    pill.innerHTML = `${formatLabel(s)} <span onclick="toggleSymptom('${s}')" style="cursor:pointer; font-size:0.9rem; opacity:0.6;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">✕</span>`;
    container.appendChild(pill);
  });
}

function filterSymptoms() {
  const q = document.getElementById('symptomSearch').value.toLowerCase().replace(/\s/g, '_');
  renderSymptomGrid(ALL_SYMPTOMS.filter(s => s.includes(q)));
}

function openSymptomPicker() {
  injectSymptomModal();
  document.getElementById('symptomModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('symptomSearch')?.focus(), 100);
}

function closeModal() {
  const modal = document.getElementById('symptomModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function closeSymptomPicker(e) {
  if (e.target.id === 'symptomModal') closeModal();
}

function clearSymptoms() {
  selectedSymptoms.clear();
  updateSelectedPills();
  renderSymptomGrid(ALL_SYMPTOMS);
}

function applySymptoms() {
  if (selectedSymptoms.size === 0) { alert('Please select at least one symptom!'); return; }
  const input = document.getElementById('mainSearch');
  if (input) input.value = [...selectedSymptoms].join(', ');
  closeModal();
  handleSearch();
}

// Tutup modal dengan ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─────────────────────────────────────────────
// MAIN SEARCH HANDLER
// ─────────────────────────────────────────────
async function handleSearch() {
    const input = document.getElementById('mainSearch').value.trim();
    const resultDiv = document.getElementById('searchResult');

    if (!input) {
        resultDiv.innerHTML = `<p style="color:#ef4444;">Please enter your symptoms first.</p>`;
        return;
    }

    // Loading state
    resultDiv.innerHTML = `<span style="display:inline-block; animation:pulse 1.5s infinite; color:var(--text-light);">
        Analyzing "<strong>${input}</strong>" using AI...</span>`;

    // Parse input: pisahkan per koma
    const symptoms = input.split(/[,]+/).map(s => s.trim().replace(/\s+/g, '_').toLowerCase()).filter(Boolean);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                symptoms: symptoms,
                model: "lr_tfidf",
                top_n: 3
            })
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();

        // Render hasil prediksi
        const top1 = data.top_predictions[0];
        const othersHTML = data.top_predictions.slice(1).map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-top:1px solid #f1f5f9;">
                <span style="font-size:0.85rem; color:var(--text-light);">${p.disease}</span>
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-light);">${p.confidence}%</span>
            </div>
        `).join('');

        resultDiv.innerHTML = `
            <div style="background:white; padding:20px; border-radius:12px; border-left:4px solid var(--primary); box-shadow:var(--shadow); margin-top:15px; text-align:left;">
                <h4 style="margin-bottom:15px; font-size:1rem; color:var(--text-light);">AI Diagnosis Result</h4>

                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px; font-weight:600;">
                        <span style="color:var(--text-dark); font-size:1rem;">${top1.disease}</span>
                        <span style="color:var(--primary);">${top1.confidence}%</span>
                    </div>
                    <div style="width:100%; height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
                        <div style="width:${top1.confidence}%; height:100%; background:var(--primary); border-radius:10px; transition:width 1s ease-in-out;"></div>
                    </div>
                </div>

                <p style="font-size:0.8rem; color:var(--text-light); font-weight:600; margin-bottom:5px;">OTHER POSSIBILITIES</p>
                ${othersHTML}

                <p style="font-size:0.75rem; color:#94a3b8; margin-top:15px;">
                    ⚠️ This is an AI prediction, not a medical diagnosis. Please consult a doctor.
                </p>

                <a href="loqin.html" class="btn btn-outline" style="display:inline-block; padding:8px 15px; font-size:0.85rem; margin-top:10px; text-decoration:none;">
                    Log in to Save Result
                </a>
            </div>
        `;
        resultDiv.classList.add('animate-up');

        // ── Fetch rekomendasi (top1 sudah tersedia di sini) ──
        try {
            const recRes = await fetch(`${API_URL}/recommend/${encodeURIComponent(top1.disease)}`);
            if (recRes.ok) {
                const rec = await recRes.json();
                const precHTML = rec.precautions.map(p => `<li>${p}</li>`).join('');
                const severityColor = rec.severity_label === 'Mild'     ? '#10b981'
                                    : rec.severity_label === 'Moderate' ? '#f59e0b'
                                    : '#ef4444';

                resultDiv.innerHTML += `
                    <div style="background:white; padding:20px; border-radius:12px;
                        border-left:4px solid ${severityColor}; box-shadow:var(--shadow);
                        margin-top:12px; text-align:left;">
                        <h4 style="margin-bottom:10px; font-size:1rem; color:var(--text-dark);">
                            📋 About ${rec.disease}
                        </h4>
                        <p style="font-size:0.85rem; color:var(--text-light); margin-bottom:12px;">
                            ${rec.description}
                        </p>
                        <span style="background:${severityColor}20; color:${severityColor};
                            padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">
                            ${rec.severity_label} Severity
                        </span>
                        <p style="font-size:0.82rem; font-weight:600; color:var(--text-dark);
                            margin:12px 0 6px;">🛡️ Precautions:</p>
                        <ul style="margin-left:18px; font-size:0.82rem; color:var(--text-light); line-height:1.8;">
                            ${precHTML}
                        </ul>
                    </div>
                `;
            }
        } catch (recErr) {
            // Rekomendasi gagal — prediksi utama tetap tampil normal
            console.warn('Recommendation not available:', recErr.message);
        }

    } catch (err) {
        resultDiv.innerHTML = `
            <div style="background:#fef2f2; padding:15px; border-radius:12px; border-left:4px solid #ef4444; margin-top:15px;">
                <p style="color:#ef4444; font-size:0.9rem;">❌ Could not connect to AI server. Make sure the backend is running.</p>
                <p style="color:#94a3b8; font-size:0.8rem; margin-top:5px;">Error: ${err.message}</p>
            </div>`;
    }
}

// ─────────────────────────────────────────────
// AUTH HANDLER — Login & Register
// ─────────────────────────────────────────────
function handleAuth(event) {
    event.preventDefault();
    const passwordInputs = event.target.querySelectorAll('input[type="password"]');
    if (passwordInputs.length > 0) {
        if (passwordInputs[0].value.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }
    }
    window.location.href = "dashboard.html";
}

// ─────────────────────────────────────────────
// SCROLL ANIMATION
// ─────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-up');
    });
});
document.querySelectorAll('.stat-card, header > div').forEach(el => observer.observe(el));