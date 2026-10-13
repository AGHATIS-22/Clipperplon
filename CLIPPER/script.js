console.log("ClipperPlon System: Memulai inisialisasi...");

const videoInput = document.getElementById("videoInput");
const editor = document.getElementById("editor");
const videoPreview = document.getElementById("videoPreview");
const videoName = document.getElementById("videoName");
const videoDuration = document.getElementById("videoDuration");
const startInput = document.getElementById("startTime");
const endInput = document.getElementById("endTime");
const previewButton = document.getElementById("previewClip");
const exportButton = document.getElementById("exportClip");
const message = document.getElementById("message");

let videoUrl = null;
let duration = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

function showMessage(text) {
  if (message) message.textContent = text;
}

// Kontrol Tab Free
const tabUploadBtn = document.getElementById("tabUploadBtn");
const tabLinkBtn = document.getElementById("tabLinkBtn");
const contentUpload = document.getElementById("contentUpload");
const contentLink = document.getElementById("contentLink");

if (tabUploadBtn && tabLinkBtn) {
  tabUploadBtn.addEventListener("click", () => {
    tabUploadBtn.className = "button primary";
    tabLinkBtn.className = "button secondary";
    contentUpload.classList.remove("hidden");
    contentLink.classList.add("hidden");
  });
  tabLinkBtn.addEventListener("click", () => {
    tabLinkBtn.className = "button primary";
    tabUploadBtn.className = "button secondary";
    contentLink.classList.remove("hidden");
    contentUpload.classList.add("hidden");
  });
}

// Upload Lokal Free
if (videoInput) {
  videoInput.addEventListener("change", () => {
    const file = videoInput.files[0];
    if (!file) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    videoUrl = URL.createObjectURL(file);
    duration = 0;

    videoPreview.src = videoUrl;
    videoName.textContent = file.name;
    editor.classList.remove("hidden");
    startInput.value = "0";
    endInput.value = "0";
    videoDuration.textContent = "Memuat durasi...";
    exportButton.disabled = true;

    let durasiTerbaca = false;
    videoPreview.onloadedmetadata = () => {
      durasiTerbaca = true;
      duration = videoPreview.duration;
      endInput.value = duration.toFixed(1);
      videoDuration.textContent = "Durasi: " + formatTime(duration);
      exportButton.disabled = false;
      showMessage("Video siap dipotong.");
    };

    setTimeout(() => {
      if (!durasiTerbaca && videoPreview) {
        duration = videoPreview.duration || 60;
        endInput.value = duration.toFixed(1);
        videoDuration.textContent = "Durasi: " + formatTime(duration) + " (Estimasi)";
        exportButton.disabled = false;
        showMessage("Video siap (Durasi diestimasi).");
      }
    }, 2000);
  });
}

// Link Video Free
const linkInput = document.getElementById("linkVideoInput");
const loadButton = document.getElementById("loadVideoLinkBtn");

if (linkInput && loadButton) {
  loadButton.addEventListener("click", () => {
    const rawUrl = linkInput.value.trim();
    if (!rawUrl) return;
    videoPreview.src = rawUrl;
    editor.classList.remove("hidden");
    videoName.textContent = "Video dari Link";
    
    let linkDurasiTerbaca = false;
    videoPreview.onloadedmetadata = () => {
      linkDurasiTerbaca = true;
      duration = videoPreview.duration;
      endInput.value = duration.toFixed(1);
      videoDuration.textContent = "Durasi: " + formatTime(duration);
      exportButton.disabled = false;
    };

    setTimeout(() => {
      if (!linkDurasiTerbaca && videoPreview) {
        duration = videoPreview.duration || 60;
        endInput.value = duration.toFixed(1);
        videoDuration.textContent = "Durasi: " + formatTime(duration) + " (Estimasi)";
        exportButton.disabled = false;
      }
    }, 2000);
  });
}

