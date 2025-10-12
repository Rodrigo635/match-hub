"use client";
import React, { useState } from "react";
import styles from './StarRating.module.css';
// src/app/contato/page.js
import Script from "next/script";



export default function ContatoPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRating = (value) => {
    setRating(value);
  };

  return (
    <>
      <main className="page-contato">
        <link rel="stylesheet" href="/css/contato.css" />
        {/* Carousel com membros */}
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicadores */}
          <div className="carousel-indicators">
            {/* 6 slides: Gabriel, Miguel, Luis, Michel, Rodrigo */}
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="4"
              aria-label="Slide 5"
            ></button>
          </div>

          {/* Itens do carousel */}
          <div className="carousel-inner">
            {/* Slide 0: Gabriel */}
            <div className="carousel-item active" data-bs-interval="10000">
              <div className="foto-jogo-gabriel py-md-5">
                <div className="container descricao py-5">
                  <div className="dados row justify-content-between">
                    <div className="infos col col-lg-9">
                      <div className="row justify-content-md-center">
                        <div className="foto col">
                          <img
                            className="img-fluid rounded-3"
                            src="/static/img/contato/gabriel2.png"
                            alt="Foto do Gabriel"
                          />
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <h1 className="text-azul fw-bold text-center text-lg-start">
                            Gabriel Vilela Peixoto
                          </h1>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Função - Desenvolvimento do site, design e
                            documentação.
                          </h5>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Curso - Sistemas de Informação - FIAP (1° Ano).
                          </h5>
                          <h5 className="text-white text-center text-lg-start">
                            Me chamo Gabriel Vilela Peixoto, tenho 20 anos, sou
                            formado em Técnico de Informática, nasci em
                            Cajuru-SP mas moro em Ribeirão Preto-SP. Atualmente
                            estou cursando Sistemas de Informação pela FIAP.
                          </h5>
                          <h5 className="text-rosa-fiap my-4 text-center text-lg-start">
                            RM: 562125
                          </h5>
                          <div className="redes d-flex align-items-start justify-content-center justify-content-lg-start mb-4 gap-3">
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://github.com/gabrielvilela12"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">GitHub</h5>
                              </a>
                              <a
                                href="https://github.com/gabrielvilela12"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/github.png"
                                  alt="Logo do GitHub"
                                  width="50px"
                                />
                              </a>
                            </div>
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://www.linkedin.com/in/gabriel-vilela-6a02a72b7/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">Linkedin</h5>
                              </a>
                              <a
                                href="https://www.linkedin.com/in/gabriel-vilela-6a02a72b7/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/linkedin.jpeg"
                                  alt="Logo do Linkedin"
                                  width="50px"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 1: Miguel */}
            <div className="carousel-item" data-bs-interval="10000">
              <div className="foto-jogo-miguel py-md-5">
                <div className="container descricao py-5">
                  <div className="dados row justify-content-between">
                    <div className="infos col col-lg-9">
                      <div className="row justify-content-md-center">
                        <div className="foto col">
                          <img
                            className="img-fluid rounded-3"
                            src="/static/img/contato/miguel.png"
                            alt="Foto do Miguel"
                          />
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <h1 className="text-azul fw-bold text-center text-lg-start">
                            Miguel Kawe Dos Anjos Assis
                          </h1>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Função - Desenvolvimento do site, design e
                            documentação.
                          </h5>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Curso - Sistemas de Informação - FIAP (1° Ano).
                          </h5>
                          <h5 className="text-white text-center text-lg-start">
                            Me chamo Miguel Kawe Dos Anjos Assis, tenho 18 anos,
                            sou formado como Técnico em Desenvolvimento de
                            Sistemas, nasci e moro em Caçapava-SP. Atualmente
                            estou cursando Sistemas de Informação pela FIAP.
                          </h5>
                          <h5 className="text-rosa-fiap my-4 text-center text-lg-start">
                            RM: 562196
                          </h5>
                          <div className="redes d-flex align-items-start justify-content-center justify-content-lg-start mb-4 gap-3">
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://github.com/MiguelAssis0"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">GitHub</h5>
                              </a>
                              <a
                                href="https://github.com/MiguelAssis0"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/github.png"
                                  alt="Logo do GitHub"
                                  width="50px"
                                />
                              </a>
                            </div>
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://www.linkedin.com/in/miguel-anjoss/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">Linkedin</h5>
                              </a>
                              <a
                                href="https://www.linkedin.com/in/miguel-anjoss/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/linkedin.jpeg"
                                  alt="Logo do Linkedin"
                                  width="50px"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 2: Luis */}
            <div className="carousel-item" data-bs-interval="10000">
              <div className="foto-jogo-luis py-md-5">
                <div className="container descricao py-5">
                  <div className="dados row justify-content-between">
                    <div className="infos col col-lg-9">
                      <div className="row justify-content-md-center">
                        <div className="foto col">
                          <img
                            className="img-fluid rounded-3"
                            src="/static/img/contato/luis.png"
                            alt="Foto do Luis"
                          />
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <h1 className="text-azul fw-bold text-center text-lg-start">
                            Luis Gustavo Fernandes Rivalta
                          </h1>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Função - Desenvolvimento do site, design e
                            documentação.
                          </h5>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Curso - Sistemas de Informação - FIAP (1° Ano).
                          </h5>
                          <h5 className="text-white text-center text-lg-start">
                            Meu nome é Luis Gustavo Fernandes Rivalta, tenho 20
                            anos, nasci em Ribeirão Preto-SP e atualmente moro
                            em Cajuru-SP, gosto de programar e quero ser um
                            desenvolvedor FullStack. Atualmente curso Sistemas
                            de informação na FIAP.
                          </h5>
                          <h5 className="text-rosa-fiap my-4 text-center text-lg-start">
                            RM: 561742
                          </h5>
                          <div className="redes d-flex align-items-start justify-content-center justify-content-lg-start mb-4 gap-3">
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://github.com/LuisRivalta"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">GitHub</h5>
                              </a>
                              <a
                                href="https://github.com/LuisRivalta"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/github.png"
                                  alt="Logo do GitHub"
                                  width="50px"
                                />
                              </a>
                            </div>
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://www.linkedin.com/in/luisrivalta/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">Linkedin</h5>
                              </a>
                              <a
                                href="https://www.linkedin.com/in/luisrivalta/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/linkedin.jpeg"
                                  alt="Logo do Linkedin"
                                  width="50px"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 3: Michel */}
            <div className="carousel-item" data-bs-interval="10000">
              <div className="foto-jogo-michel py-md-5">
                <div className="container descricao py-5">
                  <div className="dados row justify-content-between">
                    <div className="infos col col-lg-9">
                      <div className="row justify-content-md-center">
                        <div className="foto col">
                          <img
                            className="img-fluid rounded-3"
                            src="/static/img/contato/michel.png"
                            alt="Foto do Michel"
                          />
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <h1 className="text-azul fw-bold text-center text-lg-start">
                            Michel Pereira Dos Santos
                          </h1>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Função - Desenvolvimento do site, design e
                            documentação.
                          </h5>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Curso - Sistemas de Informação - FIAP (1° Ano).
                          </h5>
                          <h5 className="text-white text-center text-lg-start">
                            Meu nome é Michel Pereira Dos Santos, tenho 21 anos
                            e moro em São Paulo. Sou formado em Segurança da
                            Informação pela Fatec SCS e quero me tornar um
                            desenvolvedor backend. Atualmente curso Sistemas de
                            Informação na FIAP.
                          </h5>
                          <h5 className="text-rosa-fiap my-4 text-center text-lg-start">
                            RM: 564919
                          </h5>
                          <div className="redes d-flex align-items-start justify-content-center justify-content-lg-start mb-4 gap-3">
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://github.com/DarkFoxV"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">GitHub</h5>
                              </a>
                              <a
                                href="https://github.com/DarkFoxV"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/github.png"
                                  alt="Logo do GitHub"
                                  width="50px"
                                />
                              </a>
                            </div>
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://www.linkedin.com/in/michel-pereira42/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">Linkedin</h5>
                              </a>
                              <a
                                href="https://www.linkedin.com/in/michel-pereira42/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/linkedin.jpeg"
                                  alt="Logo do Linkedin"
                                  width="50px"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Slide 4: Rodrigo */}
            <div className="carousel-item" data-bs-interval="10000">
              <div className="foto-jogo-rodrigo py-md-5">
                <div className="container descricao py-5">
                  <div className="dados row justify-content-between">
                    <div className="infos col col-lg-9">
                      <div className="row justify-content-md-center">
                        <div className="foto col">
                          <img
                            className="img-fluid rounded-3"
                            src="/static/img/contato/rodrigo.png"
                            alt="Foto do Rodrigo"
                          />
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <h1 className="text-azul fw-bold text-center text-lg-start">
                            Rodrigo Froehlich Machado
                          </h1>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Função - Desenvolvimento do site, design e
                            documentação.
                          </h5>
                          <h5 className="text-white mb-3 text-center text-lg-start">
                            Curso - Sistemas de Informação - FIAP (1° Ano).
                          </h5>
                          <h5 className="text-white text-center text-lg-start">
                            Me chamo Rodrigo Froehlich Machado, tenho 22 anos.
                            Sou natural de São Gabriel-RS e também sou formado
                            em inglês pela FISK. Trabalho como desenvolvedor
                            full stack e estou cursando Sistemas de Informação
                            na FIAP.
                          </h5>
                          <h5 className="text-rosa-fiap my-4 text-center text-lg-start">
                            RM: 562196
                          </h5>
                          <div className="redes d-flex align-items-start justify-content-center justify-content-lg-start mb-4 gap-3">
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://github.com/Rodrigo635"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">GitHub</h5>
                              </a>
                              <a
                                href="https://github.com/Rodrigo635"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/github.png"
                                  alt="Logo do GitHub"
                                  width="50px"
                                />
                              </a>
                            </div>
                            <div className="rede d-flex flex-column align-items-center">
                              <a
                                href="https://www.linkedin.com/in/rodrigo-froehlich-machado-7080b3234/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <h5 className="text-azul fw-bold">Linkedin</h5>
                              </a>
                              <a
                                href="https://www.linkedin.com/in/rodrigo-froehlich-machado-7080b3234/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/static/img/contato/linkedin.jpeg"
                                  alt="Logo do Linkedin"
                                  width="50px"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Controles (opcional) */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Próximo</span>
          </button>
        </div>

        {/* Seção “Quem somos nós?” */}
        <section className="quem-somos py-5">
          <div className="container">
            <div className="row gap-4 my-4">
              <div className="col mb-4 mb-lg-0 order-lg-2">
                <img
                  src="/static/img/contato/place-work.jpg"
                  alt="Equipe de e-sports competindo"
                  className="img-fluid img-custom h-100"
                />
              </div>
              <div className="col-lg-6 order-lg-1">
                <h1 className="mb-4 text-white fw-bold">Quem somos nós?</h1>
                <h5 className="text-white mb-4 texto-justificado">
                  Somos cinco estudantes do primeiro módulo de Sistemas de
                  Informação da FIAP e desenvolvemos este site como parte de um
                  trabalho acadêmico.
                </h5>
                <h5 className="text-white mb-4 texto-justificado">
                  Nosso objetivo é criar uma plataforma que centralize as datas
                  dos principais campeonatos de e-sports, facilitando o acesso
                  às informações para os fãs e entusiastas dos jogos
                  eletrônicos.
                </h5>
                <h5 className="text-white mb-4 texto-justificado">
                  Este projeto reforça nossos conhecimentos em desenvolvimento
                  web, colaboração em equipe e boas práticas de tecnologia,
                  entregando uma solução útil para a comunidade gamer.
                </h5>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de frase com canvas (particles) */}
        <section className="particles-section frase">
          <canvas id="particles-canvas"></canvas>
          <div className="container my-5 position-relative">
            <div className="row d-flex align-items-center h-100">
              <div className="col-md-12 col-lg-6">
                <h1 className="text-center text-white">
                  "A tecnologia nos une, os e-sports nos inspiram, e a inovação
                  nos move!"
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Seção “O que estamos buscando?” */}
        <section className="estamos-buscando py-5">
          <div className="container">
            <div className="row gap-4 my-4">
              <div className="col mb-4 mb-lg-0">
                <img
                  src="/static/img/contato/busca.jpg"
                  alt="Equipe de e-sports competindo"
                  className="img-fluid img-custom h-100"
                />
              </div>
              <div className="col-lg-6">
                <h1 className="mb-4 text-white fw-bold">
                  O que estamos buscando?
                </h1>
                <h5 className="text-white mb-4 texto-justificado">
                  Buscamos aprimorar nossas habilidades em trabalho em equipe,
                  pesquisa, design e usabilidade, garantindo que a experiência
                  do usuário seja completa.
                </h5>
                <h5 className="text-white mb-4 texto-justificado">
                  Nos preocupamos em criar uma interface acessível e responsiva,
                  para que os nossos usuários encontrem facilmente as
                  informações que buscam, independentemente do dispositivo
                  utilizado.
                </h5>
                <h5 className="text-white mb-4 texto-justificado">
                  Exploramos conceitos de UX/UI para tornar a navegação fluida,
                  nos desafiando a pensar em soluções inovadoras para trazer
                  mais interação.
                </h5>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário de Contato */}
        <section className="contate-nos imagem-bg-contato py-5" id="contate-nos">
          <div className="container">
            <div className="row justify-content-center" id="row-contato">
              {/* Formulário */}
              <form
                className="form col-12 col-md-8 col-lg-6 d-flex flex-column align-items-center text-white rounded-4 px-5"
                id="form-contato"
              >
                <h1 className="fw-bold text-center mb-4">Contate-nos</h1>
