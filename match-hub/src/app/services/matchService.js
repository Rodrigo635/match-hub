// src/app/services/matchService.js
const BASE_URL = 'http://82.112.245.100:8080/api/matches';

export async function getMatches(page = 0, size = 10) {
  const url = `${BASE_URL}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getMatches: erro status', res.status, text);
    throw new Error(`Erro ao buscar partidas: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getMatchById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getMatchById: erro status', res.status, text);
    throw new Error(`Erro ao buscar partida com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createMatch(matchData) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };
  if (matchData instanceof FormData) {
    options.body = matchData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(matchData);
  }
  const res = await fetch(BASE_URL, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('createMatch: erro status', res.status, text);
    throw new Error(`Erro ao criar partida: ${res.status}`);
  }
  return res.json();
}

export async function updateMatch(id, matchData) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (matchData instanceof FormData) {
    options.body = matchData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(matchData);
  }
  const res = await fetch(`${BASE_URL}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('updateMatch: erro status', res.status, text);
    throw new Error(`Erro ao atualizar partida com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteMatch(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('deleteMatch: erro status', res.status, text);
    throw new Error(`Erro ao deletar partida com id ${id}: ${res.status}`);
  }
  return true;
}
