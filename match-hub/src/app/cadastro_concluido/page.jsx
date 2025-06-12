'use client';
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';

export default function CadastroConcluido() {

  return (
    <>
    <link rel="stylesheet" href="/css/cadastro.css" />
    <link rel="stylesheet" href="/css/cadastro_concluido.css" />

      <main className="bg-image py-5 main-teste">
        <div className="container">
          <div className="card bg-dark text-white rounded-4 mx-auto p-4 p-md-5 col-12 col-md-10 col-lg-6">
            <img
              id="gif-concluido"
              alt="GIF concluido"
              className="img-fluid rounded-4 mx-auto d-block mb-4"
              style={{ maxHeight: '250px', minHeight: '250px', objectFit: 'contain' }}
            />

            <div className="card-body text-center">
              <h2 className="titulo fw-bold text-center">Cadastro concluído com sucesso!</h2>
              <h5 className="subtitulo fs-5 fs-md-3 text-center">
                Parabéns por concluir seu cadastro na Match Hub! Agora você pode acompanhar seus campeonatos de
                e-sports favoritos. Clique no botão abaixo para continuar.
              </h5>
            </div>

            <div className="card-body text-center">
              <Link href="/" className="btn-continuar">
                <h5 className="mb-0">Continuar</h5>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