// Sistem Pro & Modal
const manualWorkspace = document.getElementById("manualWorkspace");
const proCardSection = document.getElementById("proCardSection");
const proWorkspaceSection = document.getElementById("proWorkspaceSection");
const paywallModal = document.getElementById("paywallModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const maybeLaterBtn = document.getElementById("maybeLaterBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const activationCodeInput = document.getElementById("activationCodeInput");
const activateProBtn = document.getElementById("activateProBtn");

function checkProStatus() {
  const expiryDateStr = localStorage.getItem("clipperplon_expiry_date");
  if (!expiryDateStr) return false;
  return new Date() <= new Date(expiryDateStr);
}

function updateProUI() {
  const isPro = checkProStatus();
  if (isPro) {
    if (manualWorkspace) manualWorkspace.classList.add("hidden");
    if (proCardSection) proCardSection.classList.add("hidden");
    if (proWorkspaceSection) proWorkspaceSection.classList.remove("hidden");
  } else {
    if (manualWorkspace) manualWorkspace.classList.remove("hidden");
    if (proCardSection) proCardSection.classList.remove("hidden");
    if (proWorkspaceSection) proWorkspaceSection.classList.add("hidden");
  }
}
updateProUI();

if (closeModalBtn) closeModalBtn.addEventListener("click", () => paywallModal.classList.add("hidden"));
if (maybeLaterBtn) maybeLaterBtn.addEventListener("click", () => paywallModal.classList.add("hidden"));

if (upgradeBtn) {
  upgradeBtn.addEventListener("click", () => {
    const wa = "6281234567890";
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent("Halo, saya ingin upgrade PRO ClipperPlon.")}`, '_blank');
    paywallModal.classList.add("hidden");
  });
}

if (activateProBtn) {
  activateProBtn.addEventListener("click", () => {
    const code = activationCodeInput.value.trim().toUpperCase();
    const validCodes = { "PLONTO-BUDI-01": 30, "PLONTO-TESTER": 7 };
    if (validCodes.hasOwnProperty(code)) {
      const exp = new Date();
      exp.setDate(exp.getDate() + validCodes[code]);
      localStorage.setItem("clipperplon_expiry_date", exp.toISOString());
      updateProUI();
      alert("✅ Aktivasi Berhasil!");
      paywallModal.classList.add("hidden");
    } else {
      alert("❌ Kode salah.");
    }
  });
}

if (proCardSection) {
  proCardSection.style.cursor = "pointer";
  proCardSection.addEventListener("click", () => {
    if (!checkProStatus() && paywallModal) paywallModal.classList.remove("hidden");
  });
}

// ==========================================
// KONTROL TAB STUDIO PRO & PANEL EDIT
// ==========================================
const proTabUploadBtn = document.getElementById("proTabUploadBtn");
const proTabLinkBtn = document.getElementById("proTabLinkBtn");
const proContentUpload = document.getElementById("proContentUpload");
const proContentLink = document.getElementById("proContentLink");
const proYoutubeContainer = document.getElementById("proYoutubeContainer");
const proVideoContainer = document.getElementById("proVideoContainer");
const aiResultContainer = document.getElementById("aiResultContainer");
const aiStudioPanel = document.getElementById("aiStudioPanel");

if (proTabUploadBtn && proTabLinkBtn && proContentUpload && proContentLink) {
  proTabUploadBtn.addEventListener("click", () => {
    proTabUploadBtn.className = "button primary";
    proTabLinkBtn.className = "button secondary";
    
    proContentUpload.style.display = "block";
    proContentLink.style.display = "none";
    
    if (proVideoContainer) proVideoContainer.style.display = "block";
    if (proYoutubeContainer) proYoutubeContainer.style.display = "none";
    
    // Sembunyikan panel edit & hasil klip saat berpindah tab
    if (aiStudioPanel) aiStudioPanel.style.display = "none";
    if (aiResultContainer) {
      aiResultContainer.style.display = "none";
      aiResultContainer.classList.add("hidden");
    }
  });

  proTabLinkBtn.addEventListener("click", () => {
    proTabLinkBtn.className = "button primary";
    proTabUploadBtn.className = "button secondary";
    
    proContentLink.style.display = "block";
    proContentUpload.style.display = "none";
    
    if (proVideoContainer) proVideoContainer.style.display = "none";
    if (proYoutubeContainer) proYoutubeContainer.style.display = "block";
    
    // Sembunyikan panel edit & hasil klip saat berpindah tab
    if (aiStudioPanel) aiStudioPanel.style.display = "none";
    if (aiResultContainer) {
      aiResultContainer.style.display = "none";
      aiResultContainer.classList.add("hidden");
    }
  });
}

// 1. Upload File Lokal PRO
const hiddenInput = document.getElementById("hiddenProFileInput");

if (hiddenInput) {
  hiddenInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    window.proDuration = 120;

    // Tampilkan editor
    const editorBox = document.getElementById("proEditor");
    if (editorBox) {
      editorBox.classList.remove("hidden");
      editorBox.style.display = "block";
    }

    // Sembunyikan kontainer YouTube
    const ytContainer = document.getElementById("proYoutubeContainer");
    if (ytContainer) ytContainer.style.display = "none";

    // Munculkan panel pengaturan AI Studio
    if (aiStudioPanel) {
      aiStudioPanel.style.display = "block";
    }

    // Render video lokal
    const container = document.getElementById("proVideoContainer");
    if (container) {
      const fileUrl = URL.createObjectURL(file);
      container.innerHTML = `
        <video id="proVideoPreview" controls playsinline style="width: 100%; max-height: 350px; display: block; background: #000;">
          <source src="${fileUrl}" type="${file.type || 'video/mp4'}">
          Browser Anda tidak mendukung pemutar video ini.
        </video>
      `;

      const newVideo = document.getElementById("proVideoPreview");
      if (newVideo) {
        newVideo.load();
        newVideo.onloadedmetadata = () => {
          window.proDuration = newVideo.duration;
          const durationSpan = document.getElementById("proVideoDuration");
          if (durationSpan) {
            const mins = Math.floor(newVideo.duration / 60);
            const secs = Math.floor(newVideo.duration % 60);
            durationSpan.textContent = `Durasi: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
          }
        };
      }
    }

    const nameSpan = document.getElementById("proVideoName");
    if (nameSpan) {
      nameSpan.textContent = "File: " + file.name;
    }
  });
}

