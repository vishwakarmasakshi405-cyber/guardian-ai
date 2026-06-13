// Guardian AI - Interactive Control Script

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CANVAS PARTICLE SYSTEM (Futuristic Background)
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const maxParticles = 60;
  const connectionDistance = 120;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      // Champagne gold or warm coral color tones
      this.color = Math.random() > 0.5 ? 'rgba(230, 193, 122, 0.4)' : 'rgba(238, 93, 93, 0.3)';
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(230, 193, 122, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // 2. STATE MANAGEMENT & ROUTER (SPA VIEWS)
  // ==========================================
  const state = {
    activeEmergency: null, // "lost-phone" | "cyber-fraud" | "lost-documents" | "travel-emergency" | null
    checklistProgress: {
      "lost-phone": 60, // Checked item total
      "cyber-fraud": 25,
      "lost-documents": 25,
    },
    profile: {
      fullname: "Saksh Audichya",
      father: "K. Audichya",
      state: "Rajasthan",
      phone: "+91 94142 83748"
    }
  };

  const heroSection = document.getElementById('hero-section');
  const dashboardWrapper = document.getElementById('dashboard-wrapper');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const dashboardViews = document.querySelectorAll('.dashboard-view');
  
  // Main Dashboard Header elements
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const activePill = document.getElementById('active-emergency-pill');
  const activePillText = document.getElementById('pill-text');

  // Trigger Navigation
  function switchView(viewId) {
    // Hide active views, remove active sidebar styles
    dashboardViews.forEach(v => v.classList.remove('active'));
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    const targetSidebar = Array.from(sidebarItems).find(i => i.getAttribute('data-view') === viewId);
    if (targetSidebar) {
      targetSidebar.classList.add('active');
    }
    
    // Update Header labels according to active tab
    updateHeaderMetadata(viewId);
  }

  function updateHeaderMetadata(viewId) {
    switch(viewId) {
      case 'view-home':
        pageTitle.innerText = "Guardian AI Dashboard";
        pageSubtitle.innerText = "Central Control Overview";
        break;
      case 'view-lost-phone':
        pageTitle.innerText = "Lost Device Security";
        pageSubtitle.innerText = "Lockdown, locate, and claim assets";
        break;
      case 'view-cyber-fraud':
        pageTitle.innerText = "Online Fraud Salvage";
        pageSubtitle.innerText = "Freeze disputes & compile evidence";
        break;
      case 'view-lost-documents':
        pageTitle.innerText = "Safety Document Recovery";
        pageSubtitle.innerText = "Autofill official copies and credentials";
        break;
      case 'view-travel-emergency':
        pageTitle.innerText = "Transit Disruption Desk";
        pageSubtitle.innerText = "Alternative transit options & direct support";
        break;
      case 'view-fake-detector':
        pageTitle.innerText = "Investigation Laboratory";
        pageSubtitle.innerText = "Validate content validity using neural scanning";
        break;
      case 'view-safety-profile':
        pageTitle.innerText = "Safety Vault Profile";
        pageSubtitle.innerText = "Configure backup details and credentials";
        break;
      case 'view-history':
        pageTitle.innerText = "Archive Logs";
        pageSubtitle.innerText = "Past incidents and recoveries";
        break;
    }
  }

  // Bind Sidebar items click
  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = item.getAttribute('data-view');
      switchView(viewId);
    });
  });

  // Logo Click (Sidebar header) - Return to Hero landing page
  document.querySelector('.sidebar-logo').addEventListener('click', () => {
    dashboardWrapper.style.display = 'none';
    heroSection.style.display = 'flex';
    document.getElementById('ai-chat-trigger').classList.add('hidden');
    document.getElementById('ai-chat-panel').classList.remove('active');
  });

  // Hero Section Action Buttons
  document.getElementById('btn-hero-start').addEventListener('click', () => {
    heroSection.style.display = 'none';
    dashboardWrapper.style.display = 'flex';
    document.getElementById('ai-chat-trigger').classList.remove('hidden');
    switchView('view-home');
  });

  document.getElementById('btn-hero-check').addEventListener('click', () => {
    heroSection.style.display = 'none';
    dashboardWrapper.style.display = 'flex';
    document.getElementById('ai-chat-trigger').classList.remove('hidden');
    switchView('view-fake-detector');
  });

  // ==========================================
  // 3. EMERGENCY PILL & BANNER CONTROL
  // ==========================================
  const centralBanner = document.getElementById('central-status-banner');
  const bannerTitle = document.getElementById('banner-status-title');
  const bannerPriority = document.getElementById('banner-priority-val');
  const bannerMonitoring = document.getElementById('banner-monitoring-val');
  
  // Circular progress elements
  const progressCircle = document.getElementById('recovery-progress-bar');
  const progressPercentText = document.getElementById('progress-percentage-txt');
  const progressDescText = document.getElementById('progress-desc-txt');

  function updateMainProgressCircle(percent, desc) {
    if (progressCircle) {
      // Circumference C = 2 * PI * r = 377
      const offset = 377 - (percent / 100) * 377;
      progressCircle.style.strokeDashoffset = offset;
      progressPercentText.innerText = `${percent}%`;
      progressDescText.innerText = desc || "Case recovery process is under active state.";
    }
  }

  function setEmergencyState(type) {
    state.activeEmergency = type;
    
    if (type === 'lost-phone') {
      activePill.className = "active-case-pill";
      activePillText.innerText = "Lost Phone Case - Active";
      
      centralBanner.className = "card status-banner";
      bannerTitle.innerText = "Lost Phone Incident - In Progress";
      bannerPriority.innerText = "HIGH";
      bannerPriority.style.color = "var(--accent-coral)";
      bannerMonitoring.innerText = "Active AI Node";
      bannerMonitoring.style.color = "var(--accent-gold)";
      
      // Load current checklist progress
      const progress = calculateChecklistProgress('lost-phone-checklist');
      updateMainProgressCircle(progress, "Lockdown commands and SIM-block completed. Compiling FIR draft.");
      
      // Update action button recommendation
      document.getElementById('action-title-txt').innerText = "Block Operator SIM";
      document.getElementById('action-desc-txt').innerText = "Simulate provider lockdown immediately. Compiles formal notice to carrier. Generate police FIR drafts next.";
    } 
    else if (type === 'cyber-fraud') {
      activePill.className = "active-case-pill";
      activePillText.innerText = "Cyber Fraud Incident - Active";
      
      centralBanner.className = "card status-banner";
      bannerTitle.innerText = "Disputed Charge - Financial Rescue";
      bannerPriority.innerText = "CRITICAL";
      bannerPriority.style.color = "var(--accent-coral)";
      bannerMonitoring.innerText = "Secure Gateway Link";
      bannerMonitoring.style.color = "var(--accent-green)";
      
      const progress = calculateChecklistProgress('fraud-checklist');
      updateMainProgressCircle(progress, "Dispute letters generated. Bank support lines open.");
      
      document.getElementById('action-title-txt').innerText = "Dispute Transaction";
      document.getElementById('action-desc-txt').innerText = "Submit structured dispute letter directly to bank gateway support node. Freezes disputed merchants.";
    }
    else {
      // Normal state
      activePill.className = "active-case-pill safe";
      activePillText.innerText = "No Active Case";
      
      centralBanner.className = "card status-banner no-emergency";
      bannerTitle.innerText = "No Active Emergency";
      bannerPriority.innerText = "NONE";
      bannerPriority.style.color = "var(--text-primary)";
      bannerMonitoring.innerText = "Standby Monitor";
      bannerMonitoring.style.color = "var(--accent-green)";
      
      updateMainProgressCircle(0, "All systems monitored. No active emergencies reported.");
      
      document.getElementById('action-title-txt').innerText = "Setup Safety Vault";
      document.getElementById('action-desc-txt').innerText = "Pre-fill safety details, emergency cards, and devices to ensure immediate recovery actions during critical outages.";
    }
  }

  // Panic Demo Switch button in Central Banner
  document.getElementById('btn-trigger-panic').addEventListener('click', () => {
    if (state.activeEmergency) {
      setEmergencyState(null);
      showToast("All active cases resolved. Standby mode restored.");
    } else {
      setEmergencyState('lost-phone');
      showToast("Simulating Lost Phone Emergency case. Actions compiled.");
      switchView('view-lost-phone');
    }
  });

  // Execute recommendation click
  document.getElementById('btn-action-execute').addEventListener('click', () => {
    if (!state.activeEmergency) {
      switchView('view-safety-profile');
    } else if (state.activeEmergency === 'lost-phone') {
      switchView('view-lost-phone');
    } else if (state.activeEmergency === 'cyber-fraud') {
      switchView('view-cyber-fraud');
    }
  });

  // ==========================================
  // 4. CHECKLIST BEHAVIOR & PROGRESS LINK
  // ==========================================
  function calculateChecklistProgress(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return 0;
    
    const items = container.querySelectorAll('.checklist-item');
    const checkedItems = container.querySelectorAll('.checklist-item.checked');
    if (items.length === 0) return 0;
    
    return Math.round((checkedItems.length / items.length) * 100);
  }

  function setupChecklistListeners(containerId, emergencyType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.querySelectorAll('.checklist-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('checked');
        
        // Update local progress value
        const newProgress = calculateChecklistProgress(containerId);
        state.checklistProgress[emergencyType] = newProgress;
        
        // If this checklist is the active emergency, update central dashboard
        if (state.activeEmergency === emergencyType) {
          let desc = "";
          if (emergencyType === 'lost-phone') {
            desc = `Lockdown & recovery checklist completed: ${newProgress}%.`;
          } else if (emergencyType === 'cyber-fraud') {
            desc = `Chargeback salvage protocol completed: ${newProgress}%.`;
          }
          updateMainProgressCircle(newProgress, desc);
        }
        
        showToast(`Step toggled. Recovery checklist is at ${newProgress}%`);
      });
    });
  }

  setupChecklistListeners('lost-phone-checklist', 'lost-phone');
  setupChecklistListeners('fraud-checklist', 'cyber-fraud');

  // ==========================================
  // 5. DOCUMENT GENERATOR & MODAL
  // ==========================================
  const modalOverlay = document.getElementById('document-modal');
  const modalDocTitle = document.getElementById('modal-doc-title');
  const modalDocContent = document.getElementById('modal-doc-content');
  
  let currentDocDraft = "";

  function openDocModal(title, text) {
    modalDocTitle.innerText = title;
    modalDocContent.innerText = text;
    currentDocDraft = text;
    modalOverlay.classList.add('active');
  }

  function closeDocModal() {
    modalOverlay.classList.remove('active');
  }

  document.getElementById('btn-modal-close').addEventListener('click', closeDocModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeDocModal();
  });

  // Action Buttons in Modal
  document.getElementById('btn-doc-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(currentDocDraft)
      .then(() => {
        showToast("Copied draft document text to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });

  document.getElementById('btn-doc-download').addEventListener('click', () => {
    const blob = new Blob([currentDocDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalDocTitle.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_draft.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Downloaded document draft file!");
  });

  // Mock template texts compiler
  const draftsCompiler = {
    sim_block: () => {
      return `To,
The Nodal Officer,
Telecom Services Group

Subject: Request for Immediate Blocking of eSIM / Mobile connection.

Dear Sir/Madam,
I am writing to report the theft of my mobile phone containing the registered SIM card.
Please freeze/block all cellular connections associated with the following details:

Registered Phone Number: +91 94142 83748
Owner Name: Saksh Audichya
IMEI Number: 357890123456789
Incident Location: Connaught Place, Delhi
Timestamp: June 13, 2026

Please verify and trigger the carrier lockdown immediately to prevent unauthorized access.

Sincerely,
Saksh Audichya`;
    },
    
    fir_draft: () => {
      const type = document.getElementById('phone-val-type').innerText || "Mobile Device";
      const imei = document.getElementById('phone-val-imei').innerText || "357890123456789";
      const location = document.getElementById('phone-val-loc').innerText || "Delhi";
      return `POLICE FIRST INFORMATION REPORT (FIR) DRAFT
Generated under Guardian AI Legal Redress Node

To,
The Station House Officer (SHO),
Police HQ Central Division

Subject: Lost/Stolen Mobile Device Complaint.

Details of Stolen Device:
- Device Model: ${type}
- IMEI Number: ${imei}
- Current Owner: Saksh Audichya
- Contact Number: +91 94142 83748

Description of Incident:
The subject device was lost/stolen on June 13, 2026 at approximately ${location}.
The device contains secure financial cards and passwords. We request a formal police record block of the IMEI on the Central Equipment Identity Register (CEIR) database.

Complainant Signature,
Saksh Audichya`;
    },
    
    cyber_bank: () => {
      const amt = document.getElementById('fraud-input-amount').value || "₹ 45,200.00";
      const bank = document.getElementById('fraud-input-bank').value || "HDFC Credit Card";
      const merchant = document.getElementById('fraud-input-merchant').value || "Unknown";
      const incident = document.getElementById('fraud-input-name').value || "Unauthorized Transaction";
      return `To,
The Grievance Redressal Manager,
${bank} Card Division

Subject: Dispute and Chargeback Claim for Fraudulent Transaction.

Dear Sir/Madam,
This is to bring to your notice a disputed/fraudulent charge on my ${bank}.
I did not authorize or approve the following transaction:

- Transaction Type: ${incident}
- Disputed Amount: ${amt}
- Disputed Merchant: ${merchant}
- Timestamp: June 13, 2026
- Cardholder Name: Saksh Audichya

Under RBI guidelines for zero customer liability in cyber fraud, I request you to block my card immediately, halt this transaction processing, and refund the disputed amount.

Sincerely,
Saksh Audichya`;
    },

    cyber_govt: () => {
      const amt = document.getElementById('fraud-input-amount').value || "₹ 45,200.00";
      const bank = document.getElementById('fraud-input-bank').value || "HDFC Credit Card";
      const merchant = document.getElementById('fraud-input-merchant').value || "Unknown";
      return `NATIONAL CYBER CRIME PORTAL COMPLAINT DRAFT
Generated via Guardian AI Security Gateway

Complainant Details:
- Full Name: Saksh Audichya
- Contact phone: +91 94142 83748
- Disputed Account: ${bank}

Incident Details:
- Category of Incident: Online Financial Fraud
- Merchant/Receiving Entity: ${merchant}
- Transaction Amount disputed: ${amt}
- Evidence Locker Hash: SHA-256 Verified Receipt Uploads.

Description:
A transaction of ${amt} was pulled from the victim's card account. No OTP authorization was done. HDFC card locked immediately. Requesting trace on receiving payment gateway nodes.

Complainant Sign,
Saksh Audichya`;
    },

    aadhaar_affidavit: () => {
      const name = document.getElementById('doc-input-fullname').value || "Saksh Audichya";
      const num = document.getElementById('doc-input-docnumber').value || "9845 1209 8374";
      const father = document.getElementById('doc-input-father').value || "K. Audichya";
      const stateIss = document.getElementById('doc-input-state').value || "Rajasthan";
      return `AFFIDAVIT FOR DUPLICATE AADHAAR ISSUANCE
(To be printed on stamp paper)

I, ${name}, Son of Sh. ${father}, Resident of ${stateIss}, do hereby solemnly affirm and state as follows:

1. That I have lost my original Aadhaar Card bearing Aadhaar Number ${num}.
2. That the loss occurred on or about June 13, 2026, and despite diligent search, I have been unable to recover the document.
3. That the card has not been pledged or used for any illegal transactions.
4. I request the Unique Identification Authority of India (UIDAI) to reissue a duplicate copy of my Aadhaar Card.

Deponent,
${name}

Verification:
Verified at ${stateIss} that the contents of this affidavit are true to my personal knowledge.`;
    }
  };

  // Wire Document generator buttons
  // Home widgets docs
  document.querySelectorAll('.btn-view-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docType = btn.getAttribute('data-doc');
      let title = "Document Draft";
      let text = "";
      if (docType === 'sim_block') {
        title = "SIM Block Carrier Notice";
        text = draftsCompiler.sim_block();
      } else if (docType === 'cybercrime_fir') {
        title = "National Cybercrime Portal Complaint";
        text = draftsCompiler.cyber_govt();
      } else if (docType === 'aadhaar_request') {
        title = "Aadhaar Card Reprint Affidavit";
        text = draftsCompiler.aadhaar_affidavit();
      }
      openDocModal(title, text);
    });
  });

  // Lost phone dashboard FIR button
  document.getElementById('btn-gen-fir').addEventListener('click', () => {
    openDocModal("Stolen Device Police FIR Draft", draftsCompiler.fir_draft());
  });

  // Online fraud dispute buttons
  document.getElementById('btn-gen-fraud-bank').addEventListener('click', () => {
    openDocModal("Bank Transaction Dispute Card Letter", draftsCompiler.cyber_bank());
  });

  document.getElementById('btn-gen-fraud-govt').addEventListener('click', () => {
    openDocModal("National Cybercrime Complaint File", draftsCompiler.cyber_govt());
  });

  // Document recovery assistant
  document.getElementById('btn-gen-doc-affidavit').addEventListener('click', () => {
    const selectedDoc = document.querySelector('.doc-select-card.active').getAttribute('data-doc');
    const docName = selectedDoc.toUpperCase();
    openDocModal(`${docName} Loss Official Affidavit`, draftsCompiler.aadhaar_affidavit());
  });

  // Lost Document selection cards switcher
  const docCards = document.querySelectorAll('.doc-select-card');
  const docGuideTitle = document.getElementById('doc-guide-title');
  docCards.forEach(card => {
    card.addEventListener('click', () => {
      docCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const docType = card.getAttribute('data-doc');
      
      // Update guide box text based on selection
      if (docType === 'aadhaar') {
        docGuideTitle.innerText = "Aadhaar Card recovery protocol";
        document.getElementById('doc-input-docnumber').value = "9845 1209 8374";
      } else if (docType === 'pan') {
        docGuideTitle.innerText = "PAN Card Official Re-issue guide";
        document.getElementById('doc-input-docnumber').value = "BPAA2304M";
      } else if (docType === 'passport') {
        docGuideTitle.innerText = "Lost Passport Recovery & Embassy guidelines";
        document.getElementById('doc-input-docnumber').value = "Z4892015";
      } else if (docType === 'license') {
        docGuideTitle.innerText = "Driving License Duplicate Issuance (Sarathi)";
        document.getElementById('doc-input-docnumber').value = "DL-14201539201";
      }
      showToast(`Switched document assistant to ${docType.toUpperCase()}`);
    });
  });

  // ==========================================
  // 6. INTERACTIVE FAKE CONTENT SCANNER
  // ==========================================
  const fakeDropzone = document.getElementById('fake-dropzone');
  const fakeScanBar = document.getElementById('fake-scan-bar');
  const fakeResults = document.getElementById('fake-analysis-results');
  const fakeBtn = document.getElementById('btn-fake-scan');
  
  const riskFill = document.getElementById('gauge-risk-fill');
  const riskPercentText = document.getElementById('gauge-risk-percent');

  function simulateFakeScan(fileNameOrUrl) {
    // Hide results, show progress animation bar
    fakeResults.style.display = 'none';
    fakeScanBar.style.display = 'block';
    
    showToast(`Scanning integrity of "${fileNameOrUrl}"...`);
    
    setTimeout(() => {
      fakeScanBar.style.display = 'none';
      fakeResults.style.display = 'block';
      
      // Calculate random high-risk value e.g. 80-95
      const riskScore = Math.floor(Math.random() * 16) + 80;
      
      // Update gauge chart
      if (riskFill) {
        // Semi-circle path max dasharray=220, offset range 220 (0% fake) to 0 (100% fake)
        const offset = 220 - (riskScore / 100) * 220;
        riskFill.style.strokeDashoffset = offset;
        riskPercentText.innerText = `${riskScore}%`;
      }
      
      showToast("Scan finished. AI assessment generated.");
    }, 2000);
  }

  // Bind scan URL button
  fakeBtn.addEventListener('click', () => {
    const url = document.getElementById('fake-input-url').value;
    if (url.trim() === "") {
      alert("Please paste a social media URL or file link to scan.");
      return;
    }
    simulateFakeScan(url);
  });

  // Drag and drop events for file uploading
  ['dragenter', 'dragover'].forEach(eventName => {
    fakeDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      fakeDropzone.style.borderColor = 'var(--accent-gold)';
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fakeDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      fakeDropzone.style.borderColor = 'var(--card-border)';
    }, false);
  });

  fakeDropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      simulateFakeScan(files[0].name);
    }
  });

  // Evidence dropzone (Cyber Fraud view)
  const evidenceDropzone = document.getElementById('evidence-dropzone');
  const evidenceGrid = document.getElementById('evidence-list-grid');

  evidenceDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      const fileName = files[0].name;
      
      // Add card to grid
      const uniqueId = 'e-file-' + Date.now();
      const div = document.createElement('div');
      div.className = 'evidence-file-card';
      div.id = uniqueId;
      div.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${fileName}</div>
        <span class="evidence-file-delete" onclick="document.getElementById('${uniqueId}').remove()">×</span>
      `;
      evidenceGrid.appendChild(div);
      showToast(`Uploaded "${fileName}" to secure evidence vault.`);
    }
  });

  // ==========================================
  // 7. CHATBOT INTERFACE & CHAT LOGIC
  // ==========================================
  const chatPanel = document.getElementById('ai-chat-panel');
  const chatTrigger = document.getElementById('ai-chat-trigger');
  const chatCloseBtn = document.getElementById('btn-chat-close');
  const chatSendBtn = document.getElementById('btn-chat-send');
  const chatMsgInput = document.getElementById('chat-message-input');
  const chatMsgsContainer = document.getElementById('chat-messages-container');
  const quickRepliesContainer = document.getElementById('chat-suggested-replies');

  // Toggle Chat
  chatTrigger.addEventListener('click', () => {
    chatPanel.classList.add('active');
    chatTrigger.classList.add('hidden');
  });

  chatCloseBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
    chatTrigger.classList.remove('hidden');
  });

  // Suggested quick replies actions
  document.querySelectorAll('.quick-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const queryText = btn.innerText;
      sendUserChatMessage(queryText);
    });
  });

  function sendUserChatMessage(text) {
    if (text.trim() === "") return;
    
    // Append user message bubble
    const userBubble = document.createElement('div');
    userBubble.className = "chat-bubble user";
    userBubble.innerText = text;
    chatMsgsContainer.appendChild(userBubble);
    
    // Clear input
    chatMsgInput.value = "";
    
    // Scroll chat container
    chatMsgsContainer.scrollTop = chatMsgsContainer.scrollHeight;
    
    // Simulate AI response
    simulateAIResponse(text);
  }

  function simulateAIResponse(queryText) {
    // Pre-create Bot bubble with typing loader
    const botBubble = document.createElement('div');
    botBubble.className = "chat-bubble bot";
    botBubble.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMsgsContainer.appendChild(botBubble);
    chatMsgsContainer.scrollTop = chatMsgsContainer.scrollHeight;
    
    // AI responses selector
    let replyText = "I've analyzed your situation. Please select one of the emergency dashboards from the sidebar navigation (such as Lost Phone or Cyber Fraud) to generate customized legal redress forms and follow active checklists.";
    const query = queryText.toLowerCase();
    
    if (query.includes('sim') || query.includes('phone') || query.includes('imei')) {
      replyText = "For lost phones, please toggle the 'Lost Phone' dashboard. I can help block your SIM, remote-lock accounts, and draft a Police FIR report. Tap 'Generate Police FIR Draft' to check it out.";
    } else if (query.includes('bank') || query.includes('fraud') || query.includes('money') || query.includes('chargeback')) {
      replyText = "For bank disputes, freeze card tokens instantly and disput the merchant. Tap the 'Cyber Fraud' sidebar menu. I can generate an official bank dispute letter or prepare a cybercrime.gov.in report.";
    } else if (query.includes('fir') || query.includes('police') || query.includes('complaint')) {
      replyText = "I can compile custom legal FIR templates. Go to the relevant Emergency Dashboard, verify your credentials, and click 'Generate'. The draft will display with download and copy options.";
    }
    
    setTimeout(() => {
      // Remove typing bubble and render text
      botBubble.innerHTML = replyText;
      chatMsgsContainer.scrollTop = chatMsgsContainer.scrollHeight;
    }, 1200);
  }

  // Send message on Enter or button click
  chatSendBtn.addEventListener('click', () => {
    sendUserChatMessage(chatMsgInput.value);
  });

  chatMsgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendUserChatMessage(chatMsgInput.value);
    }
  });

  // ==========================================
  // 8. NOTIFICATIONS & SAVES (TOAST)
  // ==========================================
  const toast = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');

  function showToast(text, duration = 3000) {
    toastText.innerText = text;
    toast.classList.add('active');
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  // Save vault profile button
  document.getElementById('btn-save-profile').addEventListener('click', () => {
    // Read input values and update local state
    state.profile.fullname = document.getElementById('doc-input-fullname').value;
    state.profile.state = document.getElementById('doc-input-state').value;
    
    showToast("Safety Vault profile and contact list saved successfully!");
  });

  // Default state initialization
  setEmergencyState(null);

});
