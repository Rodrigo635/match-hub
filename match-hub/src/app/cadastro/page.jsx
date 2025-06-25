'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createUser, login } from '../services/userService';
import { useRouter } from 'next/navigation';
import { validaCampo, regexPatterns, useValidacao } from '../../components/utils/ValidaCampo';
import Cookies from 'js-cookie';

export default function CadastroPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cadastrar');
  const { erros, validar, limparErro, limparTodosErros } = useValidacao();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados do login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Estados para controle dos ícones de senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token !== undefined) {
      router.push('/perfil');
    }
  }, []);

  // Validação em tempo real (onChange)
  const handleNomeChange = e => {
    const valor = e.target.value;
    setNome(valor);
    if (valor.trim() !== '') {
      validar('nome', regexPatterns.nome, valor);
    } else {
      limparErro('nome');
    }
  };

  const handleEmailChange = e => {
    const valor = e.target.value;
    setEmail(valor);
    if (valor.trim() !== '') {
      validar('email', regexPatterns.email, valor);
    } else {
      limparErro('email');
    }
  };

  const handleSenhaChange = e => {
    const valor = e.target.value;
    setSenha(valor);
    if (valor.trim() !== '') {
      validar('senha', regexPatterns.senha, valor);
    } else {
      limparErro('senha');
    }
    // Revalidar confirmação de senha se já foi preenchida
    if (confirmSenha) {
      if (valor === confirmSenha) {
        limparErro('confirmSenha');
      } else {
        validar('confirmSenha', /^$/, confirmSenha); // Força erro
      }
    }
  };

  const handleConfirmSenhaChange = e => {
    const valor = e.target.value;
    setConfirmSenha(valor);
    if (valor.trim() !== '') {
      if (valor === senha) {
        limparErro('confirmSenha');
      } else {
        validar('confirmSenha', /^$/, valor); // Força erro se não coincidir
      }
    } else {
      limparErro('confirmSenha');
    }
  };

  // Validação do email de login
  const handleLoginEmailChange = e => {
    const valor = e.target.value;
    setLoginEmail(valor);
    if (valor.trim() !== '') {
      validar('loginEmail', regexPatterns.email, valor);
    } else {
      limparErro('loginEmail');
    }
  };

  const handleToggle = tab => {
    setActiveTab(tab);
    setErrorMessage('');
    limparTodosErros();
  };

  const handleCadastroSubmit = e => {
    e.preventDefault();
    setErrorMessage('');

    // Validar todos os campos
    const nomeValido = validaCampo(regexPatterns.nome, nome);
    const emailValido = validaCampo(regexPatterns.email, email);
    const senhaValida = validaCampo(regexPatterns.senha, senha);
    const senhasIguais = senha === confirmSenha;

    // Atualizar estados de erro
    if (!nomeValido) validar('nome', regexPatterns.nome, nome);
    if (!emailValido) validar('email', regexPatterns.email, email);
    if (!senhaValida) validar('senha', regexPatterns.senha, senha);
    if (!senhasIguais) validar('confirmSenha', /^$/, confirmSenha);

    if (!nome.trim() || !email.trim() || !senha || !confirmSenha || !birthDate) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    if (!nomeValido) {
      setErrorMessage('Nome deve ter entre 2-50 caracteres e conter apenas letras.');
      return;
    }

    if (!emailValido) {
      setErrorMessage('Digite um email válido.');
      return;
    }

    if (!senhaValida) {
      setErrorMessage(
        'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.'
      );
      return;
    }

    if (senha !== confirmSenha) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!aceitaTermos) {
      setErrorMessage('Você deve aceitar os termos e condições.');
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
        login(email, senha).then(res => {
          Cookies.set('token', res.token);
        });
        router.push('/cadastro_concluido');
      })
      .catch(err => {
        console.error('Erro no cadastro:', err);
        setErrorMessage('Falha no cadastro. Verifique os dados.');
      });
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');

    const emailValido = validaCampo(regexPatterns.email, loginEmail);

    if (!emailValido) validar('loginEmail', regexPatterns.email, loginEmail);

    if (!loginEmail.trim() || !loginSenha) {
      setErrorMessage('Preencha email e senha.');
      return;
    }

    if (!emailValido) {
      setErrorMessage('Digite um email válido.');
      return;
    }

    try {
      const res = await login(loginEmail, loginSenha);
      Cookies.set('token', res.token);
      router.push('/perfil');
    } catch (err) {
      setErrorMessage('Falha no login. Verifique os dados.');
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
              activeTab === 'cadastrar' ? 'bg-dark' : 'bg-dark-less'
            }`}
            onClick={() => handleToggle('cadastrar')}
          >
            <h5 className="mb-0">Cadastrar</h5>
          </button>
          <button
            className={`auth-toggle-btn border-0 w-50 py-3 fs-5 rounded-top-4 text-white ${
              activeTab === 'entrar' ? 'bg-dark' : 'bg-dark-less'
            }`}
            onClick={() => handleToggle('entrar')}
          >
            <h5 className="mb-0">Entrar</h5>
          </button>
        </div>

        <div className="bg-dark w-100 rounded-bottom-4 p-4">
          {activeTab === 'cadastrar' ? (
            <form
              className="form-cadastro d-flex flex-column align-items-center"
              onSubmit={handleCadastroSubmit}
            >
              <h2 className="text-white fw-bold text-center mt-3 mb-4">Faça seu cadastro</h2>

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
                  className={`form-control text-white bg-dark ${
                    erros.nome ? 'is-invalid border-danger' : ''
                  }`}
                  placeholder="Digite seu nome..."
                  id="nome"
                  value={nome}
                  onChange={handleNomeChange}
                  required
                />
                <label htmlFor="nome" className="form-label text-light">
                  Nome
                </label>
                {erros.nome && (
                  <div className="text-danger small mt-1">
                    Nome deve ter entre 2-50 caracteres e conter apenas letras
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="email"
                  className={`form-control text-white bg-dark ${
                    erros.email ? 'is-invalid border-danger' : ''
                  }`}
                  placeholder="Digite seu e-mail..."
                  id="emailCadastro"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <label htmlFor="emailCadastro" className="form-label text-light">
                  E-mail
                </label>
                {erros.email && (
                  <div className="text-danger small mt-1">Digite um email válido</div>
                )}
              </div>

              {/* Birth Date */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type="date"
                  className="form-control text-white bg-dark"
                  placeholder="Digite sua data de nascimento..."
                  id="birthDateCadastro"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  required
                />
                <label htmlFor="birthDateCadastro" className="form-label text-light">
                  Data de nascimento
                </label>
              </div>

              {/* Campo Senha */}
              <div className="container-input mb-3 w-75">
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control text-white bg-dark ${
                      erros.senha ? 'is-invalid border-danger' : ''
                    }`}
                    placeholder="Digite sua senha..."
                    id="mainPassword"
                    value={senha}
                    onChange={handleSenhaChange}
                    required
                  />
                  <label htmlFor="mainPassword" className="form-label text-light">
                    Senha
                  </label>
                  <button
                    className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    <img
                      src={
                        showPassword
                          ? '/static/icons/eye-solid.png'
                          : '/static/icons/eye-slash-solid.png'
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </button>
                </div>

                {erros.senha && (
                  <div className="text-danger small mt-1">
                    Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e
                    símbolo
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="container-input mb-3 w-75">
                {/* 1) Input + label + olho ficam juntos em um bloco relativo */}
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control text-white bg-dark ${
                      erros.confirmSenha ? 'is-invalid border-danger' : ''
                    }`}
                    placeholder="Confirme sua senha..."
                    id="confirmPassword"
                    value={confirmSenha}
                    onChange={handleConfirmSenhaChange}
                    required
                  />
                  <label htmlFor="confirmPassword" className="form-label text-light">
                    Confirmar Senha
                  </label>
                  <button
                    className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                  >
                    <img
                      src={
                        showConfirmPassword
                          ? '/static/icons/eye-solid.png'
                          : '/static/icons/eye-slash-solid.png'
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </button>
                </div>

                {/* 2) Mensagem de erro fora do bloco relativo */}
                {erros.confirmSenha && (
                  <div className="text-danger small mt-1">As senhas não coincidem</div>
                )}
              </div>

              {/* Mensagem de erro */}
              {errorMessage && (
                <span className="text-danger col-12 text-center w-75 mb-2">{errorMessage}</span>
              )}

              {/* Termos */}
              <div className="d-flex align-items-center mt-2 mb-4 justify-content-center gap-2 w-75">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="termos"
                  checked={aceitaTermos}
                  onChange={e => setAceitaTermos(e.target.checked)}
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
                    console.log('Cadastrar com Google');
                  }}
                >
                  <img src="/static/icons/google.png" alt="Google Icon" width="24" />
                  <h5 className="mb-0 ms-2">Cadastrar com Google</h5>
                </button>
              </div>
            </form>
          ) : (
            <form
              className="form-login d-flex flex-column align-items-center"
              onSubmit={handleLoginSubmit}
            >
              <h2 className="text-white fw-bold text-center mt-3 mb-4">Faça Login</h2>
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
                  className={`form-control text-white bg-dark ${
                    erros.loginEmail ? 'is-invalid border-danger' : ''
                  }`}
                  placeholder="Digite seu e-mail..."
                  id="loginEmail"
                  value={loginEmail}
                  onChange={handleLoginEmailChange}
                  required
                />
                <label htmlFor="loginEmail" className="form-label text-light">
                  E-mail
                </label>
                {erros.loginEmail && (
                  <div className="text-danger small mt-1">Digite um email válido</div>
                )}
              </div>

              {/* Senha login */}
              <div className="container-input mb-3 position-relative w-75">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="form-control text-white bg-dark"
                  placeholder="Digite sua senha..."
                  id="loginPassword"
                  value={loginSenha}
                  onChange={e => setLoginSenha(e.target.value)}
                  required
                />
                <label htmlFor="loginPassword" className="form-label text-light">
                  Senha
                </label>
                <button
                  className="btn btn-outline-light eye position-absolute end-0 top-50 translate-middle-y me-2"
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  <span className="eye-icon">
                    <img
                      src={
                        showLoginPassword
                          ? '/static/icons/eye-solid.png'
                          : '/static/icons/eye-slash-solid.png'
                      }
                      alt="Visibilidade da senha"
                      width="20"
                    />
                  </span>
                </button>
              </div>

              {/* Mensagem de erro */}
              {errorMessage && (
                <span className="text-danger col-12 text-center w-75 mb-2">{errorMessage}</span>
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
                    console.log('Login com Google');
                  }}
                >
                  <img src="/static/icons/google.png" alt="Google Icon" width="24" />
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
                O site está disponível para uso pessoal, informativo e não comercial. Você se
                compromete a utilizar os recursos oferecidos de forma ética e legal, respeitando os
                princípios da boa-fé e a legislação vigente.
              </p>

              <h5>2. Cadastro de Usuário (se aplicável)</h5>
              <p>
                Para acessar determinadas funcionalidades, pode ser necessário criar uma conta. Ao
                se cadastrar, você concorda em fornecer informações verdadeiras, completas e
                atualizadas. É de sua responsabilidade manter a confidencialidade dos dados de
                acesso.
              </p>

              <h5>3. Condutas Proibidas</h5>
              <p>Ao utilizar o site, você concorda em não:</p>
              <ul>
                <li>Utilizar qualquer conteúdo de forma indevida, fraudulenta ou ilegal;</li>
                <li>Transmitir vírus, malware, ou qualquer outro código de natureza destrutiva;</li>
                <li>
                  Tentar obter acesso não autorizado a qualquer parte do site ou sistemas
                  relacionados;
                </li>
                <li>
                  Realizar cópia, modificação ou distribuição do conteúdo do site sem autorização
                  prévia;
                </li>
                <li>
                  Utilizar linguagem ofensiva, discriminatória ou difamatória em áreas de interação
                  (se houver).
                </li>
              </ul>

              <h5>4. Responsabilidades do Usuário</h5>
              <p>
                Você é o único responsável pelas ações realizadas durante o uso do site. Qualquer
                violação a estas condições pode resultar na suspensão ou cancelamento do acesso, sem
                aviso prévio.
              </p>

              <h5>5. Coleta de Cookies</h5>
              <p>
                Ao utilizar este site, você autoriza o uso de cookies para melhorar sua experiência
                de navegação, analisar o tráfego e personalizar conteúdo. Esses cookies podem
                armazenar informações sobre suas preferências e atividades de navegação.
              </p>
              <p>
                Você pode, a qualquer momento, configurar seu navegador para bloquear os cookies ou
                alertar quando estiverem sendo enviados. No entanto, a desativação dos cookies pode
                afetar o funcionamento correto de algumas funcionalidades do site.
              </p>

              <h5>6. Disponibilidade e Alterações</h5>
              <p>
                Nos reservamos o direito de, a qualquer momento e sem aviso prévio, alterar,
                suspender ou descontinuar, temporária ou permanentemente, qualquer parte do site,
                assim como restringir o acesso a determinados conteúdos.
              </p>

              <h5>7. Violação das Condições</h5>
              <p>
                O descumprimento destas Condições de Uso poderá resultar em medidas legais e/ou
                suspensão do seu acesso ao site. Cooperaremos com as autoridades, se necessário,
                para investigação de violações.
              </p>

              <p className="mt-4">
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
                Ao acessar e utilizar este site, você concorda com os presentes Termos e Condições
                de Uso. Caso não concorde com algum dos termos, por favor, não utilize o site.
              </p>

              <h5>2. Modificações</h5>
              <p>
                Reservamo-nos o direito de modificar ou atualizar estes termos a qualquer momento,
                sem aviso prévio. Recomendamos que você revise esta página periodicamente para estar
                ciente de quaisquer alterações.
              </p>

              <h5>3. Uso do Site</h5>
              <ul>
                <li>
                  Você se compromete a utilizar este site apenas para fins legais e de maneira que
                  não infrinja os direitos de terceiros.
                </li>
                <li>
                  É proibida a utilização de qualquer conteúdo do site para fins comerciais sem
                  autorização prévia.
                </li>
                <li>
                  Não é permitido tentar acessar áreas restritas do sistema, realizar engenharia
                  reversa ou uso de bots ou automações não autorizadas.
                </li>
              </ul>

              <h5>4. Propriedade Intelectual</h5>
              <p>
                Todo o conteúdo presente neste site, incluindo textos, imagens, logotipos, ícones,
                vídeos e códigos, é de propriedade exclusiva do site ou de seus licenciadores e é
                protegido por leis de direitos autorais e propriedade intelectual.
              </p>

              <h5>5. Isenção de Responsabilidade</h5>
              <p>
                Nos esforçamos para manter as informações deste site sempre atualizadas e corretas.
                No entanto, não garantimos a exatidão, integridade ou atualidade do conteúdo. O uso
                das informações é de sua inteira responsabilidade.
              </p>

              <h5>6. Links Externos</h5>
              <p>
                Este site pode conter links para sites de terceiros. Não nos responsabilizamos pelo
                conteúdo, políticas de privacidade ou práticas de sites externos.
              </p>

              <h5>7. Privacidade</h5>
              <p>
                Ao utilizar este site, você concorda com a coleta e uso das suas informações
                conforme descrito em nossa
                <a href="#" className="text-azul">
                  {' '}
                  Política de Privacidade
                </a>
                .
              </p>

              <h5>8. Contato</h5>
              <p>
                Se você tiver qualquer dúvida sobre estes Termos e Condições, entre em contato
                conosco pelo e-mail:
                <a href="mailto:contato@seusite.com.br" className="text-azul">
                  contato@matchhub.com.br
                </a>
                .
              </p>

              <p className="mt-4">
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

