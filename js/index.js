let contador = 1;
const total_Divs = document.querySelectorAll("[class*='visivel-']").length;
const { btn_VerMais, btn_VerMenos } = PegarSelector(contador);

/* AUXILIARES */

// Seleciona a div, o botão "Ver mais" e o botão "Ver menos" com base no contador
function PegarSelector(contador) {
  return {
    div_Visivel: document.querySelector(".visivel-" + contador),
    btn_VerMais: document.querySelector(".ver-mais"),
    btn_VerMenos: document.querySelector(".ver-menos"),
  };
}

function EsconderBtn() {
  btn_VerMais.classList.add("d-none");
  btn_VerMenos.classList.add("d-none");
}

function btnVerMais() {
  btn_VerMais.classList.remove("d-none");
  btn_VerMais.innerHTML = "Ver mais";
  btn_VerMais.classList.add("cursor-pointer");
  btn_VerMais.style.cursor = "pointer";
}

function btnVerMaisFim() {
  btn_VerMais.innerHTML = "Em breve";
  btn_VerMais.classList.remove("cursor-pointer");
  btn_VerMais.style.cursor = "default";
}

function AlinharFiltros() {
  const rows = document.querySelectorAll(".row.g-3");
  rows.forEach(row => { row.style.flexWrap = "nowrap"; });
}

function AlinharInicial() {
  const rows = document.querySelectorAll(".row.g-3");
  rows.forEach(row => { row.style.flexWrap = "wrap"; });
}

/* FUNÇÕES PRINCIPAIS */

// Exibir mais jogos
function ExibirJogos() {
  const div_Visivel = document.querySelector(".visivel-" + contador);

  if (div_Visivel.classList.contains("d-none")) {
    contador++;
    div_Visivel.classList.remove("d-none");
    btn_VerMenos.classList.remove("d-none");

     // Se o contador for maior que o total de divs, esconde o botão "Ver mais"
     contador > total_Divs && btnVerMaisFim();
  }
}

// Ocultar jogos
function EsconderJogos() {
  const div_Visivel = document.querySelector(".visivel-" + contador);
  contador--;

  div_Visivel.classList.add("d-none");
  btn_VerMais.innerHTML = "Ver mais";
  btn_VerMais.classList.add("cursor-pointer");
  btn_VerMais.style.cursor = "pointer";

  if (contador == 1) {
    btn_VerMenos.classList.add("d-none");
  }
}

// Função principal para aplicar ambos os filtros
function AplicarFiltros() {
  const cards = document.querySelectorAll(".card");
  const jogo_Escolhido = document.getElementById("jogos").value.toLowerCase();
  const campeonato_Escolhido = document.getElementById("campeonatos").value.toLowerCase();

  let filtroAtivo = false;

  cards.forEach((card) => {
    const tituloJogo = card.querySelector("h5").innerText.toLowerCase();
    const tituloCampeonato = card.querySelector("h6").innerText.toLowerCase();

    let mostrar = true;

    if (jogo_Escolhido !== "todos" && jogo_Escolhido !== "jogos") {mostrar = mostrar && tituloJogo.includes(jogo_Escolhido);filtroAtivo = true;}

    /* True se aplicar filtro */
    if (campeonato_Escolhido !== "todos" && campeonato_Escolhido !== "campeonatos") {
      mostrar = mostrar && tituloCampeonato.includes(campeonato_Escolhido);
      filtroAtivo = true;
    }

    card.parentElement.style.display = mostrar ? "block" : "none";
  });

  if (filtroAtivo) {
    EsconderBtn();
    AlinharFiltros();
    for (let i = 1; i <= total_Divs; i++) {
      document.querySelector(".visivel-" + i).classList.remove("d-none");
    }
  } else {
    btnVerMais();
    AlinharInicial();
    for (let i = 1; i <= total_Divs; i++) {
      document.querySelector(".visivel-" + i).classList.add("d-none");
    }
    contador = 1;
  }
}

// Eventos que ocorre quando o usuario escolher um jogo ou campeonato
document.getElementById("jogos").addEventListener("change", AplicarFiltros);
document.getElementById("campeonatos").addEventListener("change", AplicarFiltros);
