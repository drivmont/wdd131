/* main.js — shared behavior for every SignalScout page:
   mobile nav toggle, current-page nav highlight, footer year/last-modified. */

function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.querySelector(".sr-only").textContent = isOpen ? "Close menu" : "Menu";
  });
}

function highlightCurrentPage() {
  const links = document.querySelectorAll(".primary-nav a");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("current");
      link.setAttribute("aria-current", "page");
    }
  });
}

function stampFooter() {
  const yearEl = document.getElementById("currentyear");
  const modifiedEl = document.getElementById("lastModified");

  if (yearEl) {
    yearEl.textContent = `${new Date().getFullYear()}`;
  }
  if (modifiedEl) {
    modifiedEl.textContent = `Last updated: ${document.lastModified}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  highlightCurrentPage();
  stampFooter();
});
