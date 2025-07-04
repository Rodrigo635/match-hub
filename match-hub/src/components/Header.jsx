"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByToken } from "@/app/services/userService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleGetUser } from "@/app/global/global";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const pathname = usePathname();
  const [token, setToken] = useState(null);

  useEffect(() => {
  async function fetchUser() {
    const user = await handleGetUser({ setToken, setUser });
    setUser(user);
  }

  fetchUser();
}, [pathname]);


  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark p-3">
        <div className="container d-flex w-100 justify-content-between">
          {/* Brand */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <span className="h4 text-azul fw-bold mb-0">MATCH</span>
            <span className="h4 fw-bold text-white mb-0 ms-1">HUB</span>
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="border-0 navbar-toggler-icon" id="menu"></span>
          </button>

          {/* Links colapsáveis */}
          <div
            className="collapse nav-links navbar-collapse justify-content-end"
            id="mainNavbar"
          >
            {/* Search form */}
            <form
              className="d-flex align-items-center mb-2 mb-lg-0 me-lg-3 mt-3 mt-lg-0 position-relative"
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

            {/* Nav items */}
            <ul className="navbar-nav d-flex mb-2 mb-lg-0 text-center me-lg-3">
              <li className="nav-item">
                <Link
                  href="/"
                  className={`nav-link px-2 ${
                    pathname === "/" ? "text-primary" : "text-white"
                  }`}
                >
                  <p className="mb-0">Início</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/sobre"
                  className={`nav-link px-2 ${
                    pathname === "/sobre" ? "text-primary" : "text-white"
                  }`}
                >
                  <p className="mb-0">Sobre</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/contato"
                  className={`nav-link px-2 ${
                    pathname === "/contato" ? "text-primary" : "text-white"
                  }`}
                >
                  <p className="mb-0">Contato</p>
                </Link>
              </li>
            </ul>

            {user != null ? (
              <div className="d-flex align-items-center w-md-0 w-lg-0 justify-content-center mt-3 mt-lg-0">
                <Image
                  src={user.profilePicture ?? "/static/icons/profileIcon.jpg"}
                  width={35}
                  height={35}
                  alt="Imagem de perfil"
                  className="rounded-circle "
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("/perfil");
                  }}
                />
              </div>
            ) : (
              <Link
                href="/cadastro"
                className="btn-entrar text-white d-flex align-items-center"
              >
                <p className="mb-0">
                  Entrar
                  <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i>
                </p>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
