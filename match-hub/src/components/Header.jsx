// src/components/Header.jsx
'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Header() {
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
                className="form-control bg-transparent text-white rounded-5 border-2 ps-4"
                type="search"
                placeholder="Pesquisar..."
                aria-label="Search"
              />
              <img
                src="/static/icons/search.png"
                className="position-absolute ms-2"
                style={{ left: '0.75rem' }}
                width="25"
                height="25"
                alt="pesquisar"
              />
            </form>

            {/* Nav items */}
            <ul className="navbar-nav d-flex mb-2 mb-lg-0 text-center me-lg-3">
              <li className="nav-item">
                <Link href="/" className="nav-link text-primary px-2">
                  <h5 className="mb-0">Início</h5>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/sobre" className="nav-link text-white px-2">
                  <h5 className="mb-0">Sobre</h5>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contato" className="nav-link text-white px-2">
                  <h5 className="mb-0">Contato</h5>
                </Link>
              </li>
            </ul>

            {/* Botão Entrar */}
            <Link href="/cadastro" className="btn-entrar text-white d-flex align-items-center">
              <h5 className="mb-0">
                Entrar<i className="fa-solid fa-arrow-right-to-bracket ms-2"></i>
              </h5>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
