"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading, refreshUser } = useUser();

  // Atualiza os dados do usuário quando a rota muda
  useEffect(() => {
    refreshUser();
  }, [pathname]);

  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const bellRefMobile = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 320 });

  const positionDropdown = (btnEl) => {
    if (!btnEl) return;
    const rect = btnEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const dropdownW = Math.min(360, Math.max(280, Math.floor(viewportW * 0.32)));
    let left = rect.right - dropdownW;
    if (left < 8) left = 8;
    if (left + dropdownW > viewportW - 8) left = viewportW - dropdownW - 8;
    const top = rect.bottom + 8 + window.scrollY;
    setDropdownStyle({ top, left, width: dropdownW });
  };

  const handleToggle = (e, mobile = false) => {
    e?.preventDefault();
    const btn = mobile ? bellRefMobile.current : bellRef.current;
    if (!open) {
      positionDropdown(btn);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    function handleDown(e) {
      if (!open) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (bellRef.current?.contains(e.target)) return;
        if (bellRefMobile.current?.contains(e.target)) return;
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("touchstart", handleDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("touchstart", handleDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!open) return;
      const btn = (window.innerWidth >= 992 ? bellRef.current : bellRefMobile.current);
      positionDropdown(btn);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [open]);

  const handleOpenMatch = (match) => {
    setOpen(false);
  };

  // Formata notificações do backend
  const upcomingMerged = user?.notifications ? user.notifications.map(notif => ({
    id: notif.id,
    matchId: notif.matchId,
    subTitle: notif.gameName || notif.championshipName,
    championshipName: notif.championshipName,
    gameName: notif.gameName,
    tounamentName: notif.tounamentName,
    time1: notif.teams?.[0] || "Time 1",
    time2: notif.teams?.[1] || "Time 2",
    date: new Date(notif.scheduledAt).toLocaleDateString("pt-BR"),
    time: new Date(notif.scheduledAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    message: notif.message,
    type: notif.type,
    read: notif.read
  })) : [];

  // Ordena por data
  upcomingMerged.sort((a, b) => {
    const da = `${a.date.split('/').reverse().join('-')}T${a.time}`;
    const db = `${b.date.split('/').reverse().join('-')}T${b.time}`;
    return new Date(da) - new Date(db);
  });

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark py-3">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Brand */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <span className="h4 text-azul fw-bold mb-0">MATCH</span>
            <span className="h4 fw-bold text-white mb-0 ms-1">HUB</span>
          </Link>

          {/* Toggler - mobile */}
          <div className="d-flex align-items-center d-lg-none">
            {user != null && (
              <button
                type="button"
                ref={bellRefMobile}
                className="btn btn-bell-mobile me-2"
                aria-label="Notificações rápidas (mobile)"
                onClick={(e) => handleToggle(e, true)}
              >
                <i className="fas fa-bell"></i>
              </button>
            )}

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mainNavbarOffcanvas"
              aria-controls="mainNavbarOffcanvas"
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars text-white"></i>
            </button>
          </div>

          {/* NAV desktop */}
          <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex" id="mainNavbar">
            <ul className="navbar-nav d-flex mb-0 text-center me-0">
              <li className="nav-item"><Link href="/" className={`nav-link px-2 ${pathname === "/" ? "text-primary" : "text-white"}`}>Início</Link></li>
              <li className="nav-item"><Link href="/jogos" className={`nav-link px-2 ${pathname === "/jogos" ? "text-primary" : "text-white"}`}>Jogos</Link></li>
              <li className="nav-item"><Link href="/calendario" className={`nav-link px-2 ${pathname === "/calendario" ? "text-primary" : "text-white"}`}>Calendário</Link></li>
              <li className="nav-item"><Link href="/sobre" className={`nav-link px-2 ${pathname === "/sobre" ? "text-primary" : "text-white"}`}>Sobre</Link></li>
              <li className="nav-item"><Link href="/contato" className={`nav-link px-2 ${pathname === "/contato" ? "text-primary" : "text-white"}`}>Contato</Link></li>
            </ul>

            <div className="d-flex align-items-center justify-content-center gap-2">
              {/* bell desktop */}
              {user != null && (
                <button
                  type="button"
                  ref={bellRef}
                  className="btn btn-bell"
                  aria-label="Notificações rápidas"
                  onClick={(e) => handleToggle(e, false)}
                  title="Próximos jogos das notificações ligadas"
                >
                  <i className="fas fa-bell mx-3"></i>
                </button>
              )}

              {loading ? (
                <div className="rounded-circle" style={{ width: 34, height: 34, backgroundColor: '#ccc' }} />
              ) : (
                user != null ? (
                    <Link href="/perfil">
                      <Image src={user.profilePicture ? user.profilePicture : "/static/icons/profileIcon.jpg"} className="rounded-circle" width="34" height="34" alt="Avatar" />
                    </Link>
                  ) : (
                    <Link href="/cadastro" className="btn-entrar text-white d-flex align-items-center ms-3">
                      <p className="mb-0">Entrar <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i></p>
                    </Link>
                  )
              )}
            </div>
          </div>

          {/* Offcanvas mobile */}
          <div className="offcanvas offcanvas-end text-bg-dark bg-black d-lg-none" tabIndex="-1" id="mainNavbarOffcanvas" aria-labelledby="mainNavbarOffcanvasLabel">
            <div className="offcanvas-header">
              {user != null ? (
                <div className="d-flex align-items-center justify-content-center">
                  <a href="/perfil"><Image src={user.profilePicture ? user.profilePicture : "/static/icons/profileIcon.jpg"} className="rounded-circle" width="40" height="40" alt="Avatar" /></a>
                </div>
              ) : (
                <Link href="/cadastro" className="btn-entrar text-white d-flex align-items-center justify-content-center"><p className="mb-0">Entrar <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i></p></Link>
              )}
              <button type="button" className="btn-close btn-close-white me-1 " data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav mb-3 gap-3">
                <li className="nav-item"><Link href="/" className="btn btn-outline-primary d-flex rounded-3 justify-content-center"><p className="mb-0"><i className="fa-solid fa-house me-2"></i>Início</p></Link></li>
                <li className="nav-item"><Link href="/jogos" className="btn btn-outline-primary d-flex rounded-3 justify-content-center"><p className="mb-0"><i className="fa-solid fa-gamepad me-2"></i>Jogos</p></Link></li>
                <li className="nav-item"><Link href="/calendario" className="btn btn-outline-primary d-flex rounded-3 justify-content-center"><p className="mb-0"><i className="fa-solid fa-calendar me-2"></i>Calendário</p></Link></li>
                <li className="nav-item"><Link href="/sobre" className="btn btn-outline-primary d-flex rounded-3 justify-content-center"><p className="mb-0"><i className="fa-solid fa-circle-info me-2"></i>Sobre</p></Link></li>
                <li className="nav-item"><Link href="/contato" className="btn btn-outline-primary d-flex rounded-3 justify-content-center"><p className="mb-0"><i className="fa-solid fa-phone me-2"></i>Contato</p></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown com notificações do backend */}
      {open && (
        <div
          ref={dropdownRef}
          className="notif-dropdown"
          style={{ position: "absolute", top: `${dropdownStyle.top}px`, left: `${dropdownStyle.left}px`, width: `${dropdownStyle.width}px`, zIndex: 2200 }}
        >
          <div className="notif-dropdown-header d-flex justify-content-between align-items-center mb-0 px-3 py-2">
            <strong>Próximos jogos</strong>
            <div>
              <button type="button" className="btn btn-sm btn-link text-white" onClick={() => setOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
          </div>

          <div className="notif-dropdown-body">
            {upcomingMerged.length === 0 ? (
              <div className="text-white small py-3 px-2">Nenhuma partida nas suas notificações ligadas.</div>
            ) : (
              upcomingMerged.slice(0, 8).map(m => (
                <div className="row notif-row d-flex align-items-center py-3 px-2 border-bottom border-white" key={m.id}>
                  <div className="col-12">
                    <div className="small text-primary">{m.championshipName} - {m.gameName}</div>
                    {m.tounamentName && <div className="small text-secondary">{m.tounamentName}</div>}
                  </div>

                  <div className="col-12">
                    <div className="fw-bold">{m.time1} <span className="text-secondary">vs</span> {m.time2}</div>
                  </div>

                  <div className="col-12 small">{m.date} • {m.time}</div>

                  {/* <div className="notif-col-action">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenMatch(m)}>Ver</button>
                  </div> */}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  );
}