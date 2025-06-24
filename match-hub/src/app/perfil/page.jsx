"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserByToken } from "../services/userService";
import Configuracoes from "@/components/perfil/Configuracoes";
import Seguranca from "@/components/perfil/Seguranca";
import PerfilDefault from "@/components/perfil/PerfilDefault";
import Ajuda from "@/components/perfil/Ajuda";
import { useRouter } from "next/navigation";
import { handleGetUser } from "../global/global";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [token, setToken] = useState(null);
  const [activeSection, setActiveSection] = useState("perfil");

  // Seções
  const sections = [
    { key: "perfil", label: "Perfil", iconClass: "fa-solid fa-user" },
    { key: "seguranca", label: "Segurança", iconClass: "fa-solid fa-lock" },
    { key: "configuracoes", label: "Configurações", iconClass: "fa-solid fa-cog" },
    { key: "ajuda", label: "Ajuda", iconClass: "fa-solid fa-circle-question" },
  ];

  useEffect(() => {
    async function fetchUser() {
      const user = await handleGetUser({ setToken, setUser });
      if (!user) {
        router.push("/cadastro");
        return;
      }

      setUser(user);
    }

    fetchUser();
  }, []);

  // Função pra renderizar conteúdo conforme a seção
  function renderSection() {
    switch (activeSection) {
      case "perfil":
        return (
          <PerfilDefault user={user} token={token} />
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
    <div className="container">
      <div className="profile-page d-flex flex-column flex-md-row">
        <link rel="stylesheet" href="/css/perfil.css" />
        {/* Sidebar desktop */}
        <aside className="profile-sidebar d-none d-md-block col-md-3 col-lg-2">
          <nav className="nav flex-column">
            {sections.map((sec) => (
              <a
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
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex-grow-1">
          {/* Nav tabs mobile */}
          <nav className="profile-tabs-mobile d-md-none">
            <ul className="nav nav-tabs nav-fill">
              {sections.map((sec) => (
                <li className="nav-item" key={sec.key}>
                  <a
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
                  </a>
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