import { useState } from 'react';
import Cookies from 'js-cookie';
import { toggleColorMode, toggleVLibrasMode } from '@/app/services/userService';
import { useRouter } from 'next/navigation';

export default function Configuracoes({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);

  const changeColor = async (e) => {
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      const newDarkMode = !user.isDarkMode;
      
      await toggleColorMode(newDarkMode, token);
      
      router.refresh();
      
      
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
      
      setUser(prevUser => ({
        ...prevUser,
        librasActive: newVLibrasState
      }));

      router.refresh();
      
    } catch (error) {
      console.error("Erro ao alterar V-Libras:", error);
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
            <button 
              className="btn btn-outline-primary"
              onClick={toggleVLibras}
            >
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
            <button 
              className="btn btn-outline-primary" 
              onClick={changeColor}
            >
              {user.isDarkMode ? "Ativar" : "Desativar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}