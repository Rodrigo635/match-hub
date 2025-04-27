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


/* ANIMAÇÕES */

function animarElementosDoCard(card, modo, delay = 0) {
  const img = card.querySelector("img");
  const h5 = card.querySelector("h5");
  const h6 = card.querySelector("h6");

  // Limpar classes antigas
  img.classList.remove("card-reveal-img", "card-hide-img");
  h5.classList.remove("card-reveal-h5", "card-hide-h5");
  h6.classList.remove("card-reveal-h6", "card-hide-h6");

  // Sempre aplicar delay, tanto no modo 1 (revelar) quanto no modo 2 (esconder)
  img.style.animationDelay = `${delay}s`;
  h5.style.animationDelay = `${delay}s`;
  h6.style.animationDelay = `${delay}s`;

  if (modo === 1) {
    // Revelar
    img.classList.add("card-reveal-img");
    h5.classList.add("card-reveal-h5");
    h6.classList.add("card-reveal-h6");
  } 
  else if (modo === 2) {
    // Esconder
    img.classList.add("card-hide-img");
    h5.classList.add("card-hide-h5");
    h6.classList.add("card-hide-h6");
  }
}

/* FUNÇÕES PRINCIPAIS */

function ExibirJogos() {
  // Calcula a quantidade de cards a serem exibidos (máximo 8 por vez)
  // Total_divs = total de thumbs
  // Contador = Número de cards que estão sendo exibidos
  const quantidadeCards = Math.min(8, total_Divs.length - contador);

  const tempoAnimacao = 450; //Tempo de exibição de cada card
  const tempoTotal = quantidadeCards * tempoAnimacao; // Tempo para exibir todos cards

  // Loop para exibir os novos cards um por um com delay
  for (let i = contador; i < contador + quantidadeCards; i++) {
    const card = total_Divs[i].querySelector(".card"); // Seleciona a thumb a ser exibida

    // Looping da animação
    setTimeout(() => {
      

      // Chama a animação
      animarElementosDoCard(card, 1);
      // Confere os cards 1 por 1 tirando o "d-none"
      total_Divs[i].classList.remove("d-none");
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
  }, tempoTotal + 200);
}

function EsconderJogos() {
  const { btn_VerMais, btn_VerMenos } = PegarSelector(contador);

  // Esconde o botão "Ver Menos" enquanto a animação de esconder os cards é executada
  btn_VerMenos.classList.add("d-none");

  // Calcula a quantidade de cards a serem escondidos, com limite máximo de 8
  const quantidadeCards = Math.min(8, contador - 12);

  // Verifica se há mais de 12 cards para esconder
  if (contador > 12) {
    const tempoAnimacao = 250; // Tempo de animação para esconder os cards, em milissegundos
    let tempoTotal = 0; // Variável para armazenar o tempo total da animação

    // Loop para esconder os cards, de trás para frente (começando do último card exibido)
    for (let i = contador - 1; i >= contador - quantidadeCards; i--) {
      const card = total_Divs[i].querySelector(".card"); // Seleciona o card

      // Calcula a posição do card atual em relação ao contador
      const posicao = (contador - 1) - i; 
      const delayEmSegundos = posicao * (tempoAnimacao / 1000); // Calcula o delay baseado na posição

      // Chama a função para animar o card, passando o modo de esconder (2) e o delay
      animarElementosDoCard(card, 2, delayEmSegundos);

      tempoTotal += tempoAnimacao; // Acumula o tempo total da animação
    }

    // Após a animação, esconde os cards e atualiza o contador
    setTimeout(() => {
      for (let i = contador - 1; i >= contador - quantidadeCards; i--) {
        total_Divs[i].classList.add("d-none"); // Esconde o card

        // Limpa as classes de animação do card
        const card = total_Divs[i].querySelector(".card");
      }

      // Atualiza o contador de cards exibidos
      contador -= quantidadeCards;

      // Se o contador for menor ou igual a 12, esconde o botão "Ver Menos"
      if (contador <= 12) {
        btn_VerMenos.classList.add("d-none");
        btn_VerMenos.style.cursor = "default"; // Restaura o cursor padrão
      }

      // Se houver mais cards a serem exibidos, exibe o botão "Ver Mais"
      if (contador < total_Divs.length) {
        btn_VerMais.classList.remove("d-none");
        btnVerMaisAtivo(); // Ativa a função de "Ver Mais"
      }
    }, tempoTotal + 500); // Um pequeno ajuste de tempo para finalizar a animação
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
