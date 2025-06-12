// src/app/layout.js
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'MATCH HUB',
  description: 'Site Match Hub - E-sports, campeonatos, notícias',
  icons: {
    shortcut: '/static/icons/gamepad.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* CSS globais via public/css */}
        <link rel="stylesheet" href="/css/bootstrap.css" />
        <link rel="stylesheet" href="/css/index.css" />
        <link rel="stylesheet" href="/css/home.css" />
        <link rel="stylesheet" href="/css/variaveis.css" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        {/* Scripts globais */}
        <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/js/index.js" strategy="afterInteractive" />
        <Script src="/js/global.js" strategy="afterInteractive" />
        <Script src="/js/api.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
