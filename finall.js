/**********************************************************
  1. MODE DETECTION & PERSISTENCE
**********************************************************/
const urlParams = new URLSearchParams(window.location.search);
const isPublicMode =
  window.location.hostname.includes("github.io") ||
  urlParams.get('view') === 'true';

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

/**********************************************************
  CURSOR CHANGE ON SCROLL — FINAL (MATCHES YOUR HTML)
**********************************************************/

/**********************************************************
  SCROLL-BASED CURSOR SYSTEM (SAFE + FINAL)
**********************************************************/

/* ===============================
   IMAGE CURSOR FOLLOWER – SLIDE BASED (FINAL)
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.className = "cursor-follower";
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;

  /* DEFAULT CURSOR */
  cursor.style.backgroundImage = 'url("cursorb.png")';

  /* TRACK MOUSE */
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* SMOOTH FOLLOW */
  function animate() {
    posX += (mouseX - posX) * 0.18;
    posY += (mouseY - posY) * 0.18;

    cursor.style.left = posX + "px";
    cursor.style.top = posY + "px";

    requestAnimationFrame(animate);
  }
  animate();

  /* ===============================
     SLIDE CURSOR RULES
  ================================ */

  const rules = [
    { id: "intro", cursor: "cursorg.cur" },   // Slide 2
    { id: "about", cursor: "cursorp.png" },  // Slide 4
    { id: "slide5", cursor: "cursorp.png" }  // Slide 5
  ];

  const defaultCursor = 'url("cursorb.png")';

  function setCursor(src) {
    cursor.style.backgroundImage = `url("${src}")`;
  }

  function checkSlideCursor() {
    const middle = window.innerHeight / 2;
    let applied = false;

    for (const rule of rules) {
      const section = document.getElementById(rule.id);
      if (!section) continue;

      const rect = section.getBoundingClientRect();
      if (rect.top <= middle && rect.bottom >= middle) {
        setCursor(rule.cursor);
        applied = true;
        break;
      }
    }

    if (!applied) {
      cursor.style.backgroundImage = defaultCursor;
    }
  }

  window.addEventListener("scroll", checkSlideCursor);
  window.addEventListener("load", checkSlideCursor);
});
/**********************************************************
  CLICK ME – ONLY FOR bunny.png & web.png
**********************************************************/

const clickMe = document.getElementById("clickMeBubble");

/* TARGET ONLY THESE IMAGES */
const targetImages = document.querySelectorAll(
  'img[src*="bunny.png"], img[src*="web.png"]'
);

targetImages.forEach(img => {

  img.addEventListener("mouseenter", () => {
    clickMe.classList.add("show");
  });

  img.addEventListener("mouseleave", () => {
    clickMe.classList.remove("show");
  });
});

/* FOLLOW CURSOR */
document.addEventListener("mousemove", e => {
  if (!clickMe.classList.contains("show")) return;

  clickMe.style.left = e.clientX + 22 + "px";
  clickMe.style.top  = e.clientY + 22 + "px";
});
function scrollTopSmooth(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
let lastScroll = window.scrollY;
let ticking = false;

const nav = document.querySelector("nav");
const OFFSET = 80;     // minimum scroll before reacting
const DELTA = 10;      // ignore tiny scrolls

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const current = window.scrollY;

      // Ignore tiny movements (this stops dancing)
      if (Math.abs(current - lastScroll) < DELTA) {
        ticking = false;
        return;
      }

      // Scroll DOWN → hide navbar
      if (current > lastScroll && current > OFFSET) {
        nav.style.transform = "translateY(-100%)";
      }

      // Scroll UP → show navbar
      if (current < lastScroll) {
        nav.style.transform = "translateY(0)";
      }

      lastScroll = current;
      ticking = false;
    });

    ticking = true;
  }
});
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
