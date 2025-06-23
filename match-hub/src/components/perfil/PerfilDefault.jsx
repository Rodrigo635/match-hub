"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useState } from "react";
import EditPerfil from "./edit/EditPerfil";

export default function PerfilDefault({ user }) {
  const [showEdit, setShowEdit] = useState(false);

  const handleGetAge = () => {
    const birthDate = new Date(user.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleFormatCreatedAt = () => {
    const createdAt = new Date(user.createdAt);
    const day = createdAt.getDate().toString().padStart(2, '0');
    const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
    const year = createdAt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const logout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <div>
      <h2 className="text-azul mb-3">Meu Perfil</h2>
      <div
        className="card mb-4"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <div
             className="me-3"
            >
              <Image
                src={user.profilePicture ?? "/static/icons/profileIcon.jpg"}
                width={80}
                height={80}
                style={{ width: "80px", height: "80px" }}
                alt="Imagem de perfil"
                className="rounded-circle"
              />
            </div>
            <div>
              <p className="text-white">
                <strong>Nome:</strong> {user.name}
              </p>
              <p className="text-white">
                <strong>E-mail:</strong> {user.email}
              </p>
            </div>
          </div>
          <h5 className="card-title text-white mb-3">Detalhes</h5>
          <p className="text-white">
            <strong>Idade:</strong> {handleGetAge()} anos
          </p>
          <p className="text-white">
            <strong>Membro desde:</strong> {handleFormatCreatedAt()}
          </p>
          <button className="btn btn-outline-primary" onClick={() => setShowEdit(true)}>
            Gerenciar conta
          </button>
          <button className="btn ms-2 btn-outline-danger" onClick={logout}>
            Sair
          </button>
        </div>
      </div>

      {showEdit && <EditPerfil user={user} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
