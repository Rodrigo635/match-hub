const API_URL = 'http://82.112.245.100:8080/api/matches?page=0&size=10';

export async function getMatches() {
  const res = await fetch(API_URL, {
    method: 'GET',
    credentials: 'include' 
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar partidas');
  }

  const data = await res.json();
  return data;
}

export async function getMatchesById(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar partida com id ${id}`);
  }
  return res.json();
}

export async function createMatches(matchData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  });

  if (!res.ok) {
    throw new Error('Erro ao criar partida');
  }
  return res.json();
}

export async function updateMatches(id, matchData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar partida com id ${id}`);
  }
  return res.json();
}

export async function deleteMatches(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar partida com id ${id}`);
  }
  return true;
}