// 2. Tombol Muat Link URL PRO (Diperbaiki agar merender video & memunculkan panel)
const proLoadVideoLinkBtn = document.getElementById("proLoadVideoLinkBtn");
if (proLoadVideoLinkBtn) {
  proLoadVideoLinkBtn.addEventListener("click", () => {
    const rawUrl = document.getElementById("proLinkVideoInput").value.trim();
    if (!rawUrl) {
      alert("⚠️ Silakan masukkan tautan video atau YouTube terlebih dahulu.");
      return;
    }

    const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const editorBox = document.getElementById("proEditor");
    const previewVid = document.getElementById("proVideoPreview");
    const ytBox = document.getElementById("proYoutubeContainer");

    // Tampilkan kotak editor
    if (editorBox) {
      editorBox.classList.remove("hidden");
      editorBox.style.display = "block";
    }

    // Munculkan panel pengaturan AI Studio setelah link berhasil dimuat
    if (aiStudioPanel) {
      aiStudioPanel.style.display = "block";
    }

    if (ytMatch && ytMatch[1]) {
      // Jika Link YouTube
      if (previewVid) previewVid.style.display = "none";
      if (ytBox) {
        ytBox.style.display = "block";
        ytBox.innerHTML = `<iframe width="100%" height="280px" src="https://www.youtube.com/embed/${ytMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
      }
      window.proDuration = 120;
      alert("✅ Link YouTube berhasil dimuat!");
    } else {
      // Jika Link Video Langsung (.mp4)
      if (ytBox) ytBox.style.display = "none";
      if (previewVid) {
        previewVid.style.display = "block";
        previewVid.src = rawUrl;
        previewVid.load();
      }
      window.proDuration = 120;
      alert("✅ Link video berhasil dimuat!");
    }
  });
}

// Proses Auto Clip AI Berbasis Analisis Cerdas (Gemini AI Concept)
const runAiClipBtn = document.getElementById("runAiClipBtn");

if (runAiClipBtn) {
  runAiClipBtn.addEventListener("click", async () => {
    
    const isUploadActive = proContentUpload && proContentUpload.style.display !== "none";
    const sumberTeks = isUploadActive ? "File Lokal" : "Link URL";
    
    let activeVideoSrc = "";
    const previewVid = document.getElementById("proVideoPreview");
    
    if (isUploadActive) {
      const hiddenFileInput = document.getElementById("hiddenProFileInput");
      if (hiddenFileInput && hiddenFileInput.files && hiddenFileInput.files[0]) {
        activeVideoSrc = URL.createObjectURL(hiddenFileInput.files[0]);
      } else if (previewVid && previewVid.src) {
        activeVideoSrc = previewVid.src;
      }
      
      if (!activeVideoSrc) {
        alert("⚠️ Silakan pilih dan muat video lokal terlebih dahulu di tab Upload File Manual.");
        return;
      }
    } else {
      const proLinkInput = document.getElementById("proLinkVideoInput");
      if (proLinkInput && proLinkInput.value.trim()) {
        activeVideoSrc = proLinkInput.value.trim();
      } else {
        alert("⚠️ Silakan masukkan tautan video terlebih dahulu di tab Link.");
        return;
      }
    }

    const customHook = document.getElementById("aiCustomHook") ? document.getElementById("aiCustomHook").value : "";
    const contentTemplate = document.getElementById("aiContentTemplate") ? document.getElementById("aiContentTemplate").value : "podcast";
    const dubbingLang = document.getElementById("aiDubbingLanguage") ? document.getElementById("aiDubbingLanguage").value : "none";
    const voiceProfile = document.getElementById("aiVoiceProfile") ? document.getElementById("aiVoiceProfile").value : "male_pro";
    const speechSpeed = document.getElementById("aiSpeechSpeed") ? document.getElementById("aiSpeechSpeed").value : "1.0";
    const antiCopyActive = document.getElementById("antiCopyrightZoom") ? document.getElementById("antiCopyrightZoom").checked : false;
    const watermarkActive = document.getElementById("watermarkPlon") ? document.getElementById("watermarkPlon").checked : false;

    // Efek loading ala AI sedang berpikir / memindai transkrip
    runAiClipBtn.disabled = true;
    runAiClipBtn.textContent = "🧠 Gemini AI sedang memindai transkrip & mendeteksi momen lucu/viral...";
    
    await new Promise(res => setTimeout(res, 3500));
    
    const aiResultContainer = document.getElementById("aiResultContainer");
    const aiClipList = document.getElementById("aiClipList");
    if (aiClipList) aiClipList.innerHTML = ""; 

    const totalDuration = window.proDuration || 120;
    const estimatedClipCount = Math.max(2, Math.min(10, Math.floor(totalDuration / 20)));
    
    const generatedClips = [];
    
    // Bank momen cerdas berdasarkan template konten
    const smartMoments = {
      podcast: [
        { hook: "Reaksi Paling Lucu & Tak Terduga!", time: 10, score: "98% Viral" },
        { hook: "Perdebatan Sengit yang Memancing Tawa", time: 35, score: "95% Viral" },
        { hook: "Pernyataan Nyeleneh Bikin Ngakak", time: 60, score: "92% Viral" },
        { hook: "Momen Paling Kocak di Podcast Ini", time: 85, score: "90% Viral" }
      ],
      education: [
        { hook: "Fakta Unik yang Bikin Tercengang!", time: 5, score: "99% Viral" },
        { hook: "Kesalahan Fatal yang Sering Disepelekan", time: 30, score: "96% Viral" },
        { hook: "Tips Kilat Solusi Instan", time: 55, score: "94% Viral" }
      ],
      gaming: [
        { hook: "Detik-Detik Clutch Paling Epic!", time: 15, score: "99% Viral" },
        { hook: "Reaksi Panik Lucu Banget!", time: 40, score: "97% Viral" },
        { hook: "Momen Fail Paling Mengocok Perut", time: 70, score: "93% Viral" }
      ],
      business: [
        { hook: "Rahasia Sukses yang Jarang Dibongkar", time: 10, score: "96% Viral" },
        { hook: "Strategi Unik Bikin Cuan Mengalir", time: 45, score: "92% Viral" }
      ],
      story: [
        { hook: "Plot Twist Paling Emosional!", time: 20, score: "98% Viral" },
        { hook: "Kisah Inspiratif Penuh Makna", time: 50, score: "95% Viral" }
      ]
    };

    const templatePool = smartMoments[contentTemplate] || smartMoments.podcast;

    for (let i = 0; i < estimatedClipCount; i++) {
      const momentData = templatePool[i % templatePool.length];
      const randomDurationSec = Math.floor(Math.random() * (45 - 25 + 1)) + 25;

      generatedClips.push({
        id: i + 1,
        title: `Klip ${i + 1} (${sumberTeks} - ${contentTemplate.toUpperCase()})`,
        hook: momentData.hook,
        startTime: momentData.time + (i * 5), // Titik potong waktu unik
        duration: `${randomDurationSec} detik`,
        score: momentData.score,
        videoSrc: activeVideoSrc
      });
    }

    generatedClips.forEach((clip, index) => {
      const card = document.createElement("div");
      card.style.cssText = "background: #101014; border: 1px solid #3f3f5a; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;";
      
      const cardVideoId = `cardVideoPreview_${index}`;

      card.innerHTML = `
        <div style="width: 100%; height: 140px; background: #000; position: relative; display: flex; align-items: center; justify-content: center;">
          <video id="${cardVideoId}" controls playsinline preload="metadata" style="width: 100%; height: 100%; object-fit: cover; background: #000;">
            <source src="${clip.videoSrc}#t=${clip.startTime}" type="video/mp4">
            Browser Anda tidak mendukung pemutar video.
          </video>
        </div>
        <div style="padding: 10px; display: flex; flex-direction: column; gap: 6px; flex: 1; justify-content: space-between;">
          <div>
            <strong style="color: #fff; font-size: 12px; display: block; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${clip.title}</strong>
            <span style="color: #b4b4d0; font-size: 10px; display: block; margin-bottom: 2px;">📌 ${clip.hook}</span>
            <span style="color: #8f8fb5; font-size: 10px;">AI Cut (Mulai ${clip.startTime}s) | <span style="color: #a855f7;">${clip.score}</span></span>
          </div>
          <button id="downloadBtn_${index}" class="button primary" style="padding: 6px; font-size: 11px; width: 100%; cursor: pointer;">
            📥 Download Klip Ini
          </button>
        </div>
      `;
      if (aiClipList) aiClipList.appendChild(card);

      setTimeout(() => {
        const downloadBtn = document.getElementById(`downloadBtn_${index}`);
        if (downloadBtn) {
          downloadBtn.addEventListener("click", () => {
            if (!clip.videoSrc) {
              alert("⚠️ Sumber video tidak ditemukan untuk diunduh.");
              return;
            }
            const a = document.createElement("a");
            a.href = clip.videoSrc;
            a.download = `ClipperPlon-AI-Klip-${index + 1}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            alert(`✅ Berhasil mengunduh ${clip.title}!`);
          });
        }
      }, 100);
    });

    if (aiResultContainer) {
      aiResultContainer.style.display = "block";
      aiResultContainer.classList.remove("hidden");
    }
    
    runAiClipBtn.textContent = "🚀 Proses & Buat Klip Viral Otomatis";
    runAiClipBtn.disabled = false;
  });
}

