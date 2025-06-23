// src/app/services/championshipService.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getChampionships(page = 0, size = 10) {
  const url = `${BASE_URL}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getChampionships: erro status', res.status, text);
    throw new Error(`Erro ao buscar campeonatos: ${res.status}`);
  }
  return res.json();
}

export async function getChampionshipById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getChampionshipById: erro status', res.status, text);
    throw new Error(`Erro ao buscar campeonato com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createChampionship(championshipData) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };
  if (championshipData instanceof FormData) {
    options.body = championshipData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(championshipData);
  }
  const res = await fetch(BASE_URL, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('createChampionship: erro status', res.status, text);
    throw new Error(`Erro ao criar campeonato: ${res.status}`);
  }
  return res.json();
}

export async function updateChampionship(id, championshipData) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (championshipData instanceof FormData) {
    options.body = championshipData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(championshipData);
  }
  const res = await fetch(`${BASE_URL}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('updateChampionship: erro status', res.status, text);
    throw new Error(`Erro ao atualizar campeonato com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteChampionship(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('deleteChampionship: erro status', res.status, text);
    throw new Error(`Erro ao deletar campeonato com id ${id}: ${res.status}`);
  }
  return true;
}
