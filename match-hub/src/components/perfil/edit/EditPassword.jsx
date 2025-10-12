"use client";
import { useState, useEffect } from "react";
import { updateInfoUser } from "@/services/userService";
import Cookies from "js-cookie";

export default function EditPassword({ user, onClose }) {
  const [formData, setFormData] = useState({
    password: "",
    currentPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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


  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    const { password } = formData;

    // Expressão regular para validar:
    // - Pelo menos 8 caracteres
    // - Pelo menos uma letra maiúscula
    // - Pelo menos um número
    // - Pelo menos um caractere especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        return;
      }

      const res = await updateInfoUser(formData, token);
      if (res === "Senha atual não confere!") {
        setError("Senha atual não confere!");
        return;
      }
      onClose();
    } catch (error) {
      console.error("Erro ao alterar dados do usuário:", error);
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
          <div className="modal-content bg-dark text-white">
            {/* Cabeçalho */}
            <div className="modal-header">
              <h5 className="modal-title">Alterar senha</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Corpo com formulário */}
            <div className="modal-body">
              <form onSubmit={handleSubmitPassword} className="w-100">
                {/* Senha Atual */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Senha Atual:
                  </label>
                  <div className="position-relative w-100">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="form-control w-100"
                      placeholder="Digite sua senha atual..."
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      aria-label={
                        showCurrentPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      <span className="eye-icon">
                        <img
                          src={
                            showCurrentPassword
                              ? "/static/icons/eye-solid.svg"
                              : "/static/icons/eye-slash-solid.svg"
                          }
                          alt="Visibilidade da senha"
                          width="20"
                        />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Nova Senha:
                  </label>
                  <div className="position-relative w-100">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control w-100"
                      placeholder="Digite sua nova senha..."
                      id="newPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      <span className="eye-icon">
                        <img
                          src={
                            showPassword
                              ? "/static/icons/eye-solid.svg"
                              : "/static/icons/eye-slash-solid.svg"
                          }
                          alt="Visibilidade da senha"
                          width="20"
                        />
                      </span>
                    </button>
                  </div>
                  <p className="subtitle text-danger mt-2">{error}</p>
                </div>

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
