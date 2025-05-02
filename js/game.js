function carregarCampeonatos(game) {
  if(!game.jogos) return;

  const campeonato = document.getElementById("campeonato");
  const time1 = document.getElementById("time1");
  const time2 = document.getElementById("time2");
  const data = document.getElementById("data");
  const horario = document.getElementById("horario");
  const link = document.getElementById("link-jogo");

  game.jogos.forEach(element => {
    campeonato.textContent = element.campeonato;
    time1.textContent = element.time1;
    time2.textContent = element.time2;
    data.textContent = element.data;
    horario.textContent = element.horario;
    link.href = element.link;
  });
}

function carregarJogo(game){
  document.getElementById("game-title").textContent      = game.game;
  document.getElementById("game-tournament").textContent = game.tournament;

  const video = document.getElementById("game-video");
  const source = document.getElementById("game-video-source");
  
  source.src = game.video; 
  video.load(); // recarrega o vídeo com a nova fonte




  // Se você quiser, pode esconder a imagem antiga
  const img = document.getElementById("game-image");
  img.style.display = "none";

}

function carregarPagina(){
  const raw = localStorage.getItem("selectedGame");
  if (!raw) return console.error("Nenhum jogo em storage.");

  const game = JSON.parse(raw);


  carregarCampeonatos(game);
  carregarJogo(game);

  
  localStorage.removeItem("selectedGame");
}


document.addEventListener("DOMContentLoaded", carregarPagina);
