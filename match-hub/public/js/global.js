let isAnimating = false; // Flag única para tudo
const menuCollapse = document.querySelector("#mainNavbar");

// --- Controle do Ícone ---
function toggleMenuIcon() {
  const menuIcon = document.querySelector("#menu");
  menuIcon.classList.toggle("active");
  isAnimating = true;
}

// Quando o menu ABRE
menuCollapse.addEventListener("show.bs.collapse", () => {
  toggleMenuIcon();
});

// Quando o menu FECHA
menuCollapse.addEventListener("hide.bs.collapse", () => {
  toggleMenuIcon();
});

// --- Correção do "salto" ao scrollar ---
window.addEventListener("scroll", function () {
  const menu = document.querySelector("nav");
  const menuHeight = menu.offsetHeight;
  let spacer = document.querySelector("#spacer");

  if (window.scrollY > 0) {
    menu.classList.add("fixed");

    if (!spacer) {
      spacer = document.createElement("div");
      spacer.id = "spacer";
      spacer.style.height = menuHeight + "px";
      menu.parentNode.insertBefore(spacer, menu);
    }
  } else {
    menu.classList.remove("fixed");

    if (spacer) {
      spacer.remove();
    }
  }
});
