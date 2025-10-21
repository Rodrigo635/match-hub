"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createUser, login } from "../../services/userService";
import { useRouter } from "next/navigation";
import {
  validaCampo,
  regexPatterns,
  useValidacao,
} from "../../utils/ValidaCampo";
import Cookies from "js-cookie";
import Verify2FA from "@/components/Verify2FA";
import ResetPassword from "@/components/ResetPassword";
import Image from "next/image";

export default function CadastroPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cadastrar");
  const { erros, validar, limparErro, limparTodosErros } = useValidacao();

  // Form state
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Eye toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [step, setStep] = useState('login');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = Cookies.get("token");
    if (token !== undefined) router.push("/perfil");
  }, [router]);

  // handlers (mantive sua lógica)
  const handleNomeChange = (e) => {
    const valor = e.target.value;
    setNome(valor);
    if (valor.trim() !== "") validar("nome", regexPatterns.nome, valor);
    else limparErro("nome");
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    if (valor.trim() !== "") validar("email", regexPatterns.email, valor);
    else limparErro("email");
  };

  const handleSenhaChange = (e) => {
    const valor = e.target.value;
    setSenha(valor);
    if (valor.trim() !== "") validar("senha", regexPatterns.senha, valor);
    else limparErro("senha");

    if (confirmSenha) {
      if (valor === confirmSenha) limparErro("confirmSenha");
      else validar("confirmSenha", /^$/, confirmSenha);
    }
  };

  const handleConfirmSenhaChange = (e) => {
    const valor = e.target.value;
    setConfirmSenha(valor);
    if (valor.trim() !== "") {
      if (valor === senha) limparErro("confirmSenha");
      else validar("confirmSenha", /^$/, valor);
    } else limparErro("confirmSenha");
  };

  const handleLoginEmailChange = (e) => {
    const valor = e.target.value;
    setLoginEmail(valor);
    if (valor.trim() !== "") validar("loginEmail", regexPatterns.email, valor);
    else limparErro("loginEmail");
  };

  const handleToggle = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
    limparTodosErros();
  };

  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const nomeValido = validaCampo(regexPatterns.nome, nome);
    const emailValido = validaCampo(regexPatterns.email, email);
    const senhaValida = validaCampo(regexPatterns.senha, senha);
    const senhasIguais = senha === confirmSenha;

    if (!nomeValido) validar("nome", regexPatterns.nome, nome);
    if (!emailValido) validar("email", regexPatterns.email, email);
    if (!senhaValida) validar("senha", regexPatterns.senha, senha);
    if (!senhasIguais) validar("confirmSenha", /^$/, confirmSenha);

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmSenha ||
      !birthDate
    ) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }
    if (!nomeValido) {
      setErrorMessage(
        "Nome deve ter entre 2-50 caracteres e conter apenas letras."
      );
      return;
    }
    if (!emailValido) {
      setErrorMessage("Digite um email válido.");
      return;
    }
    if (!senhaValida) {
      setErrorMessage(
        "Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo."
      );
      return;
    }
    if (!senhasIguais) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    const userData = { name: nome, email, password: senha, birthDate };
    try {
      await createUser(userData);
      const res = await login(email, senha);
      Cookies.set("token", res.token);
      router.push("/cadastro_concluido");
    } catch (err) {
      setErrorMessage("Falha no cadastro. Verifique os dados.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const emailValido = validaCampo(regexPatterns.email, loginEmail);
    if (!emailValido) validar("loginEmail", regexPatterns.email, loginEmail);
    if (!loginEmail.trim() || !loginSenha) {
      setErrorMessage("Preencha email e senha.");
      return;
    }
    if (!emailValido) {
      setErrorMessage("Digite um email válido.");
      return;
    }

    try {
      const res = await login(loginEmail, loginSenha);
      
      if (res.require2FA) {
        setUserEmail(res.email);
        setStep("2fa");
      } else {
        Cookies.set("token", res.token);
        setStep("success");
        router.push("/");
      }
    } catch (err) {
      setErrorMessage("Falha no login. Verifique os dados.");
    }
  };

  if(step === "2fa") return <Verify2FA email={userEmail} setStep={setStep} />
  if(step === "esqueci-senha") return <ResetPassword setStep={setStep} />

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-dark-custom text-white">
      <link rel="stylesheet" href="/css/cadastro.css" />
      <div className="auth-container shadow-lg rounded-4 overflow-hidden">
        <div className="d-flex">
          <button
            className={`w-50 py-3 border-0 fs-5 ${
              activeTab === "cadastrar"
                ? "bg-dark text-white"
                : "bg-black text-white"
            }`}
            type="button"
            onClick={() => handleToggle("cadastrar")}
            aria-pressed={activeTab === "cadastrar"}
          >
            Cadastrar
          </button>
          <button
            className={`w-50 py-3 border-0 fs-5 ${
              activeTab === "entrar"
                ? "bg-dark text-white"
                : "bg-black text-white"
            }`}
            type="button"
            onClick={() => handleToggle("entrar")}
            aria-pressed={activeTab === "entrar"}
          >
            Entrar
          </button>
        </div>

        <div className="p-4 bg-dark">
          {activeTab === "cadastrar" ? (
            <form
              className="d-flex flex-column align-items-center gap-3"
              onSubmit={handleCadastroSubmit}
              noValidate
            >
              <h2 className="fw-bold mt-2">
                <i className="fas fa-user-plus me-3 text-azul"></i>Faça seu
                cadastro
              </h2>

              {/* Nome - label acima */}
              <div className="mb-0 w-75">
                <label htmlFor="nome" className="form-label">
                  Nome
                </label>
                <input
                  id="nome"
                  className={`form-control form-control-lg bg-dark text-white ${
                    erros.nome ? "is-invalid" : ""
                  }`}
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={handleNomeChange}
                  aria-invalid={!!erros.nome}
                  aria-describedby={erros.nome ? "nome-error" : undefined}
                  required
                />
                {erros.nome && (
                  <div id="nome-error" className="invalid-feedback d-block">
                    Nome deve ter entre 2-50 caracteres e conter apenas letras
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-0 w-75">
                <label htmlFor="emailCadastro" className="form-label">
                  E-mail
                </label>
                <input
                  id="emailCadastro"
                  type="email"
                  className={`form-control form-control-lg bg-dark text-white ${
                    erros.email ? "is-invalid" : ""
                  }`}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={!!erros.email}
                  aria-describedby={erros.email ? "email-error" : undefined}
                  required
                />
                {erros.email && (
                  <div id="email-error" className="invalid-feedback d-block">
                    Digite um email válido
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div className="mb-0 w-75">
                <label htmlFor="birthDateCadastro" className="form-label">
                  Data de nascimento
                </label>
                <input
                  id="birthDateCadastro"
                  type="date"
                  className="form-control form-control-lg bg-dark text-white"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              {/* Senha com Font Awesome eye */}
              <div className="mb-0 w-75">
                <label htmlFor="mainPassword" className="form-label">
                  Senha
                </label>

                <div className="input-group input-group-lg">
                  <input
                    id="mainPassword"
                    type={showPassword ? "text" : "password"}
                    className={`form-control bg-dark text-white ${
                      erros.senha ? "is-invalid" : ""
                    }`}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={handleSenhaChange}
                    aria-invalid={!!erros.senha}
                    aria-describedby={erros.senha ? "senha-error" : undefined}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-light btn-icon-group border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>

                {erros.senha && (
                  <div
                    id="senha-error"
                    className="invalid-feedback d-block mt-2"
                  >
                    Senha deve ter pelo menos 8 caracteres, incluindo maiúscula,
                    minúscula, número e símbolo
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="mb-2 w-75">
                <label htmlFor="mainPassword" className="form-label">
                  Confirmar senha
                </label>

                <div className="input-group input-group-lg">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control bg-dark text-white ${
                      erros.confirmSenha ? "is-invalid" : ""
                    }`}
                    placeholder="Repita a senha"
                    value={confirmSenha}
                    onChange={handleConfirmSenhaChange}
                    aria-invalid={!!erros.confirmSenha}
                    aria-describedby={
                      erros.confirmSenha ? "confirmSenha-error" : undefined
                    }
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-light btn-icon-group border-start-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>

                  {erros.confirmSenha && (
                    <div
                      id="confirmSenha-error"
                      className="invalid-feedback d-block mt-2"
                    >
                      As senhas não coincidem
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div
                  className="w-75 text-center text-danger"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </div>
              )}

              {/* Termos */}
              <div className=" w-75 d-flex align-items-center  mb-2">
                <label className="text-white mb-0" htmlFor="termos">
                  *Ao realizar o cadastro eu aceito os{" "}
                  <Link
                    href="/termos_de_uso"
                    target="blank"
                    className="link-primary mb-0"
                  >
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/politicas_de_privacidade"
                    target="blank"
                    className="link-primary mb-0"
                  >
                    Políticas de Privacidade
                  </Link>
                  .
                </label>
              </div>

              <div className="w-75">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-login w-100"
                >
                  <i className="fa-solid fa-user-plus me-2"></i>Cadastrar
                </button>
              </div>

              <div className="d-flex align-items-center w-75">
                <hr className="flex-grow-1" />
                <small className="mx-2 text-white">Ou</small>
                <hr className="flex-grow-1" />
              </div>

              <div className="w-75">
                <button
                  type="button"
                  className="btn btn-light btn-google btn-lg w-100 d-flex align-items-center justify-content-center gap-2 mb-4"
                  onClick={() => console.log("Cadastrar com Google")}
                >
                  <Image src="/static/icons/google.png" alt="Google" width={22} height={22} />
                  <span>Cadastrar com Google</span>
                </button>
              </div>
            </form>
          ) : (
            <form
              className="d-flex flex-column align-items-center gap-3"
              onSubmit={handleLoginSubmit}
              noValidate
            >
              <h2 className="fw-bold mt-2 ">
                <i className="fa-solid fa-right-to-bracket me-3 text-azul"></i>
                Faça Login
              </h2>

              <div className="mb-0 w-75">
                <label htmlFor="loginEmail" className="form-label">
                  E-mail
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className={`form-control form-control-lg bg-dark text-white ${
                    erros.loginEmail ? "is-invalid" : ""
                  }`}
                  placeholder="Digite seu e-mail"
                  value={loginEmail}
                  onChange={handleLoginEmailChange}
                  required
                />
                {erros.loginEmail && (
                  <div className="invalid-feedback d-block">
                    Digite um email válido
                  </div>
                )}
              </div>

              <div className="mb-0 w-75">
                <label htmlFor="loginPassword" className="form-label">
                  Senha
                </label>

                <div className="input-group input-group-lg">
                  <input
                    id="loginPassword"
                    type={showLoginPassword ? "text" : "password"}
                    className="form-control bg-dark text-white"
                    placeholder="Digite sua senha"
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-light btn-icon-group border-start-0"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={
                      showLoginPassword ? "Esconder senha" : "Mostrar senha"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showLoginPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="w-75 text-center text-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="w-75 text-end mb-2">
                <Link href="#" className="text-primary" onClick={() => setStep('esqueci-senha')}>
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="w-75">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-login w-100"
                >
                  <i className="fas fa-right-to-bracket me-2"></i>Entrar
                </button>
              </div>

              <div className="d-flex align-items-center w-75">
                <hr className="flex-grow-1" />
                <small className="mx-2 text-white">Ou</small>
                <hr className="flex-grow-1" />
              </div>

              <div className="w-75">
                <button
                  type="button"
                  className="btn btn-light btn-google btn-lg w-100 d-flex align-items-center justify-content-center gap-2 mb-4"
                  onClick={() => console.log("Login com Google")}
                >
                  <Image src="/static/icons/google.png" alt="Google" width={22} height={22} />
                  <span>Entrar com Google</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
