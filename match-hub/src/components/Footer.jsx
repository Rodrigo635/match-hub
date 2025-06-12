// src/components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer bg-black py-5">
      <div className="container">
        <div className="row">
          {/* Logo Section */}
          <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
            <Link href="/" className="d-inline-block">
              <span className="h4 text-azul fw-bold">MATCH </span>
              <span className="h4 fw-bold text-white">HUB</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="col-12 col-md-6 nav-links">
            <ul className="nav justify-content-center justify-content-md-end flex-md-row gap-2">
              <li className="nav-item">
                <Link href="/" className="nav-link px-2 text-primary">
                  <h5 className="mb-0">Início</h5>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/sobre" className="nav-link px-2 text-white">
                  <h5 className="mb-0">Sobre</h5>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contato" className="nav-link px-2 text-white">
                  <h5 className="mb-0">Contato</h5>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/sitemap" className="nav-link px-2 text-white">
                  <h5 className="mb-0">Mapa do site</h5>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <h6 className="text-white text-center text-md-start mb-0">
              Todos os direitos reservados. Match Hub ©, 2025.
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
}
