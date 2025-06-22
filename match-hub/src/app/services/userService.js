// src/app/services/userService.js
const BASE_URL = 'http://localhost:8080/api/users';

export async function getUsers(page = 0, size = 5) {
  const url = `${BASE_URL}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getUsers: erro status', res.status, text);
    throw new Error(`Erro ao buscar usuários: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getUserById: erro status', res.status, text);
    throw new Error(`Erro ao buscar usuário com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createUser(userData) {
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: userData instanceof FormData ? undefined : {
      'Content-Type': 'application/json',
    },
    body: userData instanceof FormData ? userData : JSON.stringify(userData),
  };

  const res = await fetch(`${BASE_URL}/register`, options);

  if (!res.ok) {
    const text = await res.text();
    console.error('createUser: erro status', res.status, text);
    throw new Error(`Erro ao criar usuário: ${res.status}`);
  }

  return res;
}

export async function updateUser(id, userData) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (userData instanceof FormData) {
    options.body = userData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(userData);
  }
  const res = await fetch(`${BASE_URL}/admin/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('updateUser: erro status', res.status, text);
    throw new Error(`Erro ao atualizar usuário com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('deleteUser: erro status', res.status, text);
    throw new Error(`Erro ao deletar usuário com id ${id}: ${res.status}`);
  }
  return true;
}

export  async function login(email, password){
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('login: erro status', res.status, text);
    throw new Error(`Erro ao fazer login: ${res.status}`);
  }
  return res.json();
}

export async function getUserByToken(token){
  const res = await fetch(`${BASE_URL}/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  if (!res.ok) {
    const text = await res.text();
    console.error('getUserByToken: erro status', res.status, text);
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
  return res.json();
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
  return res.json();
}