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
interact("[data-id]:not(.project-item)")
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
/*=====projects slide=====*/
/* ================= PROJECT POPUP – FINAL ================= */

/* ===== PROJECT POPUP – FINAL WORKING ===== */

/* ===== PROJECT POPUP – FINAL GUARANTEED ===== */

const overlay = document.getElementById("overlay");
const card = document.getElementById("card");

const content = {
  bunny: `
    <h2>Bunny Alphabet Teaching Design</h2>
    <p>Interactive alphabet learning app using animated bunny and phonics.</p>
    <ul>
      <li>🟣 Kids Learning UI</li>
      <li>🟡 Phonics + Visuals</li>
      <li>🔵 Fun Interaction</li>
    </ul>
  `,
  web: `
    <h2>Smart E-Commerce Trust System</h2>
    <p>Detects risky buyers and protects sellers.</p>
    <ul>
      <li>🟣 Buyer Risk Alerts</li>
      <li>🟡 Seller Reviews</li>
      <li>🔵 Trust Score UX</li>
    </ul>
    <div class="processing">Processing…</div>
  `
};

/* 🔥 CLICK ONLY PROJECT ITEMS */
document.querySelectorAll("[data-project]").forEach(el => {
  el.addEventListener("click", e => {
    e.stopPropagation();   // stop drag conflict

    const key = el.dataset.project;
    if (!content[key]) return;

    card.innerHTML = content[key];
    overlay.classList.add("show");
  });
});

/* CLOSE POPUP */
overlay.addEventListener("click", e => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});
interact('.editor-element').draggable({
  ignoreFrom: 'a, a *, .resume-item img',
  listeners: {
    move(e) {
      if (frozen) return;
      const t = e.target;
      t.dataset.x = (+t.dataset.x || 0) + e.dx;
      t.dataset.y = (+t.dataset.y || 0) + e.dy;
      apply(t);
    }
  }
});
interact('.editor-only-text')
  .draggable({
    listeners: {
      move (event) {
        const target = event.target
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        target.style.transform = `translate(${x}px, ${y}px)`
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }
    }
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', event => {
    let target = event.target

    target.style.width  = event.rect.width + 'px'
    target.style.height = event.rect.height + 'px'
  })

/**********************************************************
  CURSOR CHANGE ON SCROLL — FINAL (MATCHES YOUR HTML)
**********************************************************/

/**********************************************************
  SCROLL-BASED CURSOR SYSTEM (SAFE + FINAL)
**********************************************************/

const cursorRules = [
  { id: "intro", cursor: "cursorg.png" },   // slide 2
  { id: "about", cursor: "cursorp.png" },   // slide 4
  { id: "slide5", cursor: "cursorp.png" }   // slide 5
];

const defaultCursor = "cursorb.png";

function setCursor(src) {
  document.body.style.cursor = `url("${src}") 16 16, auto`;
}

function updateCursorOnScroll() {
  const mid = window.innerHeight / 2;
  let applied = false;

  for (const rule of cursorRules) {
    const section = document.getElementById(rule.id);
    if (!section) continue; // ✅ prevents crash

    const rect = section.getBoundingClientRect();
    if (rect.top <= mid && rect.bottom >= mid) {
      setCursor(rule.cursor);
      applied = true;
      break;
    }
  }

  if (!applied) {
    setCursor(defaultCursor);
  }
}

/* SAFE INIT */
window.addEventListener("scroll", updateCursorOnScroll);
window.addEventListener("load", () => {
  setCursor(defaultCursor);
  updateCursorOnScroll();
});
