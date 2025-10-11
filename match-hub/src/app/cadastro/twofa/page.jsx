'use client';
import { useState } from "react";
import { login, verifyTwoFactor } from "../../services/userService";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [step, setStep] = useState("login"); // 'login', '2fa', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      
      // Se o backend indicar que 2FA é necessário
      if (response.require2FA) {
        setUserEmail(response.email);
        setStep("2fa");
      } else {
        // Login sem 2FA
        Cookies.set("token", response.token, { expires: 7 });
        setStep("success");
        window.location = '/perfil';
      }
    } catch (err) {
      setError("Credenciais inválidas");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tokenResponse = await verifyTwoFactor(userEmail, twoFactorCode);
      Cookies.set("token", tokenResponse.token, { expires: 7 });
      setStep("success");
      window.location = '/perfil';
    } catch (err) {
      setError("Código 2FA inválido");
      console.error("Erro na verificação 2FA:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep("login");
    setTwoFactorCode("");
    setError("");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white">
            <div className="card-body p-4">
              
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="card-title">Login</h2>
                <p className="text-muted">Acesse sua conta</p>
              </div>

              {/* Mensagem de sucesso */}
              {step === "success" && (
                <div className="alert alert-success text-center">
                  <i className="fas fa-check-circle me-2"></i>
                  Login realizado com sucesso! Redirecionando...
                </div>
              )}

              {/* Formulário de Login */}
              {step === "login" && (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </button>
                </form>
              )}

              {/* Verificação 2FA */}
              {step === "2fa" && (
                <form onSubmit={handleVerify2FA}>
                  <div className="text-center mb-4">
                    <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
                    <h4>Verificação em Duas Etapas</h4>
                    <p className="text-muted">
                      Digite o código do seu aplicativo autenticador
                    </p>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="twoFactorCode" className="form-label">
                      Código 2FA
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      id="twoFactorCode"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="123456"
                      maxLength="6"
                      required
                      disabled={loading}
                    />
                    <div className="form-text">
                      Abra seu app autenticador (Google Authenticator, Authy, etc) e digite o código de 6 dígitos
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading || twoFactorCode.length !== 6}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Verificando...
                        </>
                      ) : (
                        "Verificar Código"
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={handleBackToLogin}
                      disabled={loading}
                    >
                      Voltar para o Login
                    </button>
                  </div>
                </form>
              )}

              {/* Links adicionais */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  Não tem uma conta? <a href="/register" className="text-primary">Cadastre-se</a>
                </small>
              </div>
            </div>
          </div>

          {/* Informação de teste */}
          <div className="card bg-dark text-white mt-3">
            <div className="card-body">
              <h6 className="card-title">Para teste:</h6>
              <small className="text-muted">
                <ul className="mb-0">
                  <li>Use um usuário com 2FA habilitado para testar o fluxo completo</li>
                  <li>Usuários sem 2FA vão direto para o dashboard</li>
                </ul>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}