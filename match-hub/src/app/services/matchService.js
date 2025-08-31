import { createData, deleteData, getData, getDataById, updateData } from "./globalService";

// src/app/services/matchService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/matches`;

export async function getMatches(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getMatchById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createMatch(matchData) {
  return await createData(matchData, BASE_URL);
}

export async function updateMatch(id, matchData) {
  return await updateData(id, matchData, BASE_URL);
}

export async function deleteMatch(id) {
  return await deleteData(id, BASE_URL);
}
