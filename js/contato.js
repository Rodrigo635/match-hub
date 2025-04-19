const cards = document.querySelectorAll('.cards');
const radios = document.querySelectorAll('input[name="slide"]');

function ajustarAlturaBaseadaNoAtivo() {
  const cardAtivo = [...cards].find((label, index) => radios[index].checked);
  
  if (window.innerWidth < 991) {
    // Quando a largura da tela for menor que 991px, resetar as alturas
    cards.forEach(card => {
      card.style.height = 'auto';
    });
    return;
  }

  if (!cardAtivo) return;

  // Resetar alturas para pegar altura real do conteúdo
  cards.forEach(card => {
    card.style.height = 'auto';
  });

  const alturaConteudo = cardAtivo.querySelector('.conteudo-card').offsetHeight;

  // Aplicar altura a todos
  cards.forEach(card => {
    card.style.height = `${alturaConteudo}px`;
  });
}

// Escutar transição de width (quando o card se expande)
cards.forEach(card => {
  card.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'width') {
      ajustarAlturaBaseadaNoAtivo();
    }
  });
});

// Chamar a função ao carregar e redimensionar
window.addEventListener('load', ajustarAlturaBaseadaNoAtivo);
window.addEventListener('resize', ajustarAlturaBaseadaNoAtivo);
