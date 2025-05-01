// Carrega os cards iniciais
document.addEventListener("DOMContentLoaded", () => {
  fetch("thumbs.json") // Faz a requisição para o arquivo JSON
    .then((response) => response.json()) // Converte a resposta para JSON
    .then((data) => {
      const container = document.querySelector(".row.g-3");
      container.innerHTML = ""; // Limpa os cards existentes

      //// Determina o intervalo de cards a exibir (próximos 12)
      const inicio = contador; // O contador define de onde começa a exibição
      const fim = Math.min(inicio + 12, data.length); // Define o fim do intervalo
      const jogosExibidos = data.slice(inicio, fim); // Exibe até o fim ou 12 itens

      let tempoTotal = 0;

      jogosExibidos.forEach((item, index) => {
        const div = document.createElement("div");

        AlterarExibicao(div, item, container);

        // Animação dos cards
        const tempoAnimacao = 300; // Tempo de animação de cada card
        const posicao = index;
        const delayEmSegundos = posicao * (tempoAnimacao / 1000); // Define o delay da animação
        animarElementosDoCard(div, 1, delayEmSegundos); // Função de animação
        tempoTotal += tempoAnimacao;
      });

      // Atualiza o contador para o próximo intervalo
      contador = fim;

      btn_VerMenos.classList.add("d-none"); // Sempre exibe o botão "Ver Menos"
      btn_VerMenos.style.cursor = "pointer"; // Altera o cursor para "pointer"
    })
    .catch((error) => console.error("Erro ao carregar o JSON:", error)); // Tratamento de erro
});

// Eventos que ocorrem quando o usuário escolhe um jogo ou campeonato
document.getElementById("jogos").addEventListener("change", AplicarFiltros);
document
  .getElementById("campeonatos")
  .addEventListener("change", AplicarFiltros);

/* VÁRIAVEIS GLOBAIS */

let contador = 0; //total de jogos que estão sendo exibidos
let totalItens = 0; // Para armazenar o total de itens no JSON

/* AUXILIARES */

// Função responsável por selecionar os elementos da página (botões "Ver Mais" e "Ver Menos")
function PegarSelector() {
  // Retorna um objeto com os botões "Ver Mais" e "Ver Menos" selecionados pela classe
  return {
    btn_VerMais: document.querySelector(".ver-mais"),
    btn_VerMenos: document.querySelector(".ver-menos"),
  };
}

// Função que esconde os botões "Ver Mais" e "Ver Menos"
function EsconderBtn() {
  // Chama a função PegarSelector para pegar os botões
  const { btn_VerMais, btn_VerMenos } = PegarSelector();

  // Adiciona a classe 'd-none' para esconder os botões
  btn_VerMais.classList.add("d-none");
  btn_VerMenos.classList.add("d-none");
}

// Função que ativa o botão "Ver Mais", exibindo seu texto e alterando o cursor
function btnVerMaisAtivo() {
  // Chama a função PegarSelector para pegar o botão "Ver Mais"
  const { btn_VerMais } = PegarSelector();

  // Altera o texto do botão para "Ver mais"
  btn_VerMais.innerHTML = "Ver mais";

  // Altera o estilo do cursor para indicar que o botão é clicável
  btn_VerMais.style.cursor = "pointer";
}

// Função que desativa o botão "Ver Mais", limpando seu texto e alterando o cursor
function btnVerMaisDesativado() {
  // Chama a função PegarSelector para pegar o botão "Ver Mais"
  const { btn_VerMais } = PegarSelector();

  // Limpa o texto do botão
  btn_VerMais.innerHTML = "";

  // Altera o estilo do cursor para indicar que o botão não é clicável
  btn_VerMais.style.cursor = "default";
}

// Função responsável por criar as thumbs na tela
function AlterarExibicao(div, item, container) {
  div.className = "col-12 col-md-6 col-lg-3";
  div.innerHTML = `
    <div class="card bg-dark h-100">
      <img class="rounded-3" src="${item.image}" alt="${item.game}" />
      <h5 class="pt-3 ps-3 text-white fw-bold">${item.game}</h5>
      <h6 class="pb-3 ps-3 text-white">${item.tournament}</h6>
    </div>
  `;
  container.appendChild(div);

  div.addEventListener("click", () => {
    localStorage.setItem("selectedGame", JSON.stringify(item));
    window.location.href = "game.html";
  });
}

/* ANIMAÇÕES */

