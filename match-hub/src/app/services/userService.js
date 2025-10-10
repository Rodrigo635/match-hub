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
  return await createData(userData, BASE_URL + "/register");
}

export async function updateUser(id, userData) {
  return await updateData(id, userData, BASE_URL);
}

export async function deleteUser(id) {
  return await deleteData(id, BASE_URL);
}

// --------------------- Autenticação ---------------------
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

export async function changeFontSize(fontSizeLevel, token) {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fontSizeLevel }),
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

export async function uploadPublicAvatar(selectedAvatar, token) {
  const res = await fetch(`${BASE_URL}/api/user/avatar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(selectedAvatar),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao fazer upload da imagem: ${res.status}, ${text}`);
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

export async function getPublicAvatar(){
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