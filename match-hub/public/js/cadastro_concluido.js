const gifs = [
  "static/icons/sonic.gif",
  "static/icons/caveira.gif",
  "static/icons/cj.gif",
  "static/icons/gato.gif",
  "static/icons/link.gif",
  "static/icons/mario.gif",
  "static/icons/yasuo.gif",
  "static/icons/cs.gif",
  "static/icons/jett.gif",
  "static/icons/toasty.gif",
  "static/icons/clash.gif",
];

function carregarGifAleatorio() {
  alert("GIF carregado com sucesso!");
  const gifEscolhido = gifs[Math.floor(Math.random() * gifs.length)];
  const gifElement = document.getElementById("gif-concluido");
  if (gifElement) {
    gifElement.src = gifEscolhido;
    gifElement.classList.add("loaded");
  }
}

window.addEventListener("DOMContentLoaded", carregarGifAleatorio);
