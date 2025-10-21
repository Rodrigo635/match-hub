"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordConfirm } from "../../../services/userService";
import Link from "next/link";

export default function ResetPasswordConfirm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordConfirm(token, password);
      setMessage("Senha redefinida com sucesso!");
      setTimeout(() => router.push("/cadastro"), 2000);
    } catch (err) {
      setMessage(err.message || "Erro ao redefinir senha.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom text-white">
        <div className="auth-container shadow-lg rounded-4 p-4 text-center">
          <h2 className="mb-3">Token inválido ou expirado</h2>
          <p>Verifique o link recebido no email.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom text-white">
    <link rel="stylesheet" href="/css/cadastro.css" />
      <div className="auth-container shadow-lg bg-dark rounded-4 overflow-hidden p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="fw-bold text-center mb-4">
          <i className="fas fa-key me-2 text-azul"></i>Redefinir Senha
        </h2>

        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          {/* Nova Senha */}
          <div>
            <label htmlFor="password" className="form-label">Nova senha</label>
            <div className="input-group input-group-lg">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control bg-dark text-white border-light"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-light border-start-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
            <div className="input-group input-group-lg">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control bg-dark text-white border-light"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-light border-start-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>
          </div>

          {/* Mensagem de erro/sucesso */}
          {message && (
            <div className={`text-center mt-2 ${message.includes("sucesso") ? "text-success" : "text-danger"}`}>
              {message}
            </div>
          )}

          {/* Botão */}
          <button type="submit" className="btn btn-primary btn-lg w-100 mt-2" disabled={isLoading}>
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link href="/cadastro" className="text-white text-decoration-none">
            <i className="fas fa-arrow-left me-2"></i>Voltar 
          </Link>
        </div>
      </div>
    </main>
  );
}
