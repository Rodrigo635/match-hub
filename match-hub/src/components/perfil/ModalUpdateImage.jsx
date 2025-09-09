"use client";
import { useState, useEffect } from "react";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "@/app/services/userService";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ModalUpdateImage({ user, onClose }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Evita scroll no fundo quando o modal está aberto
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // pega o arquivo
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
      
      const formData = { image: selectedFile }

      const response = await uploadProfileImage(user.id, formData, token);

      if (response.ok) {
        window.location.reload();
      } else {
        setError("Erro ao atualizar imagem.");
      }
    } catch (error) {
      console.error("Erro ao alterar dados do usuário:", error);
      setError("Erro inesperado. Tente novamente.");
    }
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
        window.location.reload(); // NãO ALTERAR POR ROUTER.REFRESH()
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
      {/* Backdrop */}
      <div className="modal-backdrop show"></div>

      {/* Modal */}
      <div
        className="modal show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Cabeçalho */}
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">Alterar Foto de Perfil</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Corpo com formulário */}
            <div className="modal-body bg-dark text-white">
              <div className="d-flex flex-column align-items-center mb-5">
                <p>Foto atual:</p>
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
                    className="rounded-circle bg-secondary p-1 "
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
                    className="form-control w-100"
                    id="imageProfile"
                    name="imageProfile"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                {error && <p className="text-danger">{error}</p>}

                <div className="d-flex justify-space-between w-100 gap-2">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}