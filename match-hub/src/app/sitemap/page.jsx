// src/app/sitemap/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Mapa do Site - MATCH HUB',
  description: 'Mapa do Site do Match Hub: navegue pelas seções disponíveis.',
};

export default function SitemapPage() {
  return (
    <main className="my-5 mapa">
        <link rel="stylesheet" href="/css/sitemap.css" />
      <div className="container my-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-3 text-white">Mapa do Site</h1>
          <h5 className="text-white-50">
            Explore todas as seções do Match Hub e encontre o que você precisa rapidamente!
          </h5>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-12 col-lg-3">
            <ul className="list-unstyled h-100 bg-dark text-white shadow p-4 rounded-3 mb-0">
              <li className="mb-3">
                <h5>
                  <Link href="/" className="text-azul sitemap-link">
                    Início
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/sobre" className="text-azul sitemap-link">
                    Sobre
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/contato" className="text-azul sitemap-link">
                    Contato
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/cadastro" className="text-azul sitemap-link">
                    Cadastro / Entrar
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/cadastro_concluido" className="text-azul sitemap-link">
                    Cadastro Concluído
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/admin" className="text-azul sitemap-link">
                    Painel administrativo
                  </Link>
                </h5>
              </li>
              <li className="mb-3">
                <h5>
                  <Link href="/perfil" className="text-azul sitemap-link">
                    Perfil
                  </Link>
                </h5>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-12 col-lg-6 mt-3 mt-lg-0 text-white">
            <img
              className="img-fluid rounded-4"
              src="/static/img/sitemap/sitemap.png"
              alt="Imagem do mapa do site"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
