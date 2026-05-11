// Function to handle the search button click
function handleSearch() {
    const input = document.getElementById('mainSearch').value;
    const resultDiv = document.getElementById('searchResult');

    // Validation if input is empty
    if (input.trim() === "") {
        resultDiv.style.color = "#ef4444"; 
        resultDiv.innerText = "Please enter your symptoms first.";
        return;
    }

    // Loading State
    resultDiv.style.color = "var(--text-dark)";
    resultDiv.innerHTML = `<span style="display: inline-block; animation: pulse 1.5s infinite;">Analyzing "${input}" using AI...</span>`;
    
    // Simulate AI response with Confidence Score and Medicine List
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid var(--primary); box-shadow: var(--shadow); margin-top: 20px; text-align: left;">
                <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--text-dark);">AI Diagnosis Overview</h4>
                
                <!-- Progress Bar / Confidence Score -->
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;">
                        <span style="color: var(--text-light);">Confidence Score</span>
                        <span style="color: var(--primary);">88%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 10px; overflow: hidden;">
                        <div style="width: 88%; height: 100%; background: var(--primary); border-radius: 10px; transition: width 1s ease-in-out;"></div>
                    </div>
                </div>

                <p style="font-size: 0.95rem; margin-bottom: 10px; color: var(--text-dark);">Based on the symptoms, we recommend getting plenty of rest and staying hydrated.</p>
                
                <!-- Recommendation List -->
                <strong style="font-size: 0.9rem; color: var(--text-dark);">Recommended Action:</strong>
                <ul style="margin-left: 20px; margin-top: 5px; margin-bottom: 15px; font-size: 0.9rem; color: var(--text-light);">
                    <li>Take Paracetamol (for fever relief)</li>
                    <li>Consume Vitamin C supplements</li>
                </ul>

                <!-- Tautan sudah diamankan ke loqin.html -->
                <a href="loqin.html" class="btn btn-outline" style="display: inline-block; padding: 8px 15px; font-size: 0.85rem; text-decoration: none;">Log in to Save Result</a>
            </div>
        `;
        resultDiv.classList.add('animate-up');
    }, 1500);
}

// Function to handle Login/Register form submission
function handleAuth(event) {
    event.preventDefault(); 
    
    // Ambil semua input password di form yang sedang disubmit
    const passwordInputs = event.target.querySelectorAll('input[type="password"]');
    
    // Simple Validation: Cek jika ada input password dan panjangnya kurang dari 8
    if (passwordInputs.length > 0) {
        const password = passwordInputs[0].value;
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return; // Hentikan proses jika validasi gagal
        }
    }
    
    // Jika lolos validasi, arahkan ke dashboard
    window.location.href = "dashboard.html";
}

// Scroll animation observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-up');
        }
    });
});

document.querySelectorAll('.stat-card, header > div').forEach(el => observer.observe(el));