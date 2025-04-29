document.addEventListener("DOMContentLoaded", () => {
    const raw = localStorage.getItem("selectedGame");
    if (!raw) return console.error("Nenhum jogo em storage.");
  
    const game = JSON.parse(raw);
    document.getElementById("game-title").textContent      = game.game;
    document.getElementById("game-tournament").textContent = game.tournament;
    document.getElementById("game-image").src              = game.image;
    document.getElementById("game-image").alt              = game.game;
  
    localStorage.removeItem("selectedGame");
  });
  