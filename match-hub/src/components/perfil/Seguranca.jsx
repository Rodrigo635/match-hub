'use client';
import { useState, useEffect } from "react";
import EditPassword from "./edit/EditPassword";
import QRCode from "react-qr-code";
import { setupTwoFactor } from "../../app/services/userService";
import Cookies from "js-cookie";

export default function Seguranca({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [otpauthUrl, setOtpAuthUrl] = useState("");

  useEffect(() => {
    // Você pode buscar o status atual do 2FA do usuário se tiver essa informação
    if (user && user.twoFactorEnabled) {
      setTwoFactorEnabled(true);
    }
  }, [user]);

  const handleEnable2FA = async () => {
    try {
      const token = Cookies.get("token");
      const res = await setupTwoFactor(token);
      
      // O backend já ativa o 2FA automaticamente
      setOtpAuthUrl(res.otpUrl); // Note: seu backend retorna "otpUrl", não "otpauthUrl"
      setTwoFactorEnabled(true);
      setShow2FASetup(true);
    } catch (err) {
      console.error("Erro ao habilitar 2FA:", err);
    }
  };

  return (
    <div>
      <h2 className="text-azul mb-3">Segurança</h2>

      {/* Troca de senha */}
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <p>
            <strong>Senha:</strong> ••••••••
          </p>
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowModal(true)}
          >
            Trocar senha
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Alterar Senha</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <EditPassword onClose={() => setShowModal(false)} />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA */}
      <div
        className="card"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <h5>Autenticação de dois fatores</h5>
          <p>Status: {twoFactorEnabled ? "Habilitado" : "Desabilitado"}</p>
          
          {!twoFactorEnabled ? (
            <button
              className="btn btn-outline-primary"
              onClick={handleEnable2FA}
            >
              Habilitar 2FA
            </button>
          ) : (
            <div className="mt-3">
              <p className="text-success">✓ 2FA está ativo para sua conta</p>
              {show2FASetup && otpauthUrl && (
                <div>
                  <p>Escaneie este QR Code no seu app autenticador (Google Authenticator, Authy, etc):</p>
                  <div className="d-flex justify-content-center bg-white p-3">
                    <QRCode value={otpauthUrl} size={200} />
                  </div>
                  <p className="mt-3 text-info">
                    <small>
                      Após escanear o QR Code, use o código gerado no app para fazer login.
                    </small>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}