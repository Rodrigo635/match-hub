function carregarCampeonatos(game) {
  if (!game.partidas) return;

  const campeonato = document.getElementById("campeonato");
  const time1 = document.getElementById("time1");
  const time2 = document.getElementById("time2");
  const data = document.getElementById("data");
  const horario = document.getElementById("horario");
  const link = document.getElementById("link-jogo");



  const container = document.getElementById("cards-container");
  game.partidas.forEach(element => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4";
    card.innerHTML = `
     <div class="card border-0 rounded-4 bg-dark">
  <div class="card-body bg-light p-4 rounded-5 bg-dark text-white">
    <h5 class="card-title text-primary fw-bold mb-3">
      ${element.campeonato}
    </h5>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="text-center">
        <img src="https://via.placeholder.com/60" class="rounded-circle mb-1" alt="${element.time1}">
        <p class="mb-0 fw-semibold">${element.time1}</p>
      </div>
      <div class="fw-bold fs-4">VS</div>
      <div class="text-center">
        <img src="https://via.placeholder.com/60" class="rounded-circle mb-1" alt="${element.time2}">
        <p class="mb-0 fw-semibold">${element.time2}</p>
      </div>
    </div>
    <p class="my-2">
      <span class="fw-bold">Data:</span> ${element.data} às ${element.horario}
    </p>
    <div class="d-grid mt-4">
      <a href="${element.link}" target="_blank" class="btn btn-live btn-outline-primary rounded-pill">
        <h5 class="mb-0 h5-btn-trasmissao"></h5>
      </a>
    </div>
  </div>
</div>
    `;
    container.appendChild(card);
  })
    ;
}

function carregarListaCampeonatos(game){
  const container = document.getElementById("campeonatos-container");
  game.campeonatos.forEach(element=>{
    console.log(element)
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4";
    card.innerHTML = `
       <div class="card bg-dark rounded-3 text-white mb-3"">
          <img class="card-img-top" src="./static/img/sobre/background-sobre.jpg" alt="Imagem de capa do card">
          <div class="card-body">
            <h4 class="fs-4 fw-bold camp text-center">${element}</h4>
          </div>
        </div>
    `;
    container.appendChild(card);
  })

}


function carregarJogo(game) {

  const gameTitleElements = document.querySelectorAll(".game-title");

  gameTitleElements.forEach(element => { element.textContent = game.game; });
  document.getElementById("game-genero").textContent = game.genero;
  document.getElementById("game-lancamento").textContent = game.lancamento;
  document.getElementById("game-desenvolvedora").textContent = game.desenvolvedora;
  document.getElementById("game-distribuidora").textContent = game.distribuidora;
  document.getElementById("game-idade-recomendada").textContent = game.idade_recomendada;
  document.getElementById("game-tournament").textContent = game.tournament;
  document.getElementById("game-descricao").textContent = game.descricao;
  document.getElementById("game-tags").textContent = game.tags.join(", ");
  document.getElementById("game-campeonatos").textContent = game.campeonatos.join(", ");



  const video = document.getElementById("game-video");
  const source = document.getElementById("game-video-source");

  source.src = game.video;
  video.load(); // recarrega o vídeo com a nova fonte




}

function bloquearBtnLink(game) {
  const btns = document.getElementsByClassName("btn-live");


  game.partidas.forEach((element, index) => {
    const agora = new Date();

    // Convertendo "DD/MM/YYYY" para "YYYY-MM-DD"
    const [dia, mes, ano] = element.data.split('/');
    const dataISO = `${ano}-${mes}-${dia}`; // "2025-05-04"

    // Criando objeto Date com data e hora juntos
    const partidaData = new Date(`${dataISO}T${element.horario}`);

    const diffMin = (partidaData - agora) / 60000; // diferença em minutos
    const mesmoDia = agora.toDateString() === partidaData.toDateString();

    const bloquear = !mesmoDia;

    if (bloquear && btns[index]) {
      btns[index].classList.add("disabled");
      btns[index].classList.remove("btn-outline-primary");
      btns[index].innerHTML = 'Transmissão não disponível <i class="fa-solid fa-lock ms-1"></i>';
      btns[index].disabled = true;
    } else {
      btns[index].textContent = 'Assistir Transmissão';
    }
    
  });
}

function carregarFiltros(game){
  addJogosFiltro(game.campeonatos);  
  console.log(game.partidas);
  console.log(game.partidas);
  addTimesFiltro(game.partidas.map((partida) => partida.time1), game.partidas.map((partida) => partida.time2));

}

function addJogosFiltro(data) {
  const select = document.getElementById("campeonatos-game");

  // Limpa o select
  select.innerHTML = '';

  // Adiciona a opção padrão
  const defaultOption = document.createElement("option");
  defaultOption.value = "Campeonatos";
  defaultOption.textContent = "Campeonatos";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  select.appendChild(defaultOption);

  const allGames = document.createElement("option");
  allGames.value = "Todos";
  allGames.textContent = "Todos";
  select.appendChild(allGames);

  // Adiciona as opções de jogos
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function addTimesFiltro(time1, time2) {
  const select = document.getElementById("campeonatos-time");
  console.log(time1);
  console.log(time2);
  // Limpa o select
  select.innerHTML = '';

  // Adiciona a opção padrão
  const defaultOption = document.createElement("option");
  defaultOption.value = "Times";
  defaultOption.textContent = "Times";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  select.appendChild(defaultOption);

  const allGames = document.createElement("option");
  allGames.value = "Todos";
  allGames.textContent = "Todos";
  select.appendChild(allGames);

  // Usar Set para evitar duplicados
  const uniqueItems = new Set();

  const times = [...time1, ...time2];
  

  times.forEach((item) => {
    if (!uniqueItems.has(item)) {
      uniqueItems.add(item);
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
      console.log(item);
    }
  });
}




function carregarPagina() {
  const raw = localStorage.getItem("selectedGame");
  if (!raw) window.location.href = "index.html";

  const game = JSON.parse(raw);


  carregarCampeonatos(game);
  bloquearBtnLink(game);
  carregarJogo(game);
  carregarFiltros(game);


  localStorage.removeItem("selectedGame");
}





document.addEventListener("DOMContentLoaded", carregarPagina);
