import { createData, deleteData, getData, getDataById, updateData } from "./globalService";

// src/app/services/userService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;

export async function getUsers(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getUserById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createUser(userData) {
  return await createData(userData, BASE_URL);
}

export async function updateUser(id, userData) {
  return await updateData(id, userData, BASE_URL);
}

export async function deleteUser(id) {
  return await deleteData(id, BASE_URL);
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao fazer login: ${res.status}`);
  }
  return res.json();
}

export async function getUserByToken(token) {
  const res = await fetch(`${BASE_URL}/details`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getUserByToken: erro status", res.status, text);
    throw new Error(`Erro ao buscar usuário: ${res.status}, ${res}`);
  }
  return res.json();
}

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
    throw new Error(`Erro ao ativar modo escuro: ${res.status}, ${res}`);
  }
  return;
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
    throw new Error(`Erro ao ativar vLibras: ${res.status}, ${res}`);
  }
  return;
}

export async function updateInfoUser(formData, token) {
  

  const res = await fetch(`http://localhost:8080/api/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  if(formData.password !== undefined && !res.ok){
    return "Senha atual não confere!";
  }
  if(formData.password !== undefined && res.ok){
    alert("Senha alterada com sucesso!");
  }

  return;
}
