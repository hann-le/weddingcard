document.addEventListener("DOMContentLoaded", () => {
  // ===== Main elements =====
  const sealBtn = document.getElementById("sealBtn");      // your invisible wax-hit button
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const envelopeWrap = document.querySelector(".envelope-image");

  // ===== Paper modal elements =====
  const modal = document.getElementById("saveDateModal");  // paper-modal
  const detailsBtn = document.getElementById("detailsBtn");
  const backdrop = document.querySelector(".paper-backdrop");

  if (!sealBtn || !intro || !site || !envelopeWrap || !modal || !detailsBtn) {
    console.warn("Missing elements. Check your IDs/classes in HTML.");
    return;
  }

  // ========= Micro “seal unlock” sound (no file needed) =========
  function playUnlockSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // little “click + chime”
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();

      o1.type = "triangle";
      o2.type = "sine";

      o1.frequency.setValueAtTime(740, now);
      o2.frequency.setValueAtTime(1046.5, now + 0.06);

      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      o1.connect(g);
      o2.connect(g);
      g.connect(ctx.destination);

      o1.start(now);
      o2.start(now + 0.06);
      o1.stop(now + 0.24);
      o2.stop(now + 0.24);

      setTimeout(() => ctx.close(), 350);
    } catch (e) {
      // ignore if blocked
    }
  }

  // ========= Modal controls =========
  function openModal() {
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
  }

  // ========= Transition into main page =========
  function goToMainPage() {
    closeModal();

    // fade/blur out intro
    intro.classList.add("page-out");

    // show main page
    site.hidden = false;

    // remove intro after animation
    setTimeout(() => {
      intro.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 520);
  }

  // ========= Envelope tilt (high-tech but subtle) =========
  function setTiltVars(x, y) {
    // x/y are 0..1 relative to container
    const tiltX = (x - 0.5) * 8;   // rotateY
    const tiltY = (0.5 - y) * 6;   // rotateX
    envelopeWrap.style.setProperty("--tiltX", `${tiltX}deg`);
    envelopeWrap.style.setProperty("--tiltY", `${tiltY}deg`);
    envelopeWrap.style.setProperty("--mx", `${x * 100}%`);
    envelopeWrap.style.setProperty("--my", `${y * 100}%`);
  }

  envelopeWrap.addEventListener("pointermove", (e) => {
    const rect = envelopeWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTiltVars(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
  });

  envelopeWrap.addEventListener("pointerleave", () => {
    // reset nicely
    envelopeWrap.style.setProperty("--tiltX", `0deg`);
    envelopeWrap.style.setProperty("--tiltY", `0deg`);
    envelopeWrap.style.setProperty("--mx", `50%`);
    envelopeWrap.style.setProperty("--my", `50%`);
  });

  // ========= Wax click: sound + pulse + show paper sheet =========
  sealBtn.addEventListener("click", () => {
    playUnlockSound();

    // pulse effect on envelope
    envelopeWrap.classList.remove("pulse");
    void envelopeWrap.offsetWidth; // restart animation
    envelopeWrap.classList.add("pulse");

    // show paper invitation sheet
    setTimeout(openModal, 180);
  });

  // ========= CTA click: ripple + go =========
  detailsBtn.addEventListener("click", (e) => {
    // ripple (optional)
    const r = document.createElement("span");
    r.className = "ripple";
    const rect = detailsBtn.getBoundingClientRect();
    r.style.left = `${e.clientX - rect.left}px`;
    r.style.top = `${e.clientY - rect.top}px`;
    detailsBtn.appendChild(r);
    setTimeout(() => r.remove(), 750);

    setTimeout(goToMainPage, 120);
  });

  // optional: click outside to close (remove if you don't want close)
  if (backdrop) backdrop.addEventListener("click", closeModal);

  // ESC to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // RSVP handler (your form calls submitRSVP)
  window.submitRSVP = function (e) {
    e.preventDefault();
    const msg = document.getElementById("rsvpMsg");
    if (msg) msg.textContent = "Thank you! Your RSVP has been received.";
    return false;
  };
});
