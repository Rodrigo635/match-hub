import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toggleColorMode, toggleVLibrasMode, changeFontSize } from "@/app/services/userService";
import { useRouter } from "next/navigation";

export default function Configuracoes({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState({
    ...initialUser,
    fontSizeLevel: initialUser.fontSizeLevel || 0 // 0: default, 1: +0.15em, 2: +0.30em
  });

  useEffect(() => {
    const level = user.fontSizeLevel;
    const newSize = 1 + level * 0.07;
    document.documentElement.style.fontSize = `${newSize}em`;
  }, [user.fontSizeLevel]);

const changeColor = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token não encontrado");
      return;
    }
    const newDarkMode = !user.isDarkMode;
    await toggleColorMode(newDarkMode, token);

    setUser(prev => ({ ...prev, isDarkMode: newDarkMode }));

    // Atualiza o atributo no html para mudar o tema globalmente
    document.documentElement.setAttribute("data-theme", newDarkMode ? "dark" : "light");
  } catch (error) {
    console.error("Erro ao alterar modo de cor:", error);
  }
};


  

  const toggleVLibras = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      const newVLibrasState = !user.librasActive;

      const res = await toggleVLibrasMode(newVLibrasState, token);

      setUser((prevUser) => ({
        ...prevUser,
        librasActive: newVLibrasState,
      }));

      window.location.reload();
    } catch (error) {
      console.error("Erro ao alterar V-Libras:", error);
    }
  };

  const increaseFont = async () => {
    if (user.fontSizeLevel >= 2) return;
    const newLevel = user.fontSizeLevel + 1;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      await changeFontSize(newLevel, token);
      setUser(prev => ({ ...prev, fontSizeLevel: newLevel }));
      const newSize = 1 + newLevel * 0.7;
      document.documentElement.style.fontSize = `${newSize}em`;
    } catch (error) {
      console.error("Erro ao aumentar tamanho da fonte:", error);
    }
  };

  const decreaseFont = async () => {
    if (user.fontSizeLevel <= 0) return;
    const newLevel = user.fontSizeLevel - 1;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      await changeFontSize(newLevel, token);
      setUser(prev => ({ ...prev, fontSizeLevel: newLevel }));
      const newSize = 1 + newLevel * 0.7;
      document.documentElement.style.fontSize = `${newSize}em`;
    } catch (error) {
      console.error("Erro ao diminuir tamanho da fonte:", error);
    }
  };

  return (
    <div>
      <h2 className="text-azul mb-3">Configurações</h2>

      {/* Card V-Libras */}
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">Habilitar V-Libras</p>
            <button className="btn btn-outline-primary" onClick={toggleVLibras}>
              {user.librasActive ? "Desativar" : "Ativar"}
            </button>
          </div>
        </div>
      </div>

      {/* Card Modo Claro/Escuro */}
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Modo claro <i className="fa-solid fa-sun"></i>
            </p>
            <button className="btn btn-outline-primary" onClick={changeColor}>
              {user.isDarkMode ? "Ativar" : "Desativar"}
            </button>
          </div>
        </div>
      </div>

      {/* Card Tamanho da Fonte */}
      <div
        className="card mb-3"
        style={{ backgroundColor: "var(--cor-bgEscuro)", border: "none" }}
      >
        <div className="card-body text-white">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Tamanho da fonte <i className="fa-solid fa-text-size"></i>
            </p>
            <div>
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={decreaseFont}
                disabled={user.fontSizeLevel <= 0}
              >
                -
              </button>
              <button 
                className="btn btn-outline-primary" 
                onClick={increaseFont}
                disabled={user.fontSizeLevel >= 2}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
