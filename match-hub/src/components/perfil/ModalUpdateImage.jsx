"use client";
import { useState, useEffect } from "react";
import {
  uploadProfileImage,
  deleteProfileImage,
  uploadPublicAvatar,
  getPublicAvatar,
} from "@/app/services/userService";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import '../../../public/css/modalProfile.css';

export default function ModalUpdateImage({ user, onClose }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Evita scroll no fundo quando o modal está aberto
  useEffect(() => {
    document.body.classList.add("modal-open");

    handleAvatarPublic();

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // pega o arquivo
  };

  const openAvatarModal = () => {
    const avatarModal = new bootstrap.Modal(
      document.getElementById("avatarModal")
    );
    avatarModal.show();
  };

  const closeAvatarModal = () => {
    const avatarModal = bootstrap.Modal.getInstance(
      document.getElementById("avatarModal")
    );
    avatarModal.hide();
  };

  const handleAvatarPublic = async () => {
    const res = await getPublicAvatar();
    if (!res) {
      setError("Erro ao buscar avatares.");
    }

    setAvatarUrl(res.avatars);
  };

  const handleSubmitUpdateImage = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Selecione uma imagem antes de salvar.");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      const formData = { image: selectedFile };

      const response = await uploadProfileImage(user.id, formData, token);

      if (response.ok) {
        window.location.reload();
      } else {
        setError("Erro ao atualizar imagem.");
      }
    } catch (error) {
      setError("Erro inesperado. Tente novamente.");
    }
  };

  const handleAvatarClick = (avatar, index) => {
    if (!avatar) return;

    setSelectedAvatar(avatar);

    // Remove a classe de todos os avatares
    const otherAvatars = document.querySelectorAll(".avatar");
    otherAvatars.forEach((element) => element.classList.remove("selected"));

    // Adiciona a classe no avatar clicado
    const currentAvatar = document.getElementById(`avatar-${index}`);
    if (currentAvatar) {
      currentAvatar.classList.add("selected");
    }
  };

  const handleAvatarSave = async () => {
    if (!selectedAvatar) {
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }
    const response = await uploadPublicAvatar(selectedAvatar, token);

    if(!response.ok) {
      setError("Erro ao atualizar imagem.");
      return;
    }

    window.location.reload();
  };

  const handleSubmitDeleteImage = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }
      const response = await deleteProfileImage(user.id, token);
      if (response.ok) {
        window.location.reload(); // NÃO ALTERAR POR ROUTER.REFRESH()
      } else {
        setError("Erro ao deletar imagem.");
      }
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      setError("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <>
      {/* Backdrop do modal principal */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal principal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content bg-dark text-white">
            {/* Cabeçalho */}
            <div className="modal-header border-0">
              <h5 className="modal-title">Alterar Foto de Perfil</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Corpo com formulário */}
            <div className="modal-body">
              <div className="d-flex flex-column align-items-center mb-4">
                <p className="mb-2">Foto atual:</p>
                <label htmlFor="imageProfile" className="cursor-pointer">
                  <Image
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : "/static/icons/profileIcon.jpg"
                    }
                    alt={user.name}
                    width={200}
                    height={200}
                    className="rounded-circle bg-secondary p-1"
                  />
                </label>
              </div>
              <form onSubmit={handleSubmitUpdateImage} className="w-100">
                <div className="mb-3">
                  <label htmlFor="imageProfile" className="form-label">
                    Selecionar foto:
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageProfile"
                    name="imageProfile"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                {error && <p className="text-danger">{error}</p>}

                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleSubmitDeleteImage}
                    >
                      Remover foto
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={openAvatarModal}
                  >
                    <div className="d-flex align-items-center gap-2">
                      Selecionar Avatar{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ fill: "white" }}
                        width="24"
                        height="24"
                      >
                        <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Avatares */}
      <div
        className="modal fade"
        id="avatarModal"
        tabIndex="-1"
        aria-labelledby="avatarModalLabel"
        aria-hidden="true"
        style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-sm position-relative"
          style={{ left: "33%", maxWidth: "30%" }}
        >
          <div
            className="modal-content bg-dark text-white"
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              height: "480px",
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title" id="avatarModalLabel">
                Selecione um avatar
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeAvatarModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="avatar-container d-flex flex-wrap gap-4 justify-content-center align-items-center">
                {avatarUrl.map(
                  (avatarUrl, index) => (
                    (
                      <Image
                        key={index}
                        id={`avatar-${index}`}
                        src={avatarUrl}
                        width={80}
                        height={80}
                        alt={`Avatar ${index + 1}`}
                        className="avatar rounded-circle cursor-pointer"
                        onClick={() => handleAvatarClick(avatarUrl, index)}
                      />
                    )
                  )
                )}
              </div>
            </div>
            <div className="modal-footer border-0 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => handleAvatarSave()}
              >
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeAvatarModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
