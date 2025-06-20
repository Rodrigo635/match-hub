// src/app/services/teamService.js
const BASE_URL = 'http://82.112.245.100:8080/api/teams';

export async function getTeams(page = 0, size = 5) {
  const url = `${BASE_URL}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getTeams: erro status', res.status, text);
    throw new Error(`Erro ao buscar times: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getTeamById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('getTeamById: erro status', res.status, text);
    throw new Error(`Erro ao buscar time com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function createTeam(teamData) {
  let options = {
    method: 'POST',
    credentials: 'include',
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(BASE_URL, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('createTeam: erro status', res.status, text);
    throw new Error(`Erro ao criar time: ${res.status}`);
  }
  return res.json();
}

export async function updateTeam(id, teamData) {
  let options = {
    method: 'PUT',
    credentials: 'include',
  };
  if (teamData instanceof FormData) {
    options.body = teamData;
  } else {
    options.headers = {
      'Content-Type': 'application/json',
    };
    options.body = JSON.stringify(teamData);
  }
  const res = await fetch(`${BASE_URL}/${id}`, options);
  if (!res.ok) {
    const text = await res.text();
    console.error('updateTeam: erro status', res.status, text);
    throw new Error(`Erro ao atualizar time com id ${id}: ${res.status}`);
  }
  return res.json();
}

export async function deleteTeam(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('deleteTeam: erro status', res.status, text);
    throw new Error(`Erro ao deletar time com id ${id}: ${res.status}`);
  }
  return true;
}