// Anima os elementos do card (imagem, título do jogo, e título do campeonato)
function animarElementosDoCard(card, modo, delay = 0) {
  const img = card.querySelector("img");
  const h5 = card.querySelector("h5");
  const h6 = card.querySelector("h6");

  // Limpar classes antigas
  img.classList.remove("card-reveal-img", "card-hide-img");
  h5.classList.remove("card-reveal-h5", "card-hide-h5");
  h6.classList.remove("card-reveal-h6", "card-hide-h6");

  if (modo === 1) {
    // Revelar
    img.classList.add("card-reveal-img");
    h5.classList.add("card-reveal-h5");
    h6.classList.add("card-reveal-h6");
  } else if (modo === 2) {
    // Esconder
    img.classList.add("card-hide-img");
    h5.classList.add("card-hide-h5");
    h6.classList.add("card-hide-h6");
  }
}

/* FUNÇÕES PRINCIPAIS */

// Função responsável a retornar as thumbs no modo inicial
function ThumbsInciais() {
  contador = 0; // Reinicia o contador
  fetch("thumbs.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".row.g-3");
      container.innerHTML = ""; // Limpa os cards existentes

      // Determina o intervalo de cards a exibir (sempre os primeiros 12)
      const inicio = 0; // Sempre começa do início
      const fim = Math.min(12, data.length); // Exibe até 12 cards ou o total disponível
      const jogosExibidos = data.slice(inicio, fim);
      const tempoAnimacao = 300;

      jogosExibidos.forEach((item, index) => {
        const div = document.createElement("div");
        AlterarExibicao(div, item, container);

        // Aplica animação
        const delayEmSegundos = index * (tempoAnimacao / 1000);
        animarElementosDoCard(div, 1, delayEmSegundos);
      });

      // Atualiza o contador para o próximo intervalo
      contador = fim;

      // Gerencia a visibilidade dos botões
      const { btn_VerMais, btn_VerMenos } = PegarSelector();
      btn_VerMenos.classList.add("d-none"); // Esconde "Ver Menos" inicialmente
      btn_VerMenos.style.cursor = "pointer";

      if (fim < data.length) {
        btn_VerMais.classList.remove("d-none");
        btnVerMaisAtivo();
      } else {
        btn_VerMais.classList.add("d-none");
        btnVerMaisDesativado();
      }
    })
    .catch((error) => console.error("Erro ao carregar o JSON:", error));
}

// Função para exibir os jogos
function ExibirJogos() {
  btnVerMaisDesativado();
  const { btn_VerMenos } = PegarSelector();

  fetch("thumbs.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".row.g-3");
      container.innerHTML = ""; // Limpa os cards existentes

      // Determina o intervalo de cards a exibir (próximos 12)
      const inicio = contador;
      const fim = Math.min(inicio + 12, data.length);
      const jogosExibidos = data.slice(0, fim); // Exibe todos até o fim

      const tempoAnimacao = 300;

      jogosExibidos.forEach((item, index) => {
        const div = document.createElement("div");
        AlterarExibicao(div, item, container);

        // Aplica animação apenas aos novos cards
        if (index >= inicio) {
          const posicao = index - inicio;
          const delayEmSegundos = posicao * (tempoAnimacao / 1000);
          animarElementosDoCard(div, 1, delayEmSegundos);
        }
      });

      // Atualiza o contador
      contador = fim;

      // Gerencia a visibilidade dos botões
      setTimeout(() => {
        const { btn_VerMais, btn_VerMenos } = PegarSelector();
        if (contador < data.length) {
          btn_VerMais.classList.remove("d-none");
          btnVerMaisAtivo();
        } else {
          btn_VerMais.classList.add("d-none");
          btnVerMaisDesativado();
        }

        if (contador > 12) {
          btn_VerMenos.classList.remove("d-none");
          btn_VerMenos.style.cursor = "pointer";
        } else {
          btn_VerMenos.classList.add("d-none");
        }
      }, tempoAnimacao + 450);
    })
    .catch((error) => console.error("Erro ao carregar o JSON:", error));
}

