'use client';
import { useRouter } from "next/navigation";

export default function Ajuda({ user }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-azul mb-3">Central de Ajuda</h2>

      {/* Seção de introdução */}
      <div
        className="card mb-4"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <p>
            Precisa de ajuda com o uso da plataforma? Nossa equipe está pronta para oferecer suporte. 
            Você pode entrar em contato conosco, visitar a página <strong>Sobre</strong> para mais informações 
            ou consultar as dúvidas mais frequentes abaixo.
          </p>
          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={() => router.push('/contato#contate-nos')}
          >
            Entrar em contato
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.push('/sobre')}
          >
            Página Sobre
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div
        className="card mb-4"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <h4 className="text-primary mb-3">Dúvidas Frequentes</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item bg-transparent text-white">
              <strong>Como altero minha senha?</strong><br />
              Vá até <span className="text-info"> "Segurança"</span> e clique em “Trocar Senha”.
            </li>
            <li className="list-group-item bg-transparent text-white">
              <strong>Como ativar a autenticação em duas etapas (2FA)?</strong><br />
              Em <span className="text-info">“Segurança”</span>, ative o 2FA e escaneie o QR Code com o Authenticator.
            </li>
            <li className="list-group-item bg-transparent text-white">
              <strong>Esqueci minha senha, o que fazer?</strong><br />
              Na tela de login, clique em “Esqueci minha senha” e siga as instruções enviadas por e-mail.
            </li>
            <li className="list-group-item bg-transparent text-white">
              <strong>Como atualizar minha foto de perfil?</strong><br />
              Acesse seu perfil e selecione o ícone de imagem. É possível usar um avatar público ou enviar sua própria imagem.
            </li>
          </ul>
        </div>
      </div>

      {/* Contatos e horários */}
      <div
        className="card"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <h4 className="text-primary mb-3">Canais de Atendimento</h4>
          <p>
            <strong>E-mail:</strong> matchhub00@gmail.com <br />
            <strong>Horário:</strong> Segunda a sexta, das 8h às 18h (horário de Brasília)
          </p>
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => router.push('/contato#contate-nos')}
          >
            Abrir Chat de Contato
          </button>
        </div>
      </div>
    </div>
  );
}
