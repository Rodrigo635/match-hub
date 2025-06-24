// src/app/cadastro/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createUser, login } from "../services/userService";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function CadastroPage() {
  const router = useRouter();
  // Estado para alternar entre 'cadastrar' e 'entrar'
  const [activeTab, setActiveTab] = useState("cadastrar");

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Estados do login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  // Estados para controle dos ícones de senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);


  useEffect(() => {
    const token = Cookies.get("token")
    if(token !== undefined){
      router.push("/perfil")
    }
  }, []);

  const handleToggle = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
  };

  const handleCadastroSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

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

    if (senha !== confirmSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (!aceitaTermos) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    const userData = {
      name: nome,
      email: email,
      password: senha,
      birthDate: birthDate,
    };

    createUser(userData)
      .then(() => {
        login(email, senha).then((res) => {
          Cookies.set("token", res.token);
        });
        router.push("/cadastro_concluido");
      })
      .catch((err) => {
        console.error("Erro no cadastro:", err);
        setErrorMessage("Falha no cadastro. Verifique os dados.");
      });


  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginEmail.trim() || !loginSenha) {
      setErrorMessage("Preencha email e senha.");
      return;
    }

    try {
      const res = await login(loginEmail, loginSenha);
      Cookies.set("token", res.token);
      router.push("/perfil");
    } catch (err) {
      setErrorMessage("Falha no login. Verifique os dados.");
    }
  };

  

  return (
    <main className="text-white">
      <link rel="stylesheet" href="/css/cadastro.css" />
      <div className="auth-container py-5">
        {/* Botões de alternância */}
        <div className="d-flex w-100 justify-content-center align-content-center mb-0">
          <button
            className={`auth-toggle-btn border-0 w-50 py-3 fs-5 rounded-top-4 text-white ${
              activeTab === "cadastrar" ? "bg-dark" : "bg-dark-less"
            }`}
            onClick={() => handleToggle("cadastrar")}
          >
            <h5 className="mb-0">Cadastrar</h5>
          </button>
          <button
            className={`auth-toggle-btn border-0 w-50 py-3 fs-5 rounded-top-4 text-white ${
              activeTab === "entrar" ? "bg-dark" : "bg-dark-less"
            }`}
            onClick={() => handleToggle("entrar")}
          >
            <h5 className="mb-0">Entrar</h5>
          </button>
        </div>

        <div className="bg-dark w-100 rounded-bottom-4 p-4">
          {activeTab === "cadastrar" ? (
            <form
              className="form-cadastro d-flex flex-column align-items-center"
              onSubmit={handleCadastroSubmit}
            >
              <h2 className="text-white fw-bold text-center mt-3 mb-4">
                Faça seu cadastro
              </h2>

              {/* GIF ou imagem opcional */}
              <div className="w-50 rounded-5 mb-3 d-md-none">
                <img
                  className="img-fluid rounded-5"
                  src="/static/icons/podio.gif"
                  alt="Pódio GIF"
                />
              </div>

              {/* Nome */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="text"
                  className="form-control text-white bg-dark"
                  placeholder="Digite seu nome..."
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <label htmlFor="nome" className="form-label text-light">
                  Nome
                </label>
              </div>

              {/* Email */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="email"
                  className="form-control text-white bg-dark"
                  placeholder="Digite seu e-mail..."
                  id="emailCadastro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label
                  htmlFor="emailCadastro"
                  className="form-label text-light"
                >
                  E-mail
                </label>
              </div>

              {/* Birth Date */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="date"
                  className="form-control text-white bg-dark"
                  placeholder="Digite sua data de nascimento..."
                  id="birthDateCadastro"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
                <label
                  htmlFor="birthDateCadastro"
                  className="form-label text-light"
                >
                  Data de nascimento
                </label>
              </div>

              {/* Senha */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control text-white bg-dark"
                  placeholder="Digite sua senha..."
                  id="mainPassword"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <label htmlFor="mainPassword" className="form-label text-light">
                  Senha
                </label>
                <button
                  className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  <span className="eye-icon">
                    <img
                      src={
                        showPassword
                          ? "/static/icons/eye-solid.png"
                          : "/static/icons/eye-slash-solid.png"
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </span>
                </button>
              </div>

              {/* Confirmar Senha */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control text-white bg-dark"
                  placeholder="Confirme sua senha..."
                  id="confirmPassword"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                />
                <label
                  htmlFor="confirmPassword"
                  className="form-label text-light"
                >
                  Confirmar Senha
                </label>
                <button
                  className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Esconder senha" : "Mostrar senha"
                  }
                >
                  <span className="eye-icon">
                    <img
                      src={
                        showConfirmPassword
                          ? "/static/icons/eye-solid.png"
                          : "/static/icons/eye-slash-solid.png"
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </span>
                </button>
              </div>

              {/* Mensagem de erro */}
              {errorMessage && (
                <span className="text-danger col-12 text-center w-75 mb-2">
                  {errorMessage}
                </span>
              )}

              {/* Termos */}
              <div className="d-flex align-items-center mt-2 mb-4 justify-content-center gap-2 w-75">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="termos"
                  checked={aceitaTermos}
                  onChange={(e) => setAceitaTermos(e.target.checked)}
                  required
                />
                <label htmlFor="termos" className="text-white m-0">
                  Aceito os
                  <button
                    type="button"
                    className="link text-primary mx-1 bg-transparent border-0 p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#termosModal"
                  >
                    Termos de Uso
                  </button>
                  e
                  <button
                    type="button"
                    className="link text-primary mx-1 bg-transparent border-0 p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#condicoesModal"
                  >
                    Condições
                  </button>
                </label>
              </div>

              {/* Botão cadastrar */}
              <div className="d-flex w-75 justify-content-center mb-4">
                <button
                  type="submit"
                  className="btn-primary btn btn-entrar align-items-center w-100 fw-bold py-2 rounded-3 btn-light"
                >
                  <h5 className="mb-0">Cadastrar</h5>
                </button>
              </div>

              {/* Ou com Google */}
              <div className="d-flex align-items-center w-75 justify-content-center mb-4">
                <hr className="flex-grow-1 m-0 border-top-1 border-light opacity-50" />
                <h6 className="ou d-flex m-0 text-white opacity-75 mx-2">Ou</h6>
                <hr className="flex-grow-1 m-0 border-top-1 border-light opacity-50" />
              </div>
              <div className="d-flex w-75 justify-content-center mb-5">
                <button
                  type="button"
                  className="btn-primary d-flex btn align-items-center justify-content-center w-100 fw-bold p-2 rounded-3 btn-light"
                  onClick={() => {
                    console.log("Cadastrar com Google");
                  }}
                >
                  <img
                    src="/static/icons/google.png"
                    alt="Google Icon"
                    width="24"
                  />
                  <h5 className="mb-0 ms-2">Cadastrar com Google</h5>
                </button>
              </div>
            </form>
          ) : (
            <form
              className="form-login d-flex flex-column align-items-center"
              onSubmit={handleLoginSubmit}
            >
              <h2 className="text-white fw-bold text-center mt-3 mb-4">
                Faça Login
              </h2>
              <div className="w-50 rounded-5 mb-3 d-md-none">
                <img
                  className="img-fluid rounded-5"
                  src="/static/icons/podio.gif"
                  alt="Pódio GIF"
                />
              </div>

              {/* Email login */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="email"
                  className="form-control text-white bg-dark"
                  placeholder="Digite seu e-mail..."
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <label htmlFor="loginEmail" className="form-label text-light">
                  E-mail
                </label>
              </div>

              {/* Senha login */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  className="form-control text-white bg-dark"
                  placeholder="Digite sua senha..."
                  id="loginPassword"
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                  required
                />
                <label
                  htmlFor="loginPassword"
                  className="form-label text-light"
                >
                  Senha
                </label>
                <button
                  className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={
                    showLoginPassword ? "Esconder senha" : "Mostrar senha"
                  }
                >
                  <span className="eye-icon">
                    <img
                      src={
                        showLoginPassword
                          ? "/static/icons/eye-solid.png"
                          : "/static/icons/eye-slash-solid.png"
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </span>
                </button>
              </div>

              {/* Mensagem de erro */}
              {errorMessage && (
                <span className="text-danger col-12 text-center w-75 mb-2">
                  {errorMessage}
                </span>
              )}

              <div className="w-75 mb-3">
                <Link href="#" className="text-primary">
                  <h6>Esqueceu a senha?</h6>
                </Link>
              </div>

              {/* Botão entrar */}
              <div className="d-flex w-75 justify-content-center mb-4">
                <button
                  type="submit"
                  className="btn-primary btn btn-entrar align-items-center w-100 fw-bold py-2 rounded-3 btn-light"
                >
                  <h5 className="mb-0">Entrar</h5>
                </button>
              </div>

              {/* Ou com Google */}
              <div className="d-flex align-items-center w-75 justify-content-center mb-4">
                <hr className="flex-grow-1 m-0 border-top-1 border-light opacity-50" />
                <h6 className="d-flex m-0 text-white opacity-75 mx-2">Ou</h6>
                <hr className="flex-grow-1 m-0 border-top-1 border-light opacity-50" />
              </div>
              <div className="d-flex w-75 justify-content-center mb-5">
                <button
                  type="button"
                  className="btn-primary d-flex btn align-items-center justify-content-center w-100 fw-bold p-2 rounded-3 btn-light"
                  onClick={() => {
                    console.log("Login com Google");
                  }}
                >
                  <img
                    src="/static/icons/google.png"
                    alt="Google Icon"
                    width="24"
                  />
                  <h5 className="mb-0 ms-2">Entrar com Google</h5>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modais de Termos e Condições */}
      {/* Modal Condições */}
      <div
        className="modal fade"
        id="condicoesModal"
        tabIndex={-1}
        aria-labelledby="condicoesModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="condicoesModalLabel">
                Condições
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              <h5>1. Uso Permitido</h5>
              <p>
                O site está disponível para uso pessoal, informativo e não
                comercial. Você se compromete a utilizar os recursos oferecidos
                de forma ética e legal, respeitando os princípios da boa-fé e a
                legislação vigente.
              </p>
              <p className="text-muted mt-4">
                <small>Última atualização: 19 de abril de 2025</small>
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary btn align-items-center w-100 fw-bold text-white"
                data-bs-dismiss="modal"
              >
                <h5 className="mb-0">Fechar</h5>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Termos */}
      <div
        className="modal fade"
        id="termosModal"
        tabIndex={-1}
        aria-labelledby="termosModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-dark text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="termosModalLabel">
                Termos de Uso
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              <h5>1. Aceitação dos Termos</h5>
              <p>
                Ao acessar e utilizar este site, você concorda com os presentes
                Termos e Condições de Uso. Caso não concorde com algum dos
                termos, por favor, não utilize o site.
              </p>
              <p className="text-muted mt-4">
                <small>Última atualização: 19 de abril de 2025</small>
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary btn align-items-center w-100 fw-bold text-white"
                data-bs-dismiss="modal"
              >
                <h5 className="mb-0">Fechar</h5>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
