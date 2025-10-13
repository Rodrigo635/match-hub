import {
  createData,
  deleteData,
  getData,
  getDataById,
  updateData,
  uploadImage,
} from "./globalService";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;
const BASE_URL2 = `${process.env.NEXT_PUBLIC_BASE_URL}`;
// --------------------- CRUD Usuários ---------------------
export async function getUsers(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getUserById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createUser(userData) {
  return await createData(userData, `${BASE_URL}/register`);
}

export async function updateUser(id, userData) {
  return await updateData(id, userData, BASE_URL);
}

export async function deleteUser(id) {
  return await deleteData(id, BASE_URL);
}

// --------------------- Autenticação ---------------------
/*
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao fazer login: ${res.status} - ${text}`);
  }
  return res.json();
}
*/
export async function getUserByToken(token) {
  const res = await fetch(`${BASE_URL}/details`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getUserByToken: erro status", res.status, text);
    throw new Error(`Erro ao buscar usuário: ${res.status}, ${text}`);
  }
  return res.json();
}

// --------------------- Preferências ---------------------
export async function toggleColorMode(isDarkMode, token) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isDarkMode }),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao alterar modo de cor: ${res.status}, ${text}`);
  }
}

export async function toggleVLibrasMode(librasActive, token) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ librasActive }),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao ativar vLibras: ${res.status}, ${text}`);
  }
}

export async function changeFontSize(fontSize, token) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fontSize }),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao alterar tamanho da fonte: ${res.status}, ${text}`);
  }
}

// --------------------- Atualização de Perfil ---------------------
export async function updateInfoUser(formData, token) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if (formData.password !== undefined && !res.ok) {
    return "Senha atual não confere!";
  }
  if (formData.password !== undefined && res.ok) {
    alert("Senha alterada com sucesso!");
  }
}

// --------------------- Imagem de Perfil ---------------------
export async function uploadProfileImage(id, formData, token) {
  const file = formData.image;
  const fileMultipart = new FormData();
  fileMultipart.append("file", file);

  const res = await fetch(`${BASE_URL}/image/upload/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
    body: fileMultipart,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao fazer upload da imagem: ${res.status}, ${text}`);
  }

  return res;
}

export async function uploadPublicAvatar(avatarUrl, token) {
  console.log(JSON.stringify({ avatarUrl: avatarUrl }));
  const res = await fetch(`${BASE_URL}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatarUrl: avatarUrl }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Erro ao fazer upload da imagem: ${res.status}, ${errorText}`
    );
  }

  return res;
}

export async function deleteProfileImage(id, token) {
  const res = await fetch(`${BASE_URL}/image/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao deletar imagem de perfil: ${res.status}, ${text}`);
  }

  return res;
}

export async function getPublicAvatar() {
  const res = await fetch(`${BASE_URL2}/avatar`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao buscar avatar: ${res.status}, ${text}`);
  }

  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log(res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro no login: ${res.status}, ${text}`);
  }

  return res.json();
}

export async function verifyTwoFactor(email, code) {
  try {
    const res = await fetch(`${BASE_URL}/2fa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error("Resposta inválida do servidor");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Erro na verificação");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function setupTwoFactor(token) {
  const res = await fetch(`${BASE_URL}/2fa/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao configurar 2FA: ${res.status}, ${text}`);
  }

  return res.json();
}

export async function disableTwoFactor(token) {
  const res = await fetch(`${BASE_URL}/2fa/disable`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao desativar 2FA: ${res.status}, ${text}`);
  }
}

export async function resetPassword(email) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }), 
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao resetar senha: ${res.status}, ${text}`);
  }
}

export async function resetPasswordConfirm(token, password) {
  console.log(token, password);

  const res = await fetch(`${BASE_URL}/reset-password/confirm?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }), // apenas a senha no body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao resetar senha: ${res.status}, ${text}`);
  }
}

// --------------------- Favoritos ---------------------
export async function toggleFavoriteGame(id, token, type) {
  console.log("toggleFavoriteGame", id, type, token);

  const body = {};

  switch (type) {
    case "game":
      body.gameId = id;
      break;
    case "championship":
      body.championshipId = id;
      break;
    case "team":
      body.teamId = id;
      break;
    default:
      throw new Error("Tipo de favorito inválido");
  }

  console.log(body);

  const res = await fetch(`${BASE_URL}/favorites`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  
console.log(res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao alternar favorito: ${res.status}, ${text}`);
  }

}

// --------------------- Remover Favorito ---------------------
export async function removeFavorite(id, token, type) {
  console.log("removeFavorite", id, type, token);

  const body = {};

  switch (type) {
    case "game":
      body.gameId = id;
      break;
    case "championship":
      body.championshipId = id;
      break;
    case "team":
      body.teamId = id;
      break;
    default:
      throw new Error("Tipo de favorito inválido");
  }

  console.log("DELETE body:", body);

  const res = await fetch(`${BASE_URL}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  console.log(res);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao remover favorito: ${res.status}, ${text}`);
  }

  // Se 204, não há corpo, apenas retorna
  return;
}



