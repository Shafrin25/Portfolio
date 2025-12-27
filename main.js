/**********************************************************
  1. MODE DETECTION & PERSISTENCE
**********************************************************/
const urlParams = new URLSearchParams(window.location.search);
const isPublicMode = urlParams.get('view') === 'true';

// Check if we previously clicked "Freeze"
let frozen = localStorage.getItem("portfolioFrozen") === "true";

// If Public Mode (LinkedIn) OR if you previously clicked Freeze
if (isPublicMode || frozen) {
  document.body.classList.add("portfolio-frozen");
  if (isPublicMode) document.body.classList.add("public-view");
}

/**********************************************************
  2. UI INITIALIZATION (Removing Editor on Load)
**********************************************************/
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector(".freeze-btn");
  
  // If frozen OR public mode, hide the button completely
  if (btn && (frozen || isPublicMode)) {
    btn.style.display = "none"; 
  } else if (btn) {
    btn.innerText = "FREEZE";
  }

  // Disable text editing if frozen
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.contentEditable = !frozen;
  });
});

/**********************************************************
  3. APPLY TRANSFORM
**********************************************************/
function apply(el) {
  const x = parseFloat(el.dataset.x) || 0;
  const y = parseFloat(el.dataset.y) || 0;
  const r = parseFloat(el.dataset.rotate) || 0;
  el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
}

/**********************************************************
  4. LOAD SAVED STATE
**********************************************************/
document.querySelectorAll("[data-id]").forEach(el => {
  const d = JSON.parse(localStorage.getItem(el.dataset.id));
  if (d) {
    el.dataset.x = d.x || 0;
    el.dataset.y = d.y || 0;
    el.dataset.rotate = d.rotate || 0;
    if (d.w) el.style.width = d.w + "px";
    if (d.h) el.style.height = d.h + "px";
  }
  apply(el);
});

/**********************************************************
  5. INTERACT.JS LOGIC
**********************************************************/
interact("[data-id]")
  .draggable({
    ignoreFrom: ".resize-handle, .rotate-handle, .about1-resize, .about1-rotate",
    listeners: {
      move(e) {
        if (frozen) return; // Stop movement if frozen
        const t = e.target;
        t.dataset.x = (+t.dataset.x || 0) + e.dx;
        t.dataset.y = (+t.dataset.y || 0) + e.dy;
        apply(t);
      }
    }
  })
  .resizable({
    edges: { left: true, right: true, top: true, bottom: true },
    listeners: {
      move(e) {
        if (frozen) return; // Stop resize if frozen
        const t = e.target;
        t.style.width = e.rect.width + "px";
        t.style.height = e.rect.height + "px";
        t.dataset.x = (+t.dataset.x || 0) + e.deltaRect.left;
        t.dataset.y = (+t.dataset.y || 0) + e.deltaRect.top;
        apply(t);
      }
    }
  });

interact(".rotate-handle, .about1-rotate").draggable({
  listeners: {
    move(e) {
      if (frozen) return; // Stop rotation if frozen
      const box = e.target.closest("[data-id]");
      if (box) {
        box.dataset.rotate = (+box.dataset.rotate || 0) + e.dx;
        apply(box);
      }
    }
  }
});

/**********************************************************
  6. SAVE STATE & PERMANENT FREEZE FUNCTION
**********************************************************/
function saveState() {
  if (frozen || isPublicMode) return;
  document.querySelectorAll("[data-id]").forEach(el => {
    localStorage.setItem(el.dataset.id, JSON.stringify({
      x: +el.dataset.x || 0,
      y: +el.dataset.y || 0,
      rotate: +el.dataset.rotate || 0,
      w: el.offsetWidth,
      h: el.offsetHeight
    }));
  });
}

document.addEventListener("mouseup", saveState);
document.addEventListener("touchend", saveState);

// THE MAIN FUNCTION
window.freezeLayout = function() {
  if (isPublicMode) return;

  frozen = true;
  localStorage.setItem("portfolioFrozen", "true");
  document.body.classList.add("portfolio-frozen");

  saveState();

  // ✅ REAL FIX
  interact.stop();                 // ⬅️ THIS WAS MISSING
  interact("[data-id]").unset();
  interact(".rotate-handle, .about1-rotate").unset();

  const btn = document.querySelector(".freeze-btn");
  if (btn) btn.style.display = "none";

  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.contentEditable = false;
  });

  alert("Portfolio Frozen! Editor hidden permanently.");
};
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  const navHeight = document.querySelector("nav").offsetHeight;

  const y = section.getBoundingClientRect().top + window.pageYOffset - navHeight;

  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
}
