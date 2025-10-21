import { getUserByToken } from "../../services/userService";
import Cookies from "js-cookie";

function isTokenExpired(token) {
  if (!token) return true;

  try {
    // Decodifica o payload do JWT (assumindo que é um JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000; // Tempo atual em segundos

    // Verifica se o token tem campo 'exp' e se está expirado
    if (payload.exp && payload.exp < currentTime) {
      return true;
    }

    return false;
  } catch (error) {
    return true;
  }
}

function clearAuthData({ setToken, setUser }) {
  Cookies.remove("token");
  setToken(null);
  setUser([]);
  
}

export async function handleGetUser({ setToken, setUser }) {
  try {
    const token = Cookies.get("token");

    if (!token) {
      return
    }

    if (isTokenExpired(token)) {
      clearAuthData({ setToken, setUser });
      return
    }

    setToken(token);
    const userData = await getUserByToken(token);
    return userData;
  } catch (error) {

    if (
      error.message === "Token expirado." ||
      error.message === "Token não encontrado." ||
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      clearAuthData({ setToken, setUser });
    }

    return null;
  }
}



