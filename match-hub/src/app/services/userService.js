const API_URL = 'http://82.112.245.100:8080/api/users?page=0&size=5';

export async function getUsers() {
  const res = await fetch(API_URL, {
    method: 'GET',
    credentials: 'include' 
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar usuários');
  }

  const data = await res.json();
  return data;
}

export async function getUserById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  conso
  if (!res.ok) {
    throw new Error(`Erro ao buscar usuário com id ${id}`);
  }
  return res.json();
}

export async function createUser(userData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error('Erro ao criar usuário');
  }
  return res.json();
}

export async function updateUser(id, userData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar usuário com id ${id}`);
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar usuário com id ${id}`);
  }
  return true;
}