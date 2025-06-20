// src/app/services/userService.js
const BASE_URL = 'http://82.112.245.100:8080/api/users';

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
  let options = {
    method: 'POST',
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
  const res = await fetch(`${BASE_URL}/register`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('createUser: erro status', res.status, text);
    throw new Error(`Erro ao criar usuário: ${res.status}`);
  }
  return res.json();
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
