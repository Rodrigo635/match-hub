"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="footer text-white pt-5 pb-4">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md text-center">
            <h6 className="fw-bold mb-3 text-uppercase">Navegação</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 justify-content-center justify-content-md-end align-items-center">
              <li>
                <Link
                  href="/"
                  className={`${pathname === "/" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-home me-2"></i>Início
                </Link>
              </li>
              <li>
                <Link
                  href="/jogos"
                  className={`${pathname === "/jogos" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-gamepad me-2"></i>Jogos
                </Link>
              </li>
              <li>
                <Link
                  href="/calendario"
                  className={`${pathname === "/calendario" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-calendar me-2"></i>Calendário
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md text-center">
            <h6 className="fw-bold mb-3 text-uppercase">Conta</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 justify-content-center justify-content-md-end align-items-center">
              <li>
                <Link
                  href="/cadastro"
                  className={`${pathname === "/cadastro" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-right-to-bracket me-2"></i>Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/perfil"
                  className={`${pathname === "/perfil" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-user me-2"></i>Seu Perfil
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md text-center">
            <h6 className="fw-bold mb-3 text-uppercase">Dados Legais</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 justify-content-center justify-content-md-end align-items-center">
              <li>
                <Link
                  href="/termos_de_uso"
                  className={`${pathname === "/termos_de_uso" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-handshake me-2"></i>Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas_de_privacidade"
                  className={`${pathname === "/politicas_de_privacidade" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-shield-halved me-2"></i>Políticas de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md text-center">
            <h6 className="fw-bold mb-3 text-uppercase">Links úteis</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 justify-content-center justify-content-md-end align-items-center">
              <li>
                <Link
                  href="/sobre"
                  className={`${pathname === "/sobre" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-info-circle me-2"></i>Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className={`${pathname === "/contato" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-phone me-2"></i>Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className={`${pathname === "/sitemap" ? "text-primary" : "text-white"} text-decoration-none`}
                >
                  <i className="fas fa-map me-2"></i>Mapa do Site
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
          <div className="col text-center text-md-end">
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