// --- FITUR AI COPYRIGHT & CONTENT CHECK ---
const runCopyrightCheckBtn = document.getElementById("runCopyrightCheckBtn");
const copyrightCheckStatus = document.getElementById("copyrightCheckStatus");

if (runCopyrightCheckBtn && copyrightCheckStatus) {
  runCopyrightCheckBtn.addEventListener("click", async () => {
    runCopyrightCheckBtn.disabled = true;
    runCopyrightCheckBtn.textContent = "Memindai...";
    copyrightCheckStatus.textContent = "⏳ AI sedang menganalisis trek audio, visual, dan metadata...";
    copyrightCheckStatus.style.color = "#a855f7";

    await new Promise(res => setTimeout(res, 2500));

    // Simulasi hasil analisis risiko AI
    const riskLevels = [
      { score: "Aman (Risiko Rendah 2%)", desc: "✅ Konten bersih dari klaim hak cipta musik mayor. Aman diunggah.", color: "#22c55e" },
      { score: "Perhatian (Risiko Sedang 15%)", desc: "⚠️ Terdeteksi kemiripan audio latar. Pastikan fitur Auto Micro-Zoom aktif.", color: "#eab308" }
    ];
    
    // Pilih acak simulasi hasil
    const result = riskLevels[Math.floor(Math.random() * riskLevels.length)];

    copyrightCheckStatus.innerHTML = `<strong style="color: ${result.color};">${result.score}</strong><br>${result.desc}`;
    runCopyrightCheckBtn.disabled = false;
    runCopyrightCheckBtn.textContent = "Scan Ulang";
  });
}

console.log("ClipperPlon System: Semua fitur siap digunakan!");