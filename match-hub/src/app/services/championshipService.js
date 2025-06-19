const API_URL = 'http://82.112.245.100:8080/api/championships?page=0&size=10';

export async function getChampionships() {
  const res = await fetch(API_URL, {
    method: 'GET',
    credentials: 'include' 
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar campeonatos');
  }

  const data = await res.json();
  return data;
}

export async function getChampionshipById(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar campeonato com id ${id}`);
  }
  return res.json();
}

export async function createChampionship(championshipData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(championshipData),
  });

  if (!res.ok) {
    throw new Error('Erro ao criar campeonato');
  }
  return res.json();
}

export async function updateChampionship(id, championshipData) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(championshipData),
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar campeonato com id ${id}`);
  }
  return res.json();
}

export async function deleteChampionship(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar campeonato com id ${id}`);
  }
  return true;
}