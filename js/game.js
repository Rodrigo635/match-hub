document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("selectedGame");
  if (!raw) return console.error("Nenhum jogo em storage.");

  const game = JSON.parse(raw);
  document.getElementById("game-title").textContent      = game.game;
  document.getElementById("game-tournament").textContent = game.tournament;

  // Aqui você define a imagem como background da seção
  const section = document.querySelector(".jogo");
  section.style.backgroundImage = `linear-gradient(to right, #1e1e1e, rgba(30, 30, 30, 0.9), transparent, transparent), url(${game.image})`;
  section.style.backgroundSize = "cover";
  section.style.backgroundPosition = "center";
  section.style.backgroundRepeat = "no-repeat";

  // Se você quiser, pode esconder a imagem antiga
  const img = document.getElementById("game-image");
  img.style.display = "none";

  localStorage.removeItem("selectedGame");
});
