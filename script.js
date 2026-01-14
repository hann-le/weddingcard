const seal = document.getElementById("sealBtn");
const intro = document.getElementById("intro");
const site = document.getElementById("site");

const modal = document.getElementById("saveDateModal");
const detailsBtn = document.getElementById("detailsBtn");

// Side nav elements
const menuBtn = document.getElementById("menuBtn");
const sideNav = document.getElementById("sideNav");
const closeNavBtn = document.getElementById("closeNavBtn");
const navBackdrop = document.getElementById("navBackdrop");

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

// ---- Open invitation flow ----
seal?.addEventListener("click", () => {
  // little pulse effect on envelope image (optional class)
  document.querySelector(".envelope-image")?.classList.add("pulse");
  setTimeout(() => document.querySelector(".envelope-image")?.classList.remove("pulse"), 520);

  // show the paper modal
  modal.hidden = false;
});

// When user clicks “details”
detailsBtn?.addEventListener("click", () => {
  // fade out intro
  intro.classList.add("page-out");

  // hide modal
  modal.hidden = true;

  setTimeout(() => {
    intro.style.display = "none";
    site.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 520);
});

// ---- Side nav open/close ----
function openNav(){
  sideNav.classList.add("open");
  navBackdrop.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
  sideNav.setAttribute("aria-hidden", "false");
}

function closeNav(){
  sideNav.classList.remove("open");
  navBackdrop.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  sideNav.setAttribute("aria-hidden", "true");
}

menuBtn?.addEventListener("click", openNav);
closeNavBtn?.addEventListener("click", closeNav);
navBackdrop?.addEventListener("click", closeNav);

// ---- Page switching ----
function showPage(id){
  pages.forEach(p => p.classList.remove("is-active"));
  document.getElementById(id)?.classList.add("is-active");

  navLinks.forEach(b => b.classList.remove("is-active"));
  document.querySelector(`.nav-link[data-target="${id}"]`)?.classList.add("is-active");

  closeNav();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    if (target) showPage(target);
  });
});
