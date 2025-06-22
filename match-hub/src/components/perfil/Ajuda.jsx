export default function Ajuda({ user }) {
  return (
    <div>
      <h2 className="text-azul mb-3">Ajuda</h2>
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <p>
            Para receber suporte entre em contato com a nossa equipe ou
            verifique nossa documentação disponível na página Sobre
          </p>
          <button className="btn btn-outline-primary me-2">
            Entrar em contato
          </button>
          <button className="btn btn-outline-secondary">Página Sobre</button>
        </div>
      </div>
    </div>
  );
}
