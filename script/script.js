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
    <div id="symptomModal" onclick="closeSymptomPickerOnBackdrop(event)" style="
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
            <button onclick="closeSymptomModal()" style="
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

// BUG FIX #1: Pisahkan closeModal menjadi closeSymptomModal dan closeProductModal
// agar tidak saling overwrite satu sama lain.

function closeSymptomModal() {
  const modal = document.getElementById('symptomModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// BUG FIX #2: Ganti nama fungsi backdrop symptom agar tidak konflik.
function closeSymptomPickerOnBackdrop(e) {
  if (e.target.id === 'symptomModal') closeSymptomModal();
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
  closeSymptomModal();
  handleSearch();
}

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

    // Simpan status login ke localStorage
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value : "user@example.com";
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    window.location.href = "dashboard.html";
}

// Fungsi logout — panggil saat tombol Log Out diklik
function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.href = "index.html";
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

// ─────────────────────────────────────────────
// HEALTH STORE — PRODUCT INFO MODAL
// ─────────────────────────────────────────────
const PRODUCT_DATA = {
  'weight-dv': {
    badge:'Weight Management', name:'DV Weight Loss for Women',
    komposisi:'Green tea extract 400mg, Garcinia cambogia 200mg, L-carnitine 150mg, Vitamin B6 2mg, Chromium 100mcg',
    indikasi:'Mendukung penurunan berat badan pada wanita dewasa, membantu metabolisme lemak dan kontrol nafsu makan',
    dosis:'2 kapsul per hari',
    aturan:'Diminum pagi hari sebelum makan bersama segelas air putih. Tidak dianjurkan dikonsumsi malam hari karena mengandung kafein',
    alternatif:'Nutri Shake (meal replacement), Lean Shake Burn (thermogenic)',
    efek:'Insomnia, peningkatan detak jantung, mual, sakit kepala ringan pada pengguna sensitif kafein'
  },
  'weight-nutrishake': {
    badge:'Weight Management', name:'Nutri Shake',
    komposisi:'Whey protein isolat 20g, Serat psyllium 5g, MCT oil 3g, Vitamin & mineral mix, Stevia',
    indikasi:'Pengganti makan untuk manajemen kalori, mendukung rasa kenyang lebih lama dan asupan nutrisi harian',
    dosis:'1 sachet (50g) dicampur 250ml air atau susu rendah lemak',
    aturan:'Gunakan sebagai pengganti sarapan atau makan siang. Tidak disarankan mengganti lebih dari 2 kali makan per hari',
    alternatif:'DV Weight Loss (suplemen), Lean Shake Burn (protein tinggi)',
    efek:'Kembung, gas berlebih pada minggu pertama penggunaan, kemungkinan alergi laktosa'
  },
  'weight-lean': {
    badge:'Weight Management', name:'Lean Shake Burn',
    komposisi:'Whey protein concentrate 25g, CLA 500mg, Green coffee extract 200mg, L-theanine 100mg, Vitamin B complex',
    indikasi:'Mendukung komposisi tubuh lean, meningkatkan metabolisme basal saat program latihan fisik intensif',
    dosis:'1 scoop (40g) per sajian, maksimal 2 sajian per hari',
    aturan:'Konsumsi 30 menit sebelum latihan atau sebagai sarapan. Hindari penggunaan >2x/hari atau bersamaan dengan stimulan lain',
    alternatif:'Nutri Shake (untuk non-atlet), 100% Pure Whey Protein (tanpa thermogenic)',
    efek:'Peningkatan suhu tubuh, keringat berlebih, tremor ringan, tidak cocok untuk penderita hipertensi'
  },
  'med-theraflu': {
    badge:'Medications', name:'Theraflu-D Nighttime Severe Cold',
    komposisi:'Acetaminophen 650mg, Diphenhydramine HCl 25mg, Phenylephrine HCl 10mg per dosis',
    indikasi:'Meredakan gejala flu berat malam hari: demam, nyeri tubuh, hidung tersumbat, bersin, dan batuk',
    dosis:'Dewasa dan anak >12 tahun: 1 sachet dilarutkan dalam 240ml air panas, setiap 4 jam, maks. 5 sachet/24 jam',
    aturan:'Minum menjelang tidur. Jangan mengemudi setelah konsumsi. Tidak boleh dikombinasikan dengan obat lain yang mengandung acetaminophen atau antihistamin',
    alternatif:'Paracetamol + CTM (lebih terjangkau), Mucinex DM (tanpa antihistamin)',
    efek:'Kantuk, mulut kering, retensi urin, konstipasi, peningkatan tekanan darah. Overdosis acetaminophen berbahaya bagi hati'
  },
  'med-gaviscon': {
    badge:'Medications', name:'Gaviscon',
    komposisi:'Sodium alginate 500mg, Sodium bicarbonate 267mg, Calcium carbonate 160mg per 10ml',
    indikasi:'Meredakan heartburn, refluks asam lambung (GERD), dan rasa tidak nyaman di dada setelah makan',
    dosis:'Dewasa: 10–20ml (2–4 sendok teh) setelah makan dan sebelum tidur, maks. 4 kali/hari',
    aturan:'Kocok sebelum digunakan. Minum segera setelah makan atau saat gejala muncul. Jangan melebihi dosis yang dianjurkan',
    alternatif:'Antasida (Mylanta, Promag) untuk gejala ringan, Omeprazole (PPI) untuk GERD kronis',
    efek:'Perut kembung, mual ringan. Kandungan natrium tinggi — hati-hati pada pasien hipertensi atau diet rendah garam'
  },
  'med-mucinex': {
    badge:'Medications', name:'Mucinex DM Extended Release',
    komposisi:'Guaifenesin 600mg + Dextromethorphan HBr 30mg (extended release)',
    indikasi:'Mengencerkan dahak pada batuk produktif dan menekan batuk kering akibat infeksi saluran napas atas',
    dosis:'Dewasa & anak >12 tahun: 1–2 tablet setiap 12 jam, maks. 4 tablet/24 jam',
    aturan:'Telan utuh, jangan dikunyah atau dibelah. Minum dengan banyak air putih. Hindari alkohol selama konsumsi',
    alternatif:'OBH Combi (sirup ekspektoran), Bisolvon (ambroxol) untuk pengenceran dahak saja',
    efek:'Mual, pusing, kantuk ringan. Dextromethorphan dapat menyebabkan efek disosiatif jika overdosis'
  },
  'mental-moodjoy': {
    badge:'Mental Health', name:'Bio Nutrition Mood Joy',
    komposisi:'5-HTP 50mg, St. John\'s Wort 300mg, Ashwagandha 200mg, L-theanine 100mg, Vitamin B12 500mcg',
    indikasi:'Mendukung keseimbangan emosional, mengurangi stres ringan-sedang, dan meningkatkan suasana hati secara alami',
    dosis:'1 kapsul, 2 kali sehari',
    aturan:'Minum pagi dan siang setelah makan. Dibutuhkan 2–4 minggu untuk efek optimal. TIDAK boleh dikombinasikan dengan antidepresan (SSRI/MAOI)',
    alternatif:'Sleep Formula 5-HTP (untuk masalah tidur), Moringa Pure (untuk energi umum)',
    efek:'Mual, diare ringan, sakit kepala. St. John\'s Wort dapat mengurangi efektivitas kontrasepsi oral dan obat HIV'
  },
  'mental-moringa': {
    badge:'Mental Health', name:'BioPro Wellness Moringa Pure 2400',
    komposisi:'Moringa oleifera leaf extract 2400mg, Vitamin A 500IU, Vitamin C 40mg, Iron 2mg, Calcium 100mg',
    indikasi:'Meningkatkan energi dan kejernihan mental, mendukung sistem imun, sumber antioksidan alami harian',
    dosis:'2 kapsul per hari',
    aturan:'Minum pagi hari setelah sarapan. Dapat dikonsumsi jangka panjang sebagai suplemen nutrisi harian',
    alternatif:'Spirulina (antioksidan serupa), Multivitamin Naturelo (lebih lengkap)',
    efek:'Umumnya aman. Konsumsi berlebihan dapat menyebabkan diare. Hindari dosis tinggi pada ibu hamil (efek uterotonik pada dosis sangat tinggi)'
  },
  'mental-sleep': {
    badge:'Mental Health', name:'Sleep Formula 5-HTP',
    komposisi:'5-HTP (Griffonia simplicifolia) 100mg, Melatonin 1mg, Magnesium glycinate 200mg, L-theanine 150mg',
    indikasi:'Mendukung kualitas tidur, mempersingkat waktu onset tidur, mengurangi kecemasan menjelang tidur',
    dosis:'1 kapsul, 30–60 menit sebelum tidur',
    aturan:'Hanya dikonsumsi malam hari. Mulai dengan 1 kapsul. Hindari bersamaan dengan alkohol atau obat penenang. TIDAK boleh dikombinasikan dengan antidepresan',
    alternatif:'Melatonin saja (dosis lebih rendah), Bio Nutrition Mood Joy (untuk stres siang hari)',
    efek:'Kantuk berlebih keesokan hari (jika dosis terlalu tinggi), mimpi vivid, mual ringan, sakit kepala'
  },
  'vit-naturelo': {
    badge:'Vitamins', name:'Naturelo One Daily Multivitamin',
    komposisi:'Vitamin A, C, D3, E, K2, B-complex, Folate, Biotin, Zinc, Selenium, Magnesium, Iodine — semua berbasis whole-food',
    indikasi:'Memenuhi kebutuhan vitamin dan mineral harian, mencegah defisiensi nutrisi, mendukung energi dan imunitas',
    dosis:'1 kapsul per hari',
    aturan:'Konsumsi setelah makan terbesar dalam sehari untuk penyerapan optimal. Tidak perlu dikonsumsi bersama suplemen vitamin lain',
    alternatif:'Solgar Vitamin D3 (jika hanya butuh D3), XXL Omega-3 (untuk kesehatan jantung spesifik)',
    efek:'Urine berwarna kuning cerah (normal, dari riboflavin), mual jika dikonsumsi perut kosong. Jarang terjadi reaksi alergi'
  },
  'vit-omega3': {
    badge:'Vitamins', name:'XXL Nutrition Omega 3',
    komposisi:'Fish oil 1000mg (EPA 180mg + DHA 120mg per softgel), Vitamin E 5IU sebagai antioksidan',
    indikasi:'Mendukung kesehatan kardiovaskular, fungsi otak dan memori, mengurangi inflamasi, kesehatan sendi',
    dosis:'2–3 softgel per hari',
    aturan:'Minum bersama makanan untuk mengurangi mual. Simpan di tempat sejuk. Pasien dengan pengencer darah harus konsultasi dokter',
    alternatif:'Flaxseed oil (vegan), Krill oil (bioavailabilitas lebih tinggi), Nordic Naturals Omega-3',
    efek:'Bau ikan pada napas/sendawa, diare dosis tinggi, dapat meningkatkan risiko perdarahan pada dosis >3g/hari'
  },
  'vit-d3': {
    badge:'Vitamins', name:'Solgar Vitamin D3 2000 IU',
    komposisi:'Cholecalciferol (Vitamin D3) 2000 IU (50mcg) dalam minyak olive oil sebagai carrier',
    indikasi:'Mencegah dan mengatasi defisiensi Vitamin D, mendukung kepadatan tulang, imunitas, dan metabolisme kalsium',
    dosis:'1 softgel per hari, atau sesuai anjuran dokter berdasarkan hasil tes darah 25(OH)D',
    aturan:'Konsumsi bersama makanan berlemak untuk penyerapan optimal. Cek kadar vitamin D secara berkala saat konsumsi rutin',
    alternatif:'Vitamin D3 + K2 combo (untuk kesehatan tulang optimal), Naturelo Multivitamin (sudah mengandung D3)',
    efek:'Jarang pada dosis 2000 IU. Overdosis kronis (>10.000 IU/hari) dapat menyebabkan hiperkalsemia, mual, lemah otot'
  },
  'immune-canprev': {
    badge:'Oncology & Immune', name:'CanPrev Pro-Biotik',
    komposisi:'10 strain probiotik 25 Billion CFU (Lactobacillus acidophilus, Bifidobacterium longum, dll.), FOS prebiotic 100mg',
    indikasi:'Menjaga keseimbangan mikrobioma usus selama terapi, mendukung imunitas mukosa, mengurangi diare akibat antibiotik/kemoterapi',
    dosis:'1 kapsul per hari',
    aturan:'Simpan di kulkas setelah dibuka. Minum 2 jam setelah antibiotik (jangan bersamaan). Konsumsi sebelum makan',
    alternatif:'Lacto-B (probiotik dasar), Biokul (yogurt probiotik alami), Enterogermina',
    efek:'Kembung dan gas pada minggu pertama (normal). Pada pasien immunocompromised berat — konsultasi dokter sebelum konsumsi'
  },
  'immune-progressive': {
    badge:'Oncology & Immune', name:'Progressive Immuno Daily Support',
    komposisi:'Vitamin C 500mg, Vitamin D3 1000 IU, Zinc 15mg, Selenium 100mcg, Elderberry extract 300mg, Echinacea 200mg',
    indikasi:'Dukungan imunologi harian untuk pasien dalam perawatan jangka panjang, pemulihan pasca-penyakit serius',
    dosis:'2 kapsul per hari',
    aturan:'Minum pagi hari setelah makan. Untuk pasien kemoterapi — gunakan hanya atas rekomendasi oncologist (beberapa antioksidan dapat mengganggu terapi)',
    alternatif:'CanPrev Pro-Biotik (fokus gut immunity), Promera Immune Support (dengan colostrum)',
    efek:'Umumnya aman. Echinacea tidak direkomendasikan untuk penyakit autoimun. Zinc dosis tinggi jangka panjang dapat mengganggu absorpsi tembaga'
  },
  'immune-promera': {
    badge:'Oncology & Immune', name:'Promera Health Immune Support',
    komposisi:'Bovine colostrum 500mg, IgG concentrate 200mg, Lactoferrin 100mg, Vitamin C 250mg, Zinc 10mg',
    indikasi:'Mendukung pertahanan imun selama masa pemulihan, meningkatkan kadar imunoglobulin, integritas lapisan usus',
    dosis:'2 kapsul, 2 kali sehari',
    aturan:'Minum 30 menit sebelum makan di pagi dan sore hari. Hindari konsumsi bersamaan dengan susu pasteurisasi panas',
    alternatif:'Progressive Immuno (tanpa produk susu), CanPrev Pro-Biotik (untuk masalah usus)',
    efek:'Kemungkinan reaksi pada alergi susu sapi, kembung ringan. Tidak cocok untuk vegan/vegetarian'
  },
  'sport-whey': {
    badge:'Sport & Fitness', name:'100% Pure Whey Protein',
    komposisi:'Whey protein concentrate 80% — 24g protein per scoop, BCAA alami ~5g, Glutamine ~4g, Laktosa <5%',
    indikasi:'Mendukung pemulihan dan pertumbuhan otot pasca latihan, memenuhi kebutuhan protein harian atlet',
    dosis:'1–2 scoop (25–50g) per hari',
    aturan:'Konsumsi dalam 30 menit setelah latihan dicampur 200–300ml air dingin atau susu. Tidak menggantikan makanan utuh',
    alternatif:'Whey Isolate (untuk intoleransi laktosa), Plant-based protein (untuk vegan), Creatine (untuk kekuatan)',
    efek:'Kembung/gas pada sensitif laktosa, jerawat (pada sebagian pengguna), tekanan ginjal jika konsumsi berlebihan tanpa cukup air'
  },
  'sport-nitric': {
    badge:'Sport & Fitness', name:'Nitric Boost Ultra',
    komposisi:'L-Citrulline 3g, L-Arginine 2g, Beetroot extract 500mg, Vitamin B3 (Niacin) 20mg, Magnesium 100mg',
    indikasi:'Meningkatkan produksi nitric oxide untuk aliran darah, performa latihan, dan "pump" otot saat olahraga',
    dosis:'1 serving (1 scoop) 30 menit sebelum latihan',
    aturan:'Jangan dikonsumsi bersamaan dengan obat hipotensi atau Viagra/sildenafil. Tidak untuk penggunaan sehari-hari tanpa olahraga',
    alternatif:'Pre-workout dengan kafein (lebih stimulan), Creatine (untuk kekuatan murni), Beetroot juice alami',
    efek:'Penurunan tekanan darah, kemerahan kulit (dari niacin), sakit kepala, gangguan pencernaan ringan'
  },
  'sport-creatine': {
    badge:'Sport & Fitness', name:'Creatine Monohydrate Pure Powder',
    komposisi:'Creatine monohydrate 100% micronized, 5g per serving. Tanpa tambahan apapun',
    indikasi:'Meningkatkan kekuatan dan output tenaga pada latihan intensitas tinggi, mempercepat pemulihan antar set',
    dosis:'Loading phase: 20g/hari (4x5g) selama 5–7 hari. Maintenance: 3–5g/hari',
    aturan:'Larutkan dalam air atau minuman karbohidrat. Minum banyak air (minimal 3L/hari). Aman dikonsumsi jangka panjang tanpa cycling',
    alternatif:'Creatine HCl (lebih larut, dosis kecil), Nitric Boost (untuk pump), Beta-alanine (untuk endurance)',
    efek:'Peningkatan berat badan 1–2kg dari retensi air (normal), kram ringan jika kurang minum. Aman untuk ginjal sehat'
  },
  'routine-diabetes': {
    badge:'Routine Medication', name:'Nature Made Diabetes Health Pack',
    komposisi:'Alpha lipoic acid 200mg, Chromium picolinate 200mcg, Magnesium 250mg, Vitamin D3 1000IU, Omega-3 1000mg per pack',
    indikasi:'Mendukung metabolisme glukosa, sensitivitas insulin, kesehatan saraf perifer, dan komplikasi diabetes ringan',
    dosis:'1 pack (4 kapsul) per hari bersama makanan terbesar',
    aturan:'BUKAN pengganti obat diabetes dari dokter (Metformin/insulin). Gunakan sebagai terapi komplementer. Pantau gula darah secara rutin',
    alternatif:'Konsumsi masing-masing suplemen secara terpisah, Gymnema sylvestre herbal',
    efek:'Mual jika perut kosong. Alpha lipoic acid dapat menurunkan gula darah berlebih jika dikombinasikan dengan obat antidiabetes'
  },
  'routine-bp': {
    badge:'Routine Medication', name:'BPH Blood Pressure Health',
    komposisi:'Aged garlic extract 600mg, Hawthorn berry 300mg, CoQ10 100mg, Magnesium 150mg, Potassium 99mg',
    indikasi:'Mendukung tekanan darah dalam kisaran normal, kesehatan pembuluh darah, dan fungsi jantung',
    dosis:'2 kapsul per hari',
    aturan:'BUKAN pengganti obat antihipertensi dari dokter. Konsultasi dokter sebelum digunakan bersamaan dengan obat hipertensi. Pantau tekanan darah rutin',
    alternatif:'DASH diet supplement, Magnesium standalone, Hibiscus tea extract',
    efek:'Garlic extract dapat menyebabkan bau mulut/tubuh. Hawthorn dapat memperkuat efek obat jantung (digoxin). Jangan stop obat dokter tanpa konsultasi'
  },
  'routine-cholesterol': {
    badge:'Routine Medication', name:'Choles-T Cholesterol Support',
    komposisi:'Plant sterols 800mg, Psyllium husk 500mg, Red yeast rice 300mg, Niacin 20mg, CoQ10 50mg',
    indikasi:'Membantu menurunkan LDL kolesterol, meningkatkan HDL, mendukung kesehatan kardiovaskular',
    dosis:'2 kapsul, 2 kali sehari bersama makan',
    aturan:'Konsumsi bersama makanan berlemak untuk penyerapan plant sterol optimal. Red yeast rice mirip statin — TIDAK boleh dikombinasikan dengan obat statin dari dokter',
    alternatif:'Omega-3 (untuk trigliserida), Niacin standalone, Berberine (alternatif alami)',
    efek:'Red yeast rice dapat menyebabkan nyeri otot (miopati), kerusakan hati pada dosis tinggi — efek serupa statin. Cek enzim hati jika konsumsi >3 bulan'
  }
};

function openProductModal(id) {
  const p = PRODUCT_DATA[id];
  if (!p) return;
  document.getElementById('pm-badge').textContent = p.badge;
  document.getElementById('pm-name').textContent = p.name;
  document.getElementById('pm-komposisi').textContent = p.komposisi;
  document.getElementById('pm-indikasi').textContent = p.indikasi;
  document.getElementById('pm-dosis').textContent = p.dosis;
  document.getElementById('pm-aturan').textContent = p.aturan;
  document.getElementById('pm-alternatif').textContent = p.alternatif;
  document.getElementById('pm-efek').textContent = p.efek;
  const modal = document.getElementById('productModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// BUG FIX #3: closeProductModal sekarang punya fungsi closenya sendiri
// dan memeriksa e.target dengan benar sebelum menutup modal.
function closeProductModal(e) {
  if (e && e.target.id !== 'productModal') return;
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// BUG FIX #4: Satu event listener ESC terpadu untuk menutup modal manapun yang sedang terbuka.
// Menggantikan dua addEventListener('keydown') yang duplikat di kode asli.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const symptomModal = document.getElementById('symptomModal');
    const productModal = document.getElementById('productModal');
    if (symptomModal && symptomModal.style.display === 'flex') closeSymptomModal();
    if (productModal && productModal.style.display === 'flex') closeProductModal(null);
  }
});