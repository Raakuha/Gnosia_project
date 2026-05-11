// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const API_URL = "http://127.0.0.1:8000";

// ─────────────────────────────────────────────
// MAIN SEARCH HANDLER — dipanggil dari index.html & dashboard.html
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

    // Parse input: pisahkan per koma atau spasi
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

        // Render hasil
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

                <!-- Prediksi Utama -->
                <div style="margin-bottom:15px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px; font-weight:600;">
                        <span style="color:var(--text-dark); font-size:1rem;">${top1.disease}</span>
                        <span style="color:var(--primary);">${top1.confidence}%</span>
                    </div>
                    <div style="width:100%; height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
                        <div style="width:${top1.confidence}%; height:100%; background:var(--primary); border-radius:10px; transition:width 1s ease-in-out;"></div>
                    </div>
                </div>

                <!-- Kemungkinan Lain -->
                <p style="font-size:0.8rem; color:var(--text-light); font-weight:600; margin-bottom:5px;">OTHER POSSIBILITIES</p>
                ${othersHTML}

                <!-- Disclaimer -->
                <p style="font-size:0.75rem; color:#94a3b8; margin-top:15px;">
                    ⚠️ This is an AI prediction, not a medical diagnosis. Please consult a doctor.
                </p>

                <a href="loqin.html" class="btn btn-outline" style="display:inline-block; padding:8px 15px; font-size:0.85rem; margin-top:10px; text-decoration:none;">
                    Log in to Save Result
                </a>
            </div>
        `;
        resultDiv.classList.add('animate-up');

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