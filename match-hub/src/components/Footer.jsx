"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="footer text-white pt-5 pb-4" style={{ background: "linear-gradient(180deg, #000 0%, #0a0a0a 100%)" }}>
      <div className="container">
        <div className="row gy-4">
          {/* Logo + Descrição */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <Link href="/" className="d-inline-block mb-2 text-decoration-none">
              <span className="h4 text-azul fw-bold">MATCH </span>
              <span className="h4 fw-bold text-white">HUB</span>
            </Link>
            <h6>
              Acompanhe torneios, notícias e o mundo<br /> dos esports em um só lugar.
            </h6>
          </div>

          {/* Links de Navegação */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <h6 className="fw-bold mb-3 text-uppercase">Links de Navegação</h6>
            <ul className="list-unstyled d-flex flex-column flex-md-row gap-2 justify-content-center justify-content-md-end align-items-center align-items-md-end">
              <li>
                <Link
                  href="/"
                  className={`${pathname === "/" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/jogos"
                  className={`${pathname === "/jogos" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Jogos
                </Link>
              </li>
              <li>
                <Link
                  href="/calendario"
                  className={`${pathname === "/calendario" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Calendário
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className={`${pathname === "/sobre" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className={`${pathname === "/contato" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className={`${pathname === "/sitemap" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  Mapa do site
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary my-4" />

        <div className="row">
          {/* Direitos Autorais */}
          <div className="col text-start d-flex align-items-center">
            <h6 className="pb-0 mb-0">
              Todos os direitos reservados. Match Hub ©, 2025.
            </h6>
          </div>

          {/* Redes Sociais */}
          <div className="col-12 col-md-3 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="#" className="text-white fs-5"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="text-white fs-5"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="text-white fs-5"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
