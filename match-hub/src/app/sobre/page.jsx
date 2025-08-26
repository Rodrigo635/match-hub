// src/app/sobre/page.js
export const metadata = {
  title: 'Sobre - MATCH HUB',
  description: 'Saiba mais sobre o Match Hub, arquitetura, funcionalidades, público-alvo e mercado.',
};

export default function SobrePage() {
  return (
    <main className="page-sobre">
      {/* Sobre o Match Hub */}
      <link rel="stylesheet" href="/css/sobre.css" />
      <section className="imagem-bg py-5">
        <div className="container">
          <div className="row my-4 gap-4">
            <div className="col-lg-6 h-100">
              <h1 className="fw-bold mb-4 mt-md-4 text-white">Se é e-sport, está no Match Hub!</h1>
              <h5 className="mb-4 mt-md-0 texto-justificado text-white">
                O Match Hub é a plataforma definitiva para os
                fãs de e-sports! Centralizamos todas as informações sobre os
                principais campeonatos, como
                League of Legends, CS:GO, Dota 2, Valorant e
                muito mais.
              </h5>
              <h5 className="mb-4 mt-md-0 texto-justificado text-white">
                Nossa missão é tornar o acompanhamento dos jogos mais fácil e
                acessível, oferecendo uma visão clara dos
                próximos eventos, horários e detalhes essenciais.
              </h5>
              <h5 className="mb-4 mt-md-0 texto-justificado text-white">
                Clique no botão abaixo e conheça tudo sobre nosso projeto
                através da nossa documentação disponível para
                download!
              </h5>
              <a className="btn-ir-para-docs" href="#docs">
                <h5 className="mb-0">
                  Ir para Documentação <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>

            <div className="col mb-lg-0">
              <div className="ratio ratio-16x9 h-100 video-apresentacao rounded-4">
                <iframe
                  className="rounded-4"
                  src="https://www.youtube.com/embed/iK2lrtsPago?si=c94xQm1tmfht0ih3"
                  title="YouTube video"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitetura do Projeto */}
      <section className="py-5 bg-cinza">
        <div className="container">
          <div className="row gap-4 my-4">
            <div className="col mb-4 mb-lg-0 order-lg-2">
              <img
                src="/static/img/sobre/montar-pc-gamer-shutterstock_1430140055.jpg"
                alt="Equipe de e-sports competindo"
                className="img-fluid img-custom h-100"
              />
            </div>
            <div className="col-lg-6 order-lg-1">
              <h1 className="mb-4 text-white fw-bold">🌐 Arquitetura do Projeto</h1>
              <h5 className="text-white mb-4 texto-justificado">
                O Match Hub é um software construído utilizando as tecnologias
                JavaScript, HTML5 e CSS3. A partir dessas tecnologias, é possível haver uma
                ampla compatibilidade com diferentes tipos de dispositivos e
                sistemas operacionais.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Os dispositivos que podem utilizar esse software são:
                Computadores pessoais (com processadores x86 ou ARM, que são
                capazes de rodar os navegadores modernos) e dispositivos móveis
                são compatíveis desde que possuam navegadores atualizados e com
                suporte ao HTML5 e CSS3.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Em relação aos sistemas operacionais que podem executar o Match
                Hub, são todos aqueles que possam executar os navegadores, sendo
                tanto desktop (Windows, macOS e Linux), quanto mobile (Android e
                iOS), tendo em vista que a plataforma possui responsividade.
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Principais */}
      <section className="py-5">
        <div className="container my-4">
          <h1 className="text-center text-azul fw-bold">Funcionalidades Principais</h1>
          <h3 className="text-center mb-4 mb-lg-5 text-white">O que oferecemos em uma plataforma?</h3>
          <div className="funcionalidades row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card-item2 text-center p-4 rounded-4 bg-dark text-white">
                <div className="icon-card">🏆</div>
                <h4 className="text-center fw-bold">Página Inicial (Home)</h4>
                <h5 className="text-center text-cinza">
                  Informações como horário, times e campeonatos dos eventos de e-sports ao vivo para que você nunca perca
                  uma grande partida!
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card-item2 text-center p-4 rounded-4 bg-dark text-white">
                <div className="icon-card">📅</div>
                <h4 className="text-center fw-bold">Calendário de Eventos</h4>
                <h5 className="text-center text-cinza">
                  Use filtros inteligentes para encontrar os campeonatos, partidas por data,
                  equipe ou título do jogo.
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card-item2 text-center p-4 rounded-4 bg-dark text-white">
                <div className="icon-card">👤</div>
                <h4 className="text-center fw-bold">Cadastre-se</h4>
                <h5 className="text-center text-cinza">
                  Crie sua conta e participe da nossa comunidade, seja você um jogador profissional ou entusiasta!
                </h5>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card-item2 text-center p-4 rounded-4 bg-dark text-white">
                <div className="icon-card">🚀</div>
                <h4 className="text-center fw-bold">Futuras Implementações</h4>
                <h5 className="text-center text-cinza">
                  Estamos preparando novidades incríveis, acompanhe nosso projeto e veja mais sobre ele na documentação!
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reflexão Cultural e ESG */}
      <section className="py-5 bg-cinza">
        <div className="container">
          <div className="row gap-4 my-4">
            <div className="col mb-4 mb-lg-0">
              <img
                src="/static/img/sobre/esg.png"
                alt="Equipe de e-sports competindo"
                className="img-fluid img-custom h-100"
              />
            </div>
            <div className="col-lg-6">
              <h1 className="mb-4 text-white fw-bold">Reflexão Cultural e sobre ESG</h1>
              <h5 className="text-white mb-4 texto-justificado">
                Código eficiente: incentivar práticas de programação que reduzam consumo de energia (menos requisições,
                menor uso de CPU).
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Redução de pegada digital: limitar o uso excessivo de imagens pesadas, autoplay de vídeos, dark mode como
                padrão para economizar energia.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Infraestrutura: escolher provedores de hospedagem e nuvem que utilizem energia renovável (ex: AWS com selo
                verde, Google Cloud neutro em carbono).
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Representatividade também é parte do nosso compromisso. No universo dos e-sports, personagens como
                Raze, brasileira e de raízes afrodescendentes no jogo Valorant, reforçam a
                importância de visões diversas na construção de narrativas. Valorizamos a presença de figuras que traduzem
                a riqueza cultural do Brasil, com sua energia, linguagem e estilo únicos.
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Público-Alvo */}
      <section className="py-5 lista-alvos-bg">
        <div className="container my-4">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 d-flex align-items-start justify-content-center flex-column texto-alvos">
              <h1 className="text-left fw-bold text-azul">Público-Alvo</h1>
              <h3 className="text-left text-white mb-4">Quem faz parte desse universo?</h3>
              <ul className="text-white">
                <li className="mt-0 bg-dark rounded-3 p-3 alvo-card">
                  <h4><i className="fa-solid fa-gamepad text-azul"></i>Jogadores Competitivos e Casuais</h4>
                  <h5 className="text-cinza">Seja um pro player ou apenas alguém que joga por diversão, essa plataforma é para você!</h5>
                </li>
                <li className="bg-dark rounded-3 mt-3 p-3 alvo-card">
                  <h4><i className="fa-solid fa-trophy text-azul"></i>Organizações de e-sports</h4>
                  <h5 className="text-cinza">Equipes e gestores que buscam visibilidade, competições e oportunidades no cenário.</h5>
                </li>
                <li className="bg-dark rounded-3 mt-3 p-3 alvo-card">
                  <h4><i className="fa-solid fa-money-bill-trend-up text-azul"></i>Patrocinadores e Investidores</h4>
                  <h5 className="text-cinza">O mercado de e-sports está em alta! Conecte-se com um público apaixonado e engajado.</h5>
                </li>
                <li className="bg-dark rounded-3 mt-3 p-3 alvo-card">
                  <h4><i className="fa-solid fa-tv text-azul"></i>Transmissoras e Criadores de Conteúdo</h4>
                  <h5 className="text-cinza">Streamers, casters e produtores que querem levar o melhor dos e-sports para o mundo.</h5>
                </li>
                <li className="bg-dark rounded-3 mt-3 p-3 alvo-card">
                  <h4><i className="fa-solid fa-fire text-azul"></i>Fãs e Entusiastas</h4>
                  <h5 className="text-cinza">Para aqueles que vibram a cada jogada e acompanhem cada torneio como se fosse uma final de Copa do Mundo!</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mercado em Ascensão */}
      <section className="py-5 bg-cinza">
        <div className="container">
          <div className="row gap-4 my-4">
            <div className="col">
              <table className="table table-striped table-dark table-hover text-center h-100 mb-0">
                <thead>
                  <tr className="titulo-table">
                    <th><h5 className="mb-0">Evento (Jogo)</h5></th>
                    <th><h5 className="mb-0">2022</h5></th>
                    <th><h5 className="mb-0">2023</h5></th>
                    <th><h5 className="mb-0">2024</h5></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Worlds Championship (LoL)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$84M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$96M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$110M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Paris Major (CS2)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$25M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$31M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$38M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Champions Los Angeles (Valorant)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$18M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$24M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$30M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">The International (Dota 2)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$40M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$35M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$42M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Fortnite World Cup (Fortnite)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$30M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$27M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$33M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">DreamHack Winter (CS2/LoL)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$15M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$19M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">$22M</h6></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-6">
              <h1 className="mb-4 mt-2 mt-lg-4 fw-bold text-white">Um Mercado em Ascensão: Sua Próxima Oportunidade</h1>
              <h5 className="text-white mb-4 texto-justificado">
                Em 2023, o setor de e-sports ultrapassou a marca de US$ 3,8 bilhões em faturamento, com uma projeção de
                crescimento anual de 12,7%.
                (Fonte: Newzoo)
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Com mais de 500 milhões de espectadores ao redor do mundo, os e-sports se consolidaram como um dos
                segmentos mais promissores do entretenimento digital.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Diante desse cenário aquecido, o Match Hub surge como a ponte entre
                investidores e um mercado em plena expansão.
                Estamos aqui para conectar você às melhores oportunidades no universo dos e-sports.
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Comunidade Gigantesca */}
      <section className="py-5">
        <div className="container">
          <div className="row gap-4 my-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="mb-4 fw-bold text-white">🌍 Comunidade Gigantesca</h1>
              <h5 className="text-white mb-4 texto-justificado">
                Nos últimos 10 anos, a comunidade de e-sports triplicou de tamanho, tornando-se uma das maiores e mais
                engajadas do entretenimento digital.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Atualmente, são mais de 530 milhões de fãs globais movimentando bilhões de dólares e transformando os
                e-sports em um dos mercados mais promissores da atualidade.
                (Fonte: Newzoo, 2023)
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Visamos trazer um software capaz de ajudar essa comunidade e
                solucionar a dificuldade que é acompanhar esse cenário competitivo que cresce cada vez mais.
              </h5>
            </div>
            <div className="col">
              <table className="table table-striped table-dark table-hover text-center h-100 mb-0">
                <thead>
                  <tr className="titulo-table">
                    <th><h5 className="mb-0">Evento (Jogo)</h5></th>
                    <th><h5 className="mb-0">2022</h5></th>
                    <th><h5 className="mb-0">2023</h5></th>
                    <th><h5 className="mb-0">2024</h5></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Worlds Championship (LoL)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">5.1M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">6.4M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">7.1M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Paris Major (CS2)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.3M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.5M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.8M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Champions Los Angeles (Valorant)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">0.9M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.2M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.6M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">The International (Dota 2)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.5M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.4M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.6M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Fortnite World Cup (Fortnite)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">2.3M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">2.1M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">2.4M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">DreamHack Winter (CS2/LoL)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.8M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">2.1M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">2.3M</h6></td>
                  </tr>
                  <tr>
                    <td className="p-1 p-md-3"><h6 className="mb-0">Six Invitational (R6)</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">0.6M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">0.8M</h6></td>
                    <td className="p-1 p-md-3"><h6 className="mb-0">1.0M</h6></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Frase / Comunidade Indígena */}
      <section className="frase py-5">
        <div className="container py-4">
          <div className="row d-flex align-items-center">
            <div className="col-md-12 col-lg-6">
              <h1 className="text-left fw-bold text-white mb-4">
                A Comunidade é Grande e a Cultura Também!
              </h1>
              <h5 className="text-white mb-4 texto-justificado">
                A Copa das Aldeias é o primeiro campeonato de Free Fire
                exclusivo para comunidades indígenas do Brasil. Reunindo mais de 40 etnias, o torneio é um marco de
                inclusão e representatividade nos e-sports.
              </h5>
              <h5 className="text-white mb-4 texto-justificado">
                Mais do que competição, a copa celebra a cultura, a força e o
                talento dos povos indígenas, levando suas vozes e tradições para o universo gamer. É uma prova de que o
                jogo também pode ser espaço de identidade, orgulho e transformação social.
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Documentação (download) */}
      <section id="docs" className="bg-cinza py-5">
        <div className="container my-4">
          <h1 className="text-center text-azul fw-bold">Documentação</h1>
          <h3 className="text-center text-white mb-4 mb-lg-5">
            Faça download e descubra mais através da nossa documentação!
          </h3>
          <div className="row justify-content-center gap-4">
            <div className="col">
              <a
                className="doc-btn"
                href="/download/Projeto_Happy_Game_Match_Hub_Fase_1.pdf"
                download
              >
                <h5 className="mb-0">
                  Fase 1 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            <div className="col">
              <a
                className="doc-btn"
                href="/download/Projeto_Happy_Game_Match_Hub_Fase_2.pdf"
                download
              >
                <h5 className="mb-0">
                  Fase 2 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            <div className="col">
              <a
                className="doc-btn"
                href="/download/Projeto_Happy_Game_Match_Hub_Fase_3.pdf"
                download
              >
                <h5 className="mb-0">
                  Fase 3 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            {/* Fases não disponíveis */}
            <div className="col">
              <a className="doc-btn"
                href="/download/Projeto_Happy_Game_Match_Hub_Fase_4.pdf"
                download
              >
                <h5 className="mb-0">
                  Fase 4 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            <div className="col">
              <a className="doc-btn-disabled">
                <h5 className="mb-0">
                  Fase 5 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            <div className="col">
              <a className="doc-btn-disabled">
                <h5 className="mb-0">
                  Fase 6 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
            <div className="col">
              <a className="doc-btn-disabled">
                <h5 className="mb-0">
                  Fase 7 <i className="fa-solid fa-download"></i>
                </h5>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
