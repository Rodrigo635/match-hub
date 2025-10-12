import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toggleColorMode, toggleVLibrasMode, changeFontSize } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const FONT_SIZE_MIN = 0;
const FONT_SIZE_MAX = 2;

export default function Configuracoes({ user: initialUser }) {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [user, setUser] = useState({
    ...initialUser,
  });

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
    if (user.fontSize >= FONT_SIZE_MAX) return;
    const newLevel = user.fontSize + 1;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      await changeFontSize(newLevel, token);
      setUser(prev => ({ ...prev, fontSize: newLevel }));
      refreshUser();
      const newSize = 1 + newLevel * 0.07;
      document.documentElement.style.fontSize = `${newSize}em`;
    } catch (error) {
      console.error("Erro ao aumentar tamanho da fonte:", error);
    }
  };

  const decreaseFont = async () => {
    if (user.fontSize <= FONT_SIZE_MIN) return;
    const newLevel = user.fontSize - 1;
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      await changeFontSize(newLevel, token);
      setUser(prev => ({ ...prev, fontSize: newLevel }));
      refreshUser();
      const newSize = 1 + newLevel * 0.07;
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
            <button type="button" className="btn btn-outline-primary" onClick={toggleVLibras}>
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
            <button type="button" className="btn btn-outline-primary" onClick={changeColor}>
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
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={decreaseFont}
                disabled={user.fontSize <= FONT_SIZE_MIN}
              >
                -
              </button>
              <span className="text-white">
                Nível {user.fontSize} de {FONT_SIZE_MAX}
              </span>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={increaseFont}
                disabled={user.fontSize >= FONT_SIZE_MAX}
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