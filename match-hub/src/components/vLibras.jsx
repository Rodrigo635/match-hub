"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserByToken } from "@/services/userService";

function VLibras({ forceOnload }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkUserLibrasActive = async () => {
      const token = Cookies.get("token");
      if (token) {
        const user = await getUserByToken(token);
        if (user && user.librasActive === true) {
          setShouldRender(true);
        }
      }
    };

    checkUserLibrasActive();
  }, []);

  useEffect(() => {
    if (!shouldRender || isLoaded) return;

    // Verificar se o script já foi carregado
    const existingScript = document.querySelector(
      'script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]'
    );
    if (existingScript) {
      // Se o script já existe, apenas inicializar o widget
      initializeVLibras();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      initializeVLibras();
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remover apenas se o componente estiver sendo desmontado
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [shouldRender, isLoaded]);

  const initializeVLibras = () => {
    // Aguardar um pouco para garantir que o DOM esteja pronto
    setTimeout(() => {
      if (window.VLibras && window.VLibras.Widget) {
        // Limpar qualquer instância anterior
        const existingWidget = document.querySelector(".vw-plugin-wrapper");
        if (existingWidget && existingWidget.innerHTML) {
          existingWidget.innerHTML = "";
        }

        // Inicializar o widget
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        setIsLoaded(true);

        // Forçar onload se necessário
        if (forceOnload && typeof window.onload === "function") {
          window.onload();
        }
      } 
    }, 100);
  };

  // Só renderizar se shouldRender for true
  if (!shouldRender) {
    return null;
  }

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}

export default VLibras;