// Função para esconder os jogos
function EsconderJogos() {
  const { btn_VerMais, btn_VerMenos } = PegarSelector();

  fetch("thumbs.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".row.g-3");

      // Calcula quantos jogos devem permanecer visíveis (remove os últimos 8)
      const novosJogosExibidos = Math.max(0, contador - 8);
      const jogosExibidos = data.slice(0, novosJogosExibidos); // Jogos que vão permanecer

      // Primeiro, animar a remoção dos últimos cards
      const cardsAtuais = container.querySelectorAll(
        ".col-12.col-md-6.col-lg-3"
      );
      const cardsParaRemover = Array.from(cardsAtuais).slice(-8); // Pega os últimos 8 cards
      const tempoAnimacao = 300; // Ajuste o tempo de animação conforme necessário

      let tempoTotal = 0;

      // Aplica a animação e adiciona d-none aos últimos 8 cards
      cardsParaRemover.forEach((card, index) => {
        tempoTotal += tempoAnimacao; // Acumula o tempo total da animação

        const posicao = cardsParaRemover.length - 1 - index;
        const delayEmSegundos = posicao * (tempoAnimacao / 1000);

        // Anima o card (esconde o card (2 usado no tipo de condição))
        animarElementosDoCard(card, 2, delayEmSegundos);
      });

      // Após a animação, limpa o container e re-renderiza apenas os jogos que devem permanecer
      setTimeout(() => {
        // Atualiza o contador
        contador = jogosExibidos.length;

        // Limpa todos os cards após a animação
        container.innerHTML = "";

        // Renderiza os jogos que devem permanecer (sem animação)
        jogosExibidos.forEach((item) => {
          const div = document.createElement("div");
          div.className = "col-12 col-md-6 col-lg-3";
          AlterarExibicao(div, item, container);
        });

        // Gerencia a visibilidade dos botões
        if (contador <= 12) {
          btn_VerMenos.classList.add("d-none");
          btn_VerMenos.style.cursor = "default";
        } else {
          btn_VerMenos.classList.remove("d-none");
          btn_VerMenos.style.cursor = "pointer";
        }

        // Reativa o botão "Ver Mais" se houver jogos para exibir
        if (data.length > contador) {
          btn_VerMais.classList.remove("d-none");
          btnVerMaisAtivo();
        } else {
          btn_VerMais.classList.add("d-none");
          btnVerMaisDesativado();
        }
      }, tempoAnimacao + 450); // Converte o delay para milissegundos e aguarda a animação
    })
    .catch((error) => console.error("Erro ao carregar o JSON:", error));
}

// Função principal para aplicar ambos os filtros
async function AplicarFiltros() {
  const jogo_Escolhido = document.getElementById("jogos").value.toLowerCase();
  const campeonato_Escolhido = document
    .getElementById("campeonatos")
    .value.toLowerCase();

  try {
    // Carrega o JSON
    const resposta = await fetch("thumbs.json");
    const dados = await resposta.json();

    // Filtra os dados
    const filtrados = dados.filter((item) => {
      const jogo = item.game.toLowerCase();
      const campeonato = item.tournament.toLowerCase();

      const jogoOK =
        jogo_Escolhido === "todos" ||
        jogo_Escolhido === "jogos" ||
        jogo.includes(jogo_Escolhido);
      const campeonatoOK =
        campeonato_Escolhido === "todos" ||
        campeonato_Escolhido === "campeonatos" ||
        campeonato.includes(campeonato_Escolhido);

      return jogoOK && campeonatoOK;
    });

    const container = document.querySelector(".row.g-3");
    container.innerHTML = ""; // Limpa o container

    // Chama ResetarThumbs() se AMBOS os filtros estiverem no estado padrão
    if (
      (jogo_Escolhido === "todos" || jogo_Escolhido === "jogos") &&
      (campeonato_Escolhido === "todos" ||
        campeonato_Escolhido === "campeonatos")
    ) {
      ThumbsInciais(); // Exibe os primeiros 12 cards com paginação
    } else {
      // Adiciona os novos cards filtrados
      filtrados.forEach((item, index) => {
        const card = document.createElement("div");
        AlterarExibicao(card, item, container);

        // Aplica animação aos cards filtrados
        const tempoAnimacao = 300;
        const delayEmSegundos = index * (tempoAnimacao / 1000);
        animarElementosDoCard(card, 1, delayEmSegundos);
      });

      // Esconde os botões de paginação para filtros
      const { btn_VerMais, btn_VerMenos } = PegarSelector();
      btn_VerMais.classList.add("d-none");
      btn_VerMenos.classList.add("d-none");
    }
  } catch (erro) {
    console.error("Erro ao carregar os dados:", erro);
  }
}

// IDs dos cards que terão o mesmo comportamento
const cardIds = ['c1', 'c2', 'c3', 'c4'];

function handleCardClick(clickedId) {
  console.log("Card clicado:", clickedId);
  
  // Remove a classe de todos os cards
  cardIds.forEach(id => {
    const card = document.getElementById(id);
    card.classList.remove('card-width');
  });
  
  // Adiciona a classe apenas ao card clicado
  const clickedCard = document.getElementById(clickedId);
  clickedCard.classList.add('card-width');
  
  console.log("Elemento ativo:", clickedCard);
}

cardIds.forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    handleCardClick(id);
  });
});