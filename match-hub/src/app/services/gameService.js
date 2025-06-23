// src/app/services/gameService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/games`;

export async function getGames(page = 0, size = 5) {
  const url = `${BASE_URL}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getGames: erro status', res.status, text);
    throw new Error(`Erro ao buscar jogos: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getGameById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar jogo com id ${id}`);
  }
  return res.json();
}

export async function createGame(gameData) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };
  if (gameData instanceof FormData) {
    options.body = gameData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(gameData);
  }
  const res = await fetch(BASE_URL, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('createGame: erro status', res.status, text);
    throw new Error(`Erro ao criar jogo: ${res.status}`);
  }
  return res.json();
}

export async function updateGame(id, gameData) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (gameData instanceof FormData) {
    options.body = gameData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(gameData);
  }
  const res = await fetch(`${BASE_URL}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('updateGame: erro status', res.status, text);
    throw new Error(`Erro ao atualizar jogo com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteGame(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('deleteGame: erro status', res.status, text);
    throw new Error(`Erro ao deletar jogo com id ${id}: ${res.status}`);
  }
  return true;
}