<div
                  className={styles.ratingContainer}
                  role="radiogroup"
                  aria-label="Avaliação de 1 a 5 estrelas"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`${styles.star} ${
                        hover >= star || rating >= star ? styles.active : ""
                      }`}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      title={`${star} estrela${star > 1 ? "s" : ""}`}
                      role="radio"
                      aria-checked={rating === star}
                      onClick={() => handleRating(star)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        onChange={() => handleRating(star)}
                        aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                        className={styles.input}
                      />
                      ★
                    </span>
                  ))}
                </div>

                <input type="hidden" name="_captcha" value="false" />
                <fieldset className="mb-4 mt-3 rounded-3">
                  <div className="container-input position-relative">
                    <input
                      className="form-control bg-dark text-white border border-2 rounded-2 p-3 mb-2"
                      type="text"
                      name="nome"
                      id="nome"
                      required
                      pattern="[A-Za-z\\s]+"
                      placeholder="Digite seu nome..."
                    />
                    <label htmlFor="nome">Nome</label>
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <div className="container-input position-relative">
                    <input
                      className="form-control bg-dark text-white border border-2 rounded-2 p-3 mb-2"
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="Digite seu email..."
                    />
                    <label htmlFor="email">E-mail</label>
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <div className="container-input position-relative">
                    <label htmlFor="titulo">Título</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border border-2 rounded-2 p-3 mb-2"
                      id="titulo"
                      required
                      placeholder="Digite um título..."
                      name="_subject"
                    />
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <div className="container-input position-relative">
                    <textarea
                      className="form-control bg-dark text-white border border-2 rounded-2 p-3 mb-2"
                      name="mensagem"
                      id="mensagem"
                      rows={5}
                      required
                      placeholder="Digite uma mensagem..."
                    ></textarea>
                    <label htmlFor="mensagem">Mensagem</label>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="btn-primary btn align-items-center w-100 fw-bold py-2 mb-2 rounded-3 btn-light btn-disabled"
                  id="btn-enviar"
                >
                  <h5 className="mb-0">Enviar</h5>
                </button>
              </form>

              {/* Mensagem de sucesso (inicialmente oculta; seu script pode alternar a classe) */}
              <div
                className="bg-dark d-none p-5 col-12 col-md-8 col-lg-6 d-flex flex-column align-items-center text-white rounded-4 px-5"
                id="success-message"
              >
                <h1 className="text-center">Formulário enviado com sucesso!</h1>
                <img src="/static/icons/caveira.gif" alt="Sucesso" />
                <button
                  className="btn-primary btn align-items-center w-100 fw-bold py-2 mb-2 rounded-3 btn-light my-4"
                  id="returnForm"
                >
                  Enviar outra mensagem
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Caso haja um script específico para validar/enviar o form ou manipular canvas particles */}
      {/* 
         Você pode carregar seu JS em layout.js (global) ou aqui nesta página:
      */}
      <Script src="/js/contato.js" strategy="afterInteractive" />
      <Script src="/js/global.js" strategy="afterInteractive" />
      <Script src="/js/api.js" strategy="afterInteractive" />
      {/* Bootstrap JS geralmente já está carregado no layout; se não, inclua também:
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" /> 
      */}
    </>
  );
}
