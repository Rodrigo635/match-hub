// Função para alternar a visibilidade dos jogos
// Última data de alteração: 18/04/2025
// Descrição: Esta função alterna a visibilidade de uma lista de jogos, exibindo
// ou ocultando os jogos conforme a interação do usuário no botão "Ver mais" ou "Ver menos".

let contador = 1; // Usado para controlar o número de cliques no "Ver mais"

function ExibirJogos() {
  // Seleciona os elementos necessários
  var div_Jogos = document.querySelector(".visivel-" + contador); // Seleciona a div correspondente ao contador
  var btn_VerMais = document.querySelector(".ver-mais");
  var btn_VerMenos = document.querySelector(".ver-menos");

  // Verifica se a div de jogos está oculta
  if (div_Jogos.classList.contains("d-none")) {
    // Se estiver oculta, remove a classe 'd-none' para exibi-la
    div_Jogos.classList.remove("d-none");
    // Altera o texto do botão para "Em breve"
    btn_VerMais.innerHTML = "Em breve";
    btn_VerMenos.classList.remove("d-none"); // Exibe o botão "Ver menos"
    contador++;
  }
}

// Função para alternar a visibilidade dos jogos
// Última data de alteração: 18/04/2025

function EsconderJogos() {
  // Abaixa o contador para pegar a ultima div de jogos que foi exibida e faz a busca dela
  contador--;

  var div_Jogos = document.querySelector(".visivel-" + contador);

  // Adiciona a classe 'd-none' para esconder a div de jogos
  div_Jogos.classList.add("d-none");

  // Seleciona os botões "Ver mais" e "Ver menos"
  var btn_VerMais = document.querySelector(".ver-mais");
  var btn_VerMenos = document.querySelector(".ver-menos");

  // Altera o texto do botão "Ver mais" para o texto original
  btn_VerMais.innerHTML = "Ver mais";

  // Se o contator foi adicionado somente 1 vez, esconde o botão "Ver menos"
  if (contador == 1) {
    btn_VerMenos.classList.add("d-none");
  }
}
