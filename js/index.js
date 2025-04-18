let contador = 1;
const total_Divs = document.querySelectorAll("[class*='visivel-']").length;
const { div_Visivel, btn_VerMais, btn_VerMenos } = PegarSelector(contador);

/* AUXILIARES */

// Seleciona a div, o botão "Ver mais" e o botão "Ver menos" com base no contador
function PegarSelector(contador) {
  return {
    div_Visivel: document.querySelector(".visivel-" + contador),
    btn_VerMais: document.querySelector(".ver-mais"),
    btn_VerMenos: document.querySelector(".ver-menos"),
  };
}

// Esconder botao apos selecionar algum filtro 
function EsconderBtn() {
  btn_VerMais.classList.add("d-none");
  btn_VerMenos.classList.add("d-none");
}

// Usado para voltar ao estado inicial apos tirar o filtro 
function btnVerMais() {
  btn_VerMais.classList.remove("d-none");
  btn_VerMais.innerHTML = "Ver mais";
  btn_VerMais.classList.add("cursor-pointer");
  btn_VerMais.style.cursor = "pointer";
}

// Usado para desativar o botao "ver mais" e alterar o texto 
function btnVerMaisFim() {
  btn_VerMais.innerHTML = "Em breve";
  btn_VerMais.classList.remove("cursor-pointer");
  btn_VerMais.style.cursor = "default"; // desativa o cursor
}

/* Ativa o "nowrap" */
function AlinharFiltros() {
  const rows = document.querySelectorAll(".row.g-3");

  rows.forEach(row => {row.style.flexWrap = "nowrap";}); // ou "initial", se quiser resetar
}

/* Ativa o "wrap" */
function AlinharInicial(){
  const rows = document.querySelectorAll(".row.g-3");

  rows.forEach(row => {row.style.flexWrap = "wrap";}); // ou "initial", se quiser resetar
}

/* Funcao */

// Exibir todos os jogos após tirar o filtro
function ExibirJogos() {
  
  //Verifica se existe alguma div ocultada, se sim remove o d-none
  if (div_Visivel.classList.contains("d-none")) {
    contador++;

    div_Visivel.classList.remove("d-none");

    btn_VerMenos.classList.remove("d-none");

     // Se o contador for maior que o total de divs, esconde o botão "Ver mais"
     contador > total_Divs && btnVerMaisFim();
  }
}

// Ocultar todos jogos e deixar apenas o filtrado 
function EsconderJogos() { 
  //Contador é decrementado para mostrar a ultima div visivel
  contador--;

  //Seleciona a Div, o botão "Ver mais" e o botão "Ver menos"
  div_Visivel.classList.add("d-none");
  btn_VerMais.innerHTML = "Ver mais";

  // Reativa o cursor do botão "Ver mais"
  btn_VerMais.classList.add("cursor-pointer");
  btn_VerMais.style.cursor = "pointer";

  // Se voltou para a primeira div, esconde o botão "Ver menos"
  if (contador == 1) {
    btn_VerMenos.classList.add("d-none");
  }
}

// Filtro para o jogo escolhido
function SelecionarJogo() {
  const cards = document.querySelectorAll(".card");
  const jogo_Escolhido = document.getElementById("jogos").value;

  const { div_Visivel, btn_VerMais, btn_VerMenos } = PegarSelector(1);

  for (let i = 1; i <= total_Divs; i++) {
    const div_Visivel = document.querySelector(".visivel-" + i);
    div_Visivel.classList.remove("d-none"); // Mostra todas as divs
  }

  cards.forEach((card) => {card.parentElement.style.display = "block";});

  // Filtra apenas se o jogo escolhido não for "Todos" ou "Jogos"
  if (jogo_Escolhido !== "Todos" && jogo_Escolhido !== "Jogos") {

    EsconderBtn(); // Esconde os botões "Ver mais" e "Ver menos"
    AlinharFiltros(); // Alinha os filtros para não quebrar o layout

    // Seleciona o card que contém o jogo escolhido
    cards.forEach((card) => {
      const titulo = card.querySelector("h5").innerText.toLowerCase();

      if (!titulo.includes(jogo_Escolhido.toLowerCase())) {
        card.parentElement.style.display = "none";
      }
    });
  } else {

    btnVerMais();
    AlinharInicial(); // Alinha os filtros para não quebrar o layout

    for (let i = 1; i <= total_Divs; i++) {
      const div_Visivel = document.querySelector(".visivel-" + i);
      div_Visivel.classList.add("d-none"); // Oculta todas as divs
    }

    contador = 1; // Reinicia o contador para a primeira div
  }
}

// Filtro para o campeonato escolhido 
function SelecionarCampeonato() {
  const cards = document.querySelectorAll(".card");
  const campeonato_Escolhido = document.getElementById("campeonatos").value;


  for (let i = 1; i <= total_Divs; i++) {
    const div_Visivel = document.querySelector(".visivel-" + i);
    div_Visivel.classList.remove("d-none"); // Mostra todas as divs
  }

  // Filtra apenas se o campeonato escolhido não for "Todos" ou "Campeonatos"
  if ( campeonato_Escolhido !== "Todos" &&campeonato_Escolhido !== "Campeonatos") {

    EsconderBtn();

    // Primeiro, oculta todos os cards
    cards.forEach((card) => {
      card.parentElement.style.display = "none";
    });

    // Em seguida, exibe os cards que correspondem ao campeonato escolhido
    cards.forEach((card) => {
      const titulo = card.querySelector("h6").innerText.toLowerCase();

      if (titulo.includes(campeonato_Escolhido.toLowerCase())) {
        card.parentElement.style.display = "block"; // Exibe o card que corresponde
      }   
    });


    AlinharFiltros(); // Alinha os filtros para não quebrar o layout


   
  } else {
    // Caso o valor selecionado seja "Todos" ou "Campeonatos", exibe todos os cards
    cards.forEach((card) => {
      card.parentElement.style.display = "block";
    });

    for (let i = 1; i <= total_Divs; i++) {
      const div_Visivel = document.querySelector(".visivel-" + i);
      div_Visivel.classList.add("d-none"); // Oculta todas as divs
    }

    btnVerMais();

    AlinharInicial(); // Alinha os filtros para não quebrar o layout
   
    contador = 1; // Reinicia o contador para a primeira div
  }
}


