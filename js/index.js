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

function animarExibirCard(card, delayEmSegundos) {
  const delayEmMs = delayEmSegundos * 1000; // Converte segundos para milissegundos

  setTimeout(() => {
    card.style.setProperty("--card-delay", delayEmSegundos);
    const img = card.querySelector("img");
    const h5 = card.querySelector("h5");
    const h6 = card.querySelector("h6");

    img.classList.add("card-reveal-img");
    h5.classList.add("card-reveal-h5");
    h6.classList.add("card-reveal-h6");

    // Depois de 2 segundos, remove as classes
    setTimeout(() => {
      img.classList.remove("card-reveal-img");
      h5.classList.remove("card-reveal-h5");
      h6.classList.remove("card-reveal-h6");
    }, 2000);
  }, delayEmMs);
}

function animarEsconderCard(card, delay) {
  card.style.setProperty("--card-delay", delay);
  const img = card.querySelector("img");
  const h5 = card.querySelector("h5");
  const h6 = card.querySelector("h6");

  img.classList.add("card-hide-img");
  h5.classList.add("card-hide-h5");
  h6.classList.add("card-hide-h6");

  setTimeout(() => {
    img.classList.remove("card-hide-img");
    h5.classList.remove("card-hide-h5");
    h6.classList.remove("card-hide-h6");
  }, 1500);
}

function ExibirJogos() {
  // Calcula a quantidade de cards a serem exibidos (máximo 8 por vez)
  // Total_divs = total de thumbs
  // Contador = Número de cards que estão sendo exibidos
  const quantidadeCards = Math.min(8, total_Divs.length - contador);

  const tempoAnimacao = 650; //Tempo de exibição de cada card
  const tempoTotal = quantidadeCards * tempoAnimacao; // Tempo para exibir todos cards

  // Loop para exibir os novos cards um por um com delay
  for (let i = contador; i < contador + quantidadeCards; i++) {
    const card = total_Divs[i].querySelector(".card"); // Seleciona a thumb a ser exibida

    // Looping da animação
    setTimeout(() => {
      // Confere os cards 1 por 1 tirando o "d-none"
      total_Divs[i].classList.remove("d-none");

      // Chama a animação
      animarExibirCard(card);
    }, (i - contador) * tempoAnimacao); // Delay de cada thumb
  }

  // Atualiza o contador de cards exibidos
  contador += quantidadeCards;

  // Se todos os cards foram exibidos, oculta o botão "Ver Mais"
  if (contador >= total_Divs.length) {
    btn_VerMais.classList.add("d-none");
    btnVerMaisDesativado(); // Desativa o botão
  }

  // Exibe o botão "Ver Menos" somente depois que todos os cards forem exibidos
  setTimeout(() => {
    btn_VerMenos.classList.remove("d-none");
    btn_VerMenos.style.cursor = "pointer";
  }, tempoTotal);
}

function EsconderJogos() {
  const { btn_VerMais, btn_VerMenos } = PegarSelector(contador);

  // Esconde o botão "Ver Menos" ao começar a esconder os cards
  btn_VerMenos.classList.add("d-none");

  // Calcula a quantidade de cards a serem escondidos (máximo 8 por vez)
  const quantidadeCards = Math.min(8, contador - 12); 

  // Só executa se o contador for maior que 12 (significa que há cards a serem escondidos)
  if (contador > 12) {
    const tempoAnimacao = 250; // Tempo de animação de cada card
    let tempoTotal = 0; // Tempo total para esconder todos os cards

    // Loop para esconder os cards um por um com delay
    for (let i = contador - quantidadeCards; i < contador; i++) {
      const card = total_Divs[i].querySelector(".card"); // Seleciona a thumb a ser escondida

      // Chama a animação para esconder o card
      animarEsconderCard(card, contador - 1 - i);

      // Atualiza o tempo total considerando o delay de animação
      tempoTotal += tempoAnimacao;
    }

    // Após todas as animações, esconde os cards e atualiza os botões
    setTimeout(() => {
      // Esconde os cards com "d-none"
      for (let i = contador - quantidadeCards; i < contador; i++) {
        total_Divs[i].classList.add("d-none");
      }

      // Atualiza o contador de cards exibidos após o esconder
      contador -= quantidadeCards;

      // Atualiza os botões "Ver Mais" e "Ver Menos"
      if (contador <= 12) {
        btn_VerMenos.classList.add("d-none");
        btn_VerMenos.style.cursor = "default";
      }

      if (contador < total_Divs.length) {
        btn_VerMais.classList.remove("d-none");
        btnVerMaisAtivo(); // Ativa o botão
      }
    }, tempoTotal - 650); // Tempo total das animações de esconder
  }
}


// Função principal para aplicar ambos os filtros
function AplicarFiltros() {
  // Seleciona todos os cards e os filtros
  const cards = document.querySelectorAll(".card");
  const jogo_Escolhido = document.getElementById("jogos").value.toLowerCase();
  const campeonato_Escolhido = document
    .getElementById("campeonatos")
    .value.toLowerCase();

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
    if (
      campeonato_Escolhido !== "todos" &&
      campeonato_Escolhido !== "campeonatos"
    ) {
      ExibirCard =
        ExibirCard && tituloCampeonato.includes(campeonato_Escolhido);
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
document
  .getElementById("campeonatos")
  .addEventListener("change", AplicarFiltros);
