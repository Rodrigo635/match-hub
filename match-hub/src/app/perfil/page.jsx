"use client";
import { useEffect, useState } from "react";
import Configuracoes from "@/components/perfil/Configuracoes";
import Seguranca from "@/components/perfil/Seguranca";
import PerfilDefault from "@/components/perfil/PerfilDefault";
import Notificacoes from "@/components/perfil/Notificacoes";
import Ajuda from "@/components/perfil/Ajuda";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Link } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading } = useUser();
  const [activeSection, setActiveSection] = useState("perfil");

  // Seções
  const sections = [
    { key: "perfil", label: "Perfil", iconClass: "fa-solid fa-user" },
    { key: "notificacoes", label: "Notificações", iconClass: "fa-solid fa-bell" },
    { key: "seguranca", label: "Segurança", iconClass: "fa-solid fa-lock" },
    { key: "configuracoes", label: "Configurações", iconClass: "fa-solid fa-cog" },
    { key: "ajuda", label: "Ajuda", iconClass: "fa-solid fa-circle-question" },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/cadastro");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  // Função pra renderizar conteúdo conforme a seção
  function renderSection() {
    switch (activeSection) {
      case "perfil":
        return (
          <PerfilDefault user={user} token={token} />
        );
      case "notificacoes":
        return (
            <Notificacoes user={user} />
        );
      case "seguranca":
        return (
            <Seguranca user={user} />
        );
      case "configuracoes":
        return(
            <Configuracoes user={user} />
        );
      case "ajuda":
        return (
            <Ajuda user={user} />
        );
      default:
        return null;
    }
  }

  return (
    <div className="page-perfil container">
      <div className="profile-page d-flex flex-column flex-md-row">
        <link rel="stylesheet" href="/css/perfil.css" />
        {/* Sidebar desktop */}
        <aside className="profile-sidebar d-none d-md-block col-md-3 col-lg-2">
          <nav className="nav flex-column">
            {sections.map((sec) => (
              <button
                type="button"
                key={sec.key}
                href="#"
                className={`nav-link ${
                  activeSection === sec.key ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(sec.key);
                }}
              >
                <i className={`${sec.iconClass} me-2`} aria-hidden="true"></i>
                {sec.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-grow-1">
          {/* Nav tabs mobile */}
          <nav className="profile-tabs-mobile d-md-none">
            <ul className="nav nav-tabs nav-fill">
              {sections.map((sec) => (
                <li className="nav-item" key={sec.key}>
                  <Link
                    href="#"
                    className={`nav-link ${
                      activeSection === sec.key ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(sec.key);
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {sec.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Conteúdo principal */}
          <main className="profile-content">{renderSection()}</main>
        </div>
      </div>
    </div>
  );
}