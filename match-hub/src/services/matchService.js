import {
  createData,
  deleteData,
  getData,
  getDataById,
  updateData,
} from "./globalService";

// src/app/services/matchService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/matches`;

export async function getMatches(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getMatchesByChampionship(championshipId) {
  const response = await fetch(`${BASE_URL}/championship/${championshipId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar jogos: ${response.status}`);
  }
  return response.json();
}

export async function getMatchesByTeam(teamId, page = 0, size = 10) {
  const url = `${BASE_URL}/team/${teamId}?page=${page}&size=${size}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar partidas do time ${teamId}: ${res.status}`);
  }
  return await res.json();
}

export async function getMatchById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createMatch(matchData) {
  const payload = {
    ...matchData,
    teamDTOS: [{ teamId: matchData.team1Id }, { teamId: matchData.team2Id }],
  };

  delete payload.team1Id;
  delete payload.team2Id;

  return await createData(payload, BASE_URL);
}

export async function updateMatch(id, matchData) {
  const payload = {
    ...matchData,
    teamDTOS: [{ teamId: matchData.team1Id }, { teamId: matchData.team2Id }],
  };

  delete payload.team1Id;
  delete payload.team2Id;

  return await updateData(id, payload, BASE_URL);
}

export async function deleteMatch(id) {
  return await deleteData(id, BASE_URL);
}
