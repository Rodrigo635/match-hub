"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import EditPerfil from "./edit/EditPerfil";
import { useRouter } from "next/navigation";
import ModalUpdateImage from "./ModalUpdateImage";
import { Pencil } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function PerfilDefault({ user }) {
  const router = useRouter();
  const { logout: contextLogout } = useUser();
  const [showEdit, setShowEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGetAge = () => {
    const birthDate = new Date(user.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleFormatCreatedAt = () => {
    const createdAt = new Date(user.createdAt);
    const day = createdAt.getDate().toString().padStart(2, "0");
    const month = (createdAt.getMonth() + 1).toString().padStart(2, "0");
    const year = createdAt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleOpenUpdateImage = () => {
    setShowModal(true);
  };

  const handleCloseUpdateImage = () => {
    setShowModal(false);
  };

  const logout = () => {
    Cookies.remove("token");
    contextLogout();
    router.push("/");
  };

  if (!user) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div>
      <h2 className="text-azul mb-3">Meu Perfil</h2>
      <div
        className="card mb-4"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 position-relative">
              <Image
                src={user.profilePicture ? user.profilePicture : "/static/icons/profileIcon.jpg"}
                width={80}
                height={80}
                style={{ width: "80px", height: "80px" }}
                alt="Imagem de perfil"
                className="rounded-circle"
                onClick={handleOpenUpdateImage}
              />
              <Pencil className="text-white position-absolute bottom-0 end-0 rounded-circle p-1 bg-primary" onClick={handleOpenUpdateImage}/>
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
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowEdit(true)}
          >
            Gerenciar conta
          </button>
          <button className="btn ms-2 btn-outline-danger" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
      {showEdit && (
        <EditPerfil user={user} onClose={() => setShowEdit(false)} />
      )}
      {/* Renderiza o modal se showModal for true */}
      {showModal && (
        <ModalUpdateImage user={user} onClose={handleCloseUpdateImage} />
      )}
    </div>
  );
}