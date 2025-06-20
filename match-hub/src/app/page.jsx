import GamesList from '@/components/GamesList';
import VLibras from '@/components/VLibras';

export const metadata = {
  title: 'Home - MATCH HUB',
};

export default function HomePage() {
  return (
    <>

      <main className="mt-3 mb-5">
      
        <VLibras />
        <div className="container d-flex align-items-center justify-content-center">
          <div className="container-card">
            <input type="radio" name="card" id="c1" className="d-none" defaultChecked />
            <label htmlFor="c1" className="cards">
              <div className="conteudo-card">
                <div className="icon">1</div>
                <div className="descricao">
                  <h1 className="text-white fw-bold">
                    Acompanhe E-sports como nunca antes!
                  </h1>
                  <h5 className="text-white mb-3">
                    Esteja sempre ligado nas novidades de seus jogos favoritos.
                  </h5>
                </div>
              </div>
            </label>

            <input type="radio" name="card" id="c2" className="d-none" />
            <label htmlFor="c2" className="cards">
              <div className="conteudo-card">
                <div className="icon">2</div>
                <div className="descricao p-3">
                  <h1 className="text-white fw-bold">Campeonatos de CS</h1>
                  <h5 className="text-white mb-3">
                    Cobertura completa da BLAST Premier e PGL Major. Agenda de
                    torneios, highlights das jogadas épicas e rankings atualizados
                    das equipes TOP.
                  </h5>
                </div>
              </div>
            </label>

            <input type="radio" name="card" id="c3" className="d-none" />
            <label htmlFor="c3" className="cards">
              <div className="conteudo-card">
                <div className="icon">3</div>
                <div className="descricao">
                  <h1 className="text-white fw-bold">Ligas do LOL</h1>
                  <h5 className="text-white mb-3">
                    Perfis de jogadores profissionais, meta do patch atual e
                    cronograma do Campeonato Mundial.
                  </h5>
                </div>
              </div>
            </label>

            <input type="radio" name="card" id="c4" className="d-none" />
            <label htmlFor="c4" className="cards">
              <div className="conteudo-card">
                <div className="icon">4</div>
                <div className="descricao">
                  <h1 className="text-white fw-bold">E MUITO MAIS!</h1>
                  <h5 className="text-white mb-3">
                    Destaques de VALORANT Champions, cobertura de Rocket League
                    Championship Series e novidades de jogos emergentes como
                    Rainbow Six Siege e Apex Legends.
                  </h5>
                </div>
              </div>
            </label>
          </div>
        </div>
      </main>

      <GamesList />

      <section className="lista-funcoes-bg">
        <div className="container">
          <div className="row my-5">
            <div
              className="col-12 col-md-5 d-flex align-items-start justify-content-center flex-column texto-funcao"
            >
              <h1 className="text-white fw-bold">Construído para você!</h1>
              <div className="tracinho"></div>
              <ul className="text-white">
                <li className="mt-4">
                  <h5>
                    Nunca mais perca a chance de assistir os campeonatos ao vivo.
                  </h5>
                </li>
                <li className="mt-4">
                  <h5>
                    Acompanhe os seus torneios e jogadores favoritos de uma forma
                    fácil.
                  </h5>
                </li>
                <li className="mt-4">
                  <h5>
                    Sempre esteja atualizado das notícias mais importantes de seus
                    jogos favoritos.
                  </h5>
                </li>
                <li className="mt-4">
                  <h5>Saiba onde comprar ingressos e merchandises.</h5>
                </li>
                <li className="mt-4">
                  <h5>
                    Fique por dentro do meta e aprenda a jogar os jogos mais
                    competitivos do mercado.
                  </h5>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-7 imagem-funcao">
              <img
                className="img-fluid d-flex align-items-end justify-content-end"
                src="/static/img/index/Neon_Artwork_Full.png"
                alt="logo do match hub"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}