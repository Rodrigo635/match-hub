import { getData, getDataById, createData, updateData, deleteData } from "./globalService";

// src/app/services/teamService.js
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/teams`;

export async function getTeams(page = 0, size = 5) {
  return await getData(page, size, BASE_URL);
}

export async function getTeamById(id) {
  return await getDataById(id, BASE_URL);
}

export async function createTeam(teamData) {
  return await createData(teamData);
}

export async function updateTeam(id, teamData) {
  return await updateData(id, teamData, BASE_URL);
}

export async function deleteTeam(id) {
  return await deleteData(id, BASE_URL);
}
