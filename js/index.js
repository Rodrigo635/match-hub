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

function btnVerMaisAtivo() {
  btn_VerMais.innerHTML = "Ver mais";
  btn_VerMais.style.cursor = "pointer";
}

function btnVerMaisDesativado() {
  btn_VerMais.innerHTML = "";
  btn_VerMais.style.cursor = "default";
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
    contador > total_Divs && btnVerMaisDesativado();
  }
}

// Ocultar jogos
function EsconderJogos() {
  //Contador diminuido para acessar a ultima div visivel
  contador--;
  const div_Visivel = document.querySelector(".visivel-" + contador);

  //Pega a div atual e esconde ela
  div_Visivel.classList.add("d-none");
  btnVerMaisAtivo();

  // Se a lista de jogos estiver no inicio, esconde o botão "Ver menos"
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

  // Percorre todos os cards um por um e verifica se o título do jogo ou do campeonato corresponde ao filtro selecionado
  cards.forEach((card) => {
    const tituloJogo = card.querySelector("h5").innerText.toLowerCase();
    const tituloCampeonato = card.querySelector("h6").innerText.toLowerCase();
    let ExibirCard = true; // Variável para controlar a exibição do card

    if (jogo_Escolhido !== "todos" && jogo_Escolhido !== "jogos") {
      // Verifica se o título do jogo contém o texto selecionado
      ExibirCard = ExibirCard && tituloJogo.includes(jogo_Escolhido);
      filtroAtivo = true;
    }

    /* True se aplicar filtro */
    if (campeonato_Escolhido !== "todos" && campeonato_Escolhido !== "campeonatos") {
      // Verifica se o título do campeonato contém o texto selecionado
      ExibirCard = ExibirCard && tituloCampeonato.includes(campeonato_Escolhido);
      filtroAtivo = true;
    }

    // Se o card não corresponder a nenhum dos filtros, esconde o card
    card.parentElement.style.display = ExibirCard ? "block" : "none";
  });

  // Se tiver filtro ativo, esconde o botão "Ver mais" e "Ver menos" e exibe os todos os cards filtrados
  if (filtroAtivo) {
    EsconderBtn();

    // Percorre todas as divs e deixa todas visiveis
    for (let i = 1; i <= total_Divs; i++) {
      document.querySelector(".visivel-" + i).classList.remove("d-none");
    }
  }
  // Volta ao estado inicial caso nao tenha filtro ativo
  else {
    btn_VerMais.classList.remove("d-none");
    btnVerMaisAtivo();

    // Esconde todas as divs, exceto a primeira
    for (let i = 1; i <= total_Divs; i++) {
      document.querySelector(".visivel-" + i).classList.add("d-none");
    }
    contador = 1;
  }
}

// Eventos que ocorre quando o usuario escolher um jogo ou campeonato
document.getElementById("jogos").addEventListener("change", AplicarFiltros);
document.getElementById("campeonatos").addEventListener("change", AplicarFiltros);
