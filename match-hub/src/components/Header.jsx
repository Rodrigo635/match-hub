"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { handleGetUser } from "@/app/global/global";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const u = await handleGetUser({ setToken, setUser });
      setUser(u);
    }
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    const offcanvasEl = document.getElementById("mainNavbarOffcanvas");
    const menuIcon = document.getElementById("menu");

    function handleShow() { menuIcon?.classList.add("active"); }
    function handleHide() { menuIcon?.classList.remove("active"); }

    if (offcanvasEl) {
      offcanvasEl.addEventListener("show.bs.offcanvas", handleShow);
      offcanvasEl.addEventListener("hide.bs.offcanvas", handleHide);
    }
    return () => {
      if (offcanvasEl) {
        offcanvasEl.removeEventListener("show.bs.offcanvas", handleShow);
        offcanvasEl.removeEventListener("hide.bs.offcanvas", handleHide);
      }
    };
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark p-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Brand */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <span className="h4 text-azul fw-bold mb-0">MATCH</span>
            <span className="h4 fw-bold text-white mb-0 ms-1">HUB</span>
          </Link>

          {/* Toggler: visível em telas pequenas -> abre offcanvas pela direita */}
          <button
            className="navbar-toggler border-0 d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainNavbarOffcanvas"
            aria-controls="mainNavbarOffcanvas"
            aria-label="Toggle navigation"
          >
            <a href="" id="menu"></a><i className="fa-solid fa-bars text-white"></i>
          </button>

          {/* NAV para telas >= lg (comportamento tradicional) */}
          <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex" id="mainNavbar">
            <form
              className="d-flex align-items-center mb-0 me-3 position-relative"
              role="search"
            >
              <input
                className="form-control bg-transparent text-white rounded-5 border-1 p-1"
                type="search"
                placeholder="Pesquisar..."
                aria-label="Search"
              />
              <img
                src="/static/icons/search.png"
                className="position-absolute"
                style={{ left: "0.75rem" }}
                width="17"
                height="17"
                alt="pesquisar"
              />
            </form>

            <ul className="navbar-nav d-flex mb-0 text-center me-3">
              <li className="nav-item">
                <Link href="/" className={`nav-link px-2 ${pathname === "/" ? "text-primary" : "text-white"}`}>
                  Início
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/jogos" className={`nav-link px-2 ${pathname === "/jogos" ? "text-primary" : "text-white"}`}>
                  Jogos
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/sobre" className={`nav-link px-2 ${pathname === "/sobre" ? "text-primary" : "text-white"}`}>
                  Sobre
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contato" className={`nav-link px-2 ${pathname === "/contato" ? "text-primary" : "text-white"}`}>
                  Contato
                </Link>
              </li>
            </ul>

            {user != null ? (
              <div className="d-flex align-items-center justify-content-center">
                <a href="/perfil"><i className="fa-solid fa-user-circle text-white fs-3"></i></a>
              </div>
            ) : (
              <Link href="/cadastro" className="btn-entrar text-white d-flex align-items-center">
                <p className="mb-0">Entrar<i className="fa-solid fa-arrow-right-to-bracket ms-2"></i></p>
              </Link>
            )}
          </div>

          {/* Offcanvas (apenas para telas pequenas) */}
          <div
            className="offcanvas offcanvas-end text-bg-dark bg-black d-lg-none"
            tabIndex="-1"
            id="mainNavbarOffcanvas"
            aria-labelledby="mainNavbarOffcanvasLabel"
          >
            <div className="offcanvas-header">
              <form className="d-flex align-items-center position-relative" role="search">
                <input className="form-control bg-transparent text-white rounded-5 border-1 p-1" type="search" placeholder="Pesquisar..." aria-label="Search" />
                <img src="/static/icons/search.png" className="position-absolute" style={{ left: "0.75rem" }} width="17" height="17" alt="pesquisar" />
              </form>
              <button type="button" className="btn-close btn-close-white me-1 " data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body">

              <ul className="navbar-nav mb-3 gap-3">
                <li className="nav-item"><Link href="/" className="btn btn-outline-primary d-flex rounded-3 justify-content-center" data-bs-dismiss="offcanvas"><p className="mb-0"><i className="fa-solid fa-house me-2"></i>Início</p></Link></li>
                <li className="nav-item"><Link href="/jogos" className="btn btn-outline-primary d-flex rounded-3 justify-content-center" data-bs-dismiss="offcanvas"><p className="mb-0"><i className="fa-solid fa-gamepad me-2"></i>Jogos</p></Link></li>
                <li className="nav-item"><Link href="/sobre" className="btn btn-outline-primary d-flex rounded-3 justify-content-center" data-bs-dismiss="offcanvas"><p className="mb-0"><i className="fa-solid fa-circle-info me-2"></i>Sobre</p></Link></li>
                <li className="nav-item"><Link href="/contato" className="btn btn-outline-primary d-flex rounded-3 justify-content-center" data-bs-dismiss="offcanvas"><p className="mb-0"><i className="fa-solid fa-phone me-2"></i>Contato</p></Link></li>
              </ul>

              {user != null ? (
                <div className="d-flex align-items-center justify-content-center">
                  <a href="/perfil"><i className="fa-solid fa-user-circle text-white fs-3"></i></a>
                </div>
              ) : (
                <Link href="/cadastro" className="btn-entrar text-white d-flex align-items-center justify-content-center" data-bs-dismiss="offcanvas">
                  <p className="mb-0">Entrar<i className="fa-solid fa-arrow-right-to-bracket ms-2"></i></p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
