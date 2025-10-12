"use client";
import { useState, useEffect } from "react";
import { updateInfoUser } from "@/services/userService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function EditPerfil({ user, onClose, token }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    birthDate: user.birthDate
  });
  const [error, setError] = useState(null);

  // Para evitar o scroll do fundo enquanto o modal está aberto
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

      if(formData.email !== user.email){
        Cookies.remove("token");
      }

      await updateInfoUser(formData, token);
      window.location.reload();
      onClose();
    } catch (e) {
      setError("Erro ao alterar dados do usuário");
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
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content bg-dark text-white">
            {/* Cabeçalho */}
            <div className="modal-header">
              <h5 className="modal-title">Editar Perfil</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Corpo com formulário */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p className="text-danger mt-2">{error}</p>

                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
