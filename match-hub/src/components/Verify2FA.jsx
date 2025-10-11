"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyTwoFactor } from "../app/services/userService";
import Cookies from "js-cookie";

export default function Verify2FA({ email, setStep }) {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Foca no primeiro input ao carregar
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Contador para reenvio
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Permite apenas números
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Foca no próximo input automaticamente
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Volta para o input anterior ao apagar
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      const pasteArray = pasteData.split("");
      const newCode = [...code];

      pasteArray.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
        }
      });

      setCode(newCode);

      // Foca no último input preenchido
      const lastIndex = Math.min(pasteArray.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCodeComplete) {
      setErrorMessage("Por favor, preencha todos os 6 dígitos");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const verificationCode = code.join("");
      const res = await verifyTwoFactor(email, verificationCode);

      Cookies.set("token", res.token);
      router.push("/");
    } catch (err) {
      setErrorMessage("Código inválido. Tente novamente.");
      // Limpa os inputs em caso de erro
      setCode(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom text-white">
      <link rel="stylesheet" href="/css/cadastro.css" />
      <div className="auth-container shadow-lg rounded-4 overflow-hidden p-4 bg-dark">
        <div className="text-center mb-4">
          <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
          <h2 className="fw-bold">Verificação em Duas Etapas</h2>
          <small className="text-info">
            Digite o código de 6 dígitos do seu aplicativo autenticador
          </small>
        </div>

        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column align-items-center"
        >
          {/* Inputs do código */}
          <div className="d-flex gap-2 mb-4 justify-content-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                className={`form-control form-control-lg text-center bg-dark text-white border-2 ${
                  digit ? "border-primary" : "border-secondary"
                }`}
                style={{
                  width: "50px",
                  height: "60px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
                aria-label={`Dígito ${index + 1} do código de verificação`}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="alert alert-danger text-center w-100" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 mb-3"
            disabled={!isCodeComplete || isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Verificando...
              </>
            ) : (
              <>
                <i className="fas fa-check me-2"></i>
                Verificar Código
              </>
            )}
          </button>

          <div className="d-flex gap-3 w-100">
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={() => setStep('login')}
              disabled={isLoading}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
