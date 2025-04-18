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