// src/app/services/championshipService.js
import { getData, getDataById, createData, updateData, deleteData } from './globalService';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/championships`;

export async function getChampionships(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getChampionshipsByGame(gameId){
  const response = await fetch(`${BASE_URL}/game/${gameId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    console.error("getChampionshipsByGame: erro status", response.status, text);
    throw new Error(`Erro ao buscar jogos: ${response.status}`);
  }
  return response.json();
}

export async function getChampionshipById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createChampionship(championshipData) {
  return await createData(championshipData, BASE_URL);
}

export async function updateChampionship(id, championshipData) {
  return await updateData(id, championshipData, BASE_URL);
}

export async function deleteChampionship(id) {
  return await deleteData(id, BASE_URL);
}
