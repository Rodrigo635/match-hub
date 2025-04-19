let contador = 12;
const total_Divs = document.querySelectorAll(".col-12.col-md-6.col-lg-3");
const { btn_VerMais, btn_VerMenos } = PegarSelector(contador);

for (let i = 12; i <= total_Divs.length; i++) {
  // Adiciona a classe "visivel-i" a cada div
  total_Divs[i].classList.add("d-none");
}

/* AUXILIARES */

// Seleciona a div, o botão "Ver mais" e o botão "Ver menos" com base no contador
function PegarSelector(contador) {
  return {
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
  const {btn_VerMais, btn_VerMenos } = PegarSelector(contador);

  if (contador != total_Divs.length) {
    for (let i = contador; i < contador + 8; i++) {
      total_Divs[i].classList.remove("d-none");
    }

    contador += 8;

    if(contador == total_Divs.length) {
      btn_VerMais.classList.add("d-none");
      btnVerMaisDesativado();
    }
  }

  // Se o contador for maior que 1, mostra o botão "Ver menos"
  if (contador > 12) {
    btn_VerMenos.classList.remove("d-none");
    btn_VerMenos.style.cursor = "pointer";
  }
}

// Ocultar jogos
function EsconderJogos() {
  const {btn_VerMais, btn_VerMenos } = PegarSelector(contador);

  if (contador > 12) {
    for (let i = contador - 8; i < contador; i++) {
      total_Divs[i].classList.add("d-none");
    }

    contador -= 8;
  }

  // Se o contador for menor ou igual a 12, esconde o botão "Ver menos" e mostra o botão "Ver mais"
  if (contador < total_Divs.length) {
    btn_VerMenos.classList.add("d-none");
    btn_VerMais.classList.remove("d-none");
    btnVerMaisAtivo();
  }
}

// Função principal para aplicar ambos os filtros
function AplicarFiltros() {
  // Seleciona todos os cards e os filtros
  const cards = document.querySelectorAll(".card");
  const jogo_Escolhido = document.getElementById("jogos").value.toLowerCase();
  const campeonato_Escolhido = document.getElementById("campeonatos").value.toLowerCase();

   // Variável para verificar se algum filtro está ativo
  let filtroAtivo = false;

  // 
  cards.forEach((card) => {
    const tituloJogo = card.querySelector("h5").innerText.toLowerCase();
    const tituloCampeonato = card.querySelector("h6").innerText.toLowerCase();
    let ExibirCard = true;

    // Verifica se o título do jogo contém o valor do filtro
    if (jogo_Escolhido !== "todos" && jogo_Escolhido !== "jogos") {
      ExibirCard = ExibirCard && tituloJogo.includes(jogo_Escolhido);
      filtroAtivo = true;
    }

    // Verifica se o título do campeonato contém o valor do filtro
    if (campeonato_Escolhido !== "todos" && campeonato_Escolhido !== "campeonatos") {
      ExibirCard = ExibirCard && tituloCampeonato.includes(campeonato_Escolhido);
      filtroAtivo = true;
    }

    card.parentElement.style.display = ExibirCard ? "block" : "none";
  });

  // Verifica se algum filtro está ativo e aplica a lógica de exibição
  if (filtroAtivo) {
    EsconderBtn();
    
    // Mostra todas as divs
    for (let i = 0; i < total_Divs.length; i++) {
      total_Divs[i].classList.remove("d-none");
    }
  }
  // Se não houver filtro ativo, aplica a lógica de exibição padrão
   else {
    const { btn_VerMais, btn_VerMenos } = PegarSelector(contador);
    btn_VerMais.classList.remove("d-none");
    btnVerMaisAtivo();

    for (let i = 12; i < total_Divs.length; i++) {
      total_Divs[i].classList.add("d-none");
    }
    contador = 12; 
  }
}


// Eventos que ocorre quando o usuario escolher um jogo ou campeonato
document.getElementById("jogos").addEventListener("change", AplicarFiltros);
document.getElementById("campeonatos").addEventListener("change", AplicarFiltros);