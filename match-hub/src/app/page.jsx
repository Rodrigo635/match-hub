import HeroBanner from '@/components/HeroBanner';
import GamesList from '@/components/GamesList';

export const metadata = {
  title: 'Home - MATCH HUB',
};

export default function HomePage() {
  return (
    <>
      <main className='page-index'>
        <HeroBanner />
      </main>

      <GamesList initialItems={12} additionalItems={8} />

      <section className="lista-funcoes-bg">
        <div className="container">
          <div className="row my-5">
            <div
              className="construdo-para-voce col-12 col-md-5 d-flex align-items-start justify-content-center flex-column texto-funcao"
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