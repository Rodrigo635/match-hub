"use client";
import React, { useState } from "react";
import { resetPassword } from "../app/services/userService"; // Crie essa função no backend
import Cookies from "js-cookie";

export default function ResetPassword({ setStep }) {
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    const valor = e.target.value;
    setEmail(valor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErros({ email: "Digite seu email." });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email); 
      setSuccessMessage(
        "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha."
      );
    } catch (err) {
      setErrorMessage("Erro ao tentar resetar a senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom text-white">
      <link rel="stylesheet" href="/css/cadastro.css" />
      <div className="auth-container bg-dark shadow-lg rounded-4 overflow-hidden p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="fw-bold mb-3 text-center">
          <i className="fas fa-key me-2 text-azul"></i>
          Redefinir Senha
        </h2>
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
          <div className="mb-0">
            <label htmlFor="resetEmail" className="form-label">E-mail</label>
            <input
              id="resetEmail"
              type="email"
              className={`form-control form-control-lg bg-dark text-white ${erros.email ? "is-invalid" : ""}`}
              placeholder="Digite seu email"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={!!erros.email}
              aria-describedby={erros.email ? "email-error" : undefined}
              required
            />
            {erros.email && (
              <div id="email-error" className="invalid-feedback d-block">
                {erros.email}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="text-center text-danger" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="text-center text-success" role="alert">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </button>

          <button
            type="button"
            className="btn btn-outline-light btn-lg w-100 mt-2"
            onClick={() => setStep("login")}
          >
            Voltar
          </button>
        </form>
      </div>
    </div>
    
  );
}
