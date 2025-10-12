// components/Gif.jsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const gifs = [
  "/static/icons/sonic.gif",
  "/static/icons/caveira.gif",
  "/static/icons/cj.gif",
  "/static/icons/gato.gif",
  "/static/icons/link.gif",
  "/static/icons/mario.gif",
  "/static/icons/yasuo.gif",
  "/static/icons/cs.gif",
  "/static/icons/jett.gif",
  "/static/icons/toasty.gif",
  "/static/icons/clash.gif",
];

export default function Gif() {
  const [gifEscolhido, setGifEscolhido] = useState('');

  useEffect(() => {
    const escolhido = gifs[Math.floor(Math.random() * gifs.length)];
    setGifEscolhido(escolhido);
  }, []);

  return (
    gifEscolhido && (
      <Image
        id="gif-concluido"
        src={gifEscolhido}
        alt="GIF concluído"
        className="img-fluid rounded-4 mx-auto d-block mb-4 loaded"
        style={{ maxHeight: '250px', minHeight: '250px', objectFit: 'contain' }}
      />
    )
  );
}
