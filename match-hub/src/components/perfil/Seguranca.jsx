export default function Seguranca({ user }) {
  return (
    <div>
      <h2 className="text-azul mb-3">Segurança</h2>
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <p>
            <strong>Senha:</strong> ••••••••
          </p>
          <button className="btn btn-outline-primary">Trocar senha</button>
        </div>
      </div>
      <div
        className="card"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <h5>Autenticação de dois fatores</h5>
          <p>Status: Desabilitado</p>
          <button className="btn btn-outline-primary">Habilitar 2FA</button>
        </div>
      </div>
      <h2 className="text-azul mt-4">Dispositivos</h2>
      <div
        className="list-group"
        style={{ backgroundColor: "var(--cor-bgEscuro)" }}
      >
        {/* {userMock.devices.map((device) => (
                    <div
                      key={device.id}
                      className="list-group-item"
                      style={{
                        backgroundColor: "var(--cor-bgEscuro)",
                        border: "none",
                        borderBottom: "1px solid var(--cor-cinzaEscuro)",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div className="text-white">
                          <strong>{device.name}</strong>
                          <div
                            className="text-cinzaTexto"
                            style={{ fontSize: "0.9rem" }}
                          >
                            Último login: {device.lastActive}
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-danger">
                          Sair no dispositivo
                        </button>
                      </div>
                    </div>
                  ))} */}
      </div>
    </div>
  );
}
