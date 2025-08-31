import { createData, deleteData, getData, getDataById, updateData, uploadImage } from "./globalService.js";

// src/app/services/gameService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/games`;

export async function getGames(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getGameById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createGame(gameData) {
  return await createData(gameData, BASE_URL);
}

export async function updateGame(id, gameData) {
  return await updateData(id, gameData, BASE_URL);
}

export async function deleteGame(id) {
  return await deleteData(id, BASE_URL);
}
