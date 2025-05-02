document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("selectedGame");
  if (!raw) return console.error("Nenhum jogo em storage.");

  const game = JSON.parse(raw);
  document.getElementById("game-title").textContent      = game.game;
  document.getElementById("game-tournament").textContent = game.tournament;

  const video = document.getElementById("game-video");
  const source = document.getElementById("game-video-source");
  source.src = game.video; 
  video.load(); // recarrega o vídeo com a nova fonte

  // Se você quiser, pode esconder a imagem antiga
  const img = document.getElementById("game-image");
  img.style.display = "none";

  localStorage.removeItem("selectedGame");
});
