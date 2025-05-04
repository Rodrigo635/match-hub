// --- Integração do VLibras ---
function initializeVLibras() {
    // Verifica se o VLibras já está carregado para evitar duplicatas
    if (document.querySelector('div[vw]')) {
      return;
    }
  
    // Cria o elemento do widget do VLibras
    const vwDiv = document.createElement('div');
    vwDiv.setAttribute('vw', '');
    vwDiv.className = 'enabled';
  
    const accessButton = document.createElement('div');
    accessButton.setAttribute('vw-access-button', '');
    accessButton.className = 'active';
  
    const pluginWrapper = document.createElement('div');
    pluginWrapper.setAttribute('vw-plugin-wrapper', '');
  
    const topWrapper = document.createElement('div');
    topWrapper.className = 'vw-plugin-top-wrapper';
  
    pluginWrapper.appendChild(topWrapper);
    vwDiv.appendChild(accessButton);
    vwDiv.appendChild(pluginWrapper);
  
    // Adiciona o widget ao body
    document.body.appendChild(vwDiv);
  
    // Carrega o script do VLibras dinamicamente
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
      // Inicializa o widget após o script carregar
      new window.VLibras.Widget({
        rootPath: 'https://vlibras.gov.br/app', // Caminho base para os assets do VLibras
        position: 'R', // Posição do widget: 'R' (direita), 'L' (esquerda), 'T' (topo)
        avatar: 'Lara', // Altere para o avatar desejado (ex.: 'Lara', 'Grok', 'Mestre')
        opacity: 0.8, // Opacidade do widget
      });
    };
    document.body.appendChild(script);
  }
  
  // Executa a inicialização do VLibras quando a página carrega
  document.addEventListener('DOMContentLoaded', initializeVLibras);