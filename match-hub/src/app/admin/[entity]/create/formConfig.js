// src/app/admin/[entity]/create/formConfig.js

// Mocks para selects (em produção, busque via API em useEffect)
export const mockChampionships = [
  { value: '1', label: 'Championship 1' },
  { value: '2', label: 'Championship 2' },
];
export const mockMatches = [
  { value: '1', label: 'Match 1' },
  { value: '2', label: 'Match 2' },
];
export const mockTeams = [
  { value: '1', label: 'Team Alpha' },
  { value: '2', label: 'Team Beta' },
];

// Configuração de campos por entidade
export const formFieldsConfig = {
  user: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Nome completo' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@exemplo.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Senha' },
    { name: 'born', label: 'Born', type: 'date' },
  ],
  team: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Nome do time' },
    { name: 'logo', label: 'Logo', type: 'text' },
  ],
  championship: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Nome do campeonato' },
    { name: 'image_championship', label: 'Image', type: 'file' },
  ],
  game: [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Nome do jogo' },
    { name: 'tournament', label: 'Tournament', type: 'text', placeholder: 'Torneio associado' },
    { name: 'image', label: 'Image', type: 'text' },
    { name: 'video', label: 'Video URL', type: 'text', placeholder: 'URL do vídeo' },
    { name: 'gif', label: 'GIF URL', type: 'text', placeholder: 'URL do GIF' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Descrição do jogo' },
    { name: 'tags', label: 'Tags', type: 'text', placeholder: 'e.g. Action, FPS' },
    { name: 'release', label: 'Release Date', type: 'date' },
    { name: 'genre', label: 'Genre', type: 'text', placeholder: 'Gênero' },
    { name: 'developer', label: 'Developer', type: 'text', placeholder: 'Desenvolvedora' },
    { name: 'publisher', label: 'Publisher', type: 'text', placeholder: 'Publicadora' },
    { name: 'age_rating', label: 'Age Rating', type: 'text', placeholder: 'e.g. 16+' },
  ],
  matches: [
    { name: 'data', label: 'Date', type: 'date' },
    { name: 'horario', label: 'Time', type: 'time' },
    { name: 'link', label: 'Link', type: 'text', placeholder: 'URL da partida' },
    { name: 'id_championship', label: 'Championship', type: 'select', options: mockChampionships },
  ],
  matches_teams: [
    { name: 'id_matches', label: 'Match', type: 'select', options: mockMatches },
    { name: 'id_teams', label: 'Team', type: 'select', options: mockTeams },
  ],
};
