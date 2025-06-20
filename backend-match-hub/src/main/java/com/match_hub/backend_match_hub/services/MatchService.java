package com.match_hub.backend_match_hub.services;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.MatchMapper;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.repositories.ChampionshipRepository;
import com.match_hub.backend_match_hub.repositories.MatchRepository;
import com.match_hub.backend_match_hub.repositories.MatchTeamRepository;
import com.match_hub.backend_match_hub.repositories.TeamRepository;
import com.match_hub.backend_match_hub.utils.HourConverterUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
public class MatchService {

    @Autowired
    private MatchTeamRepository matchTeamRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private MatchMapper matchMapper;

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    HourConverterUtil hourConverterUtil;


    public PageResponseDTO<MatchResponseDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Match> matches = matchRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(matches, matchMapper::toResponseDto);
    }

    public MatchResponseDTO findById(Long id) {
        Match match = matchRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Match not found"));
        MatchResponseDTO matchDTO = matchMapper.toResponseDto(match);
        return matchDTO;
    }

    public MatchResponseDTO save(CreateMatchDTO createMatchDTO) {

        LocalTime hour = hourConverterUtil.convert(createMatchDTO.hour());

        // Buscar times
        List<Team> teams = createMatchDTO.teamDTOS().stream()
                .map(matchTeamDTO -> teamRepository.findById(matchTeamDTO.teamId())
                        .orElseThrow(() -> new ObjectNotFoundException("Team not found with ID: " + matchTeamDTO.teamId())))
                .toList();

        // Buscar campeonato
        Championship championship = championshipRepository.findById(createMatchDTO.championshipId())
                .orElseThrow(() -> new ObjectNotFoundException("Championship not found with ID: " + createMatchDTO.championshipId()));

        // Criar partida
        Match match = matchMapper.toEntity(createMatchDTO);

        match.setHour(hour);
        match.setChampionshipId(championship);

        // Salvar partida
        Match savedMatch = matchRepository.save(match);

        // Criar e salvar MatchTeams
        List<MatchTeam> savedMatchTeams = teams.stream()
                .map(team -> {
                    MatchTeam matchTeam = new MatchTeam(team, savedMatch);
                    return matchTeamRepository.save(matchTeam);
                })
                .toList();

        // Associar MatchTeams na Match
        savedMatch.getMatchTeams().addAll(savedMatchTeams);

        // Retornar resposta
        return matchMapper.toResponseDto(savedMatch);
    }


    public MatchResponseDTO update(Long id, UpdateMatchDTO updateMatchDTO) {
        Match existingMatch = matchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Match not found with ID: " + id));

        // Atualizar championship se informado
        if (updateMatchDTO.championshipId() != null) {
            Championship championship = championshipRepository.findById(updateMatchDTO.championshipId())
                    .orElseThrow(() -> new ObjectNotFoundException("Championship not found with ID: " + updateMatchDTO.championshipId()));
            existingMatch.setChampionshipId(championship);
        }

        // Atualizar hora convertendo String -> LocalTime
        if (updateMatchDTO.hour() != null && !updateMatchDTO.hour().isBlank()) {
            LocalTime hour = hourConverterUtil.convert(updateMatchDTO.hour());
            existingMatch.setHour(hour);
        }

        // Atualizar link, se informado
        if (updateMatchDTO.link() != null) {
            existingMatch.setLink(updateMatchDTO.link());
        }

        // Atualizar lista de MatchTeams
        if (updateMatchDTO.teamDTOS() != null && !updateMatchDTO.teamDTOS().isEmpty()) {
            // Buscar todos os times informados
            List<Team> teams = updateMatchDTO.teamDTOS().stream()
                    .map(teamDTO -> teamRepository.findById(teamDTO.teamId())
                            .orElseThrow(() -> new ObjectNotFoundException("Team not found with ID: " + teamDTO.teamId())))
                    .toList();

            // Remover MatchTeams que não estão mais na lista
            existingMatch.getMatchTeams().removeIf(mt -> teams.stream().noneMatch(t -> t.getId().equals(mt.getTeam().getId())));

            // Adicionar novos MatchTeams que ainda não existem
            for (Team team : teams) {
                boolean exists = existingMatch.getMatchTeams().stream()
                        .anyMatch(mt -> mt.getTeam().getId().equals(team.getId()));
                if (!exists) {
                    MatchTeam newMatchTeam = new MatchTeam(team, existingMatch);
                    MatchTeam savedMatchTeam = matchTeamRepository.save(newMatchTeam);
                    existingMatch.getMatchTeams().add(savedMatchTeam);
                }
            }
        }

        Match savedMatch = matchRepository.save(existingMatch);
        return matchMapper.toResponseDto(savedMatch);
    }

    public void delete(Long id) {
        matchRepository.deleteById(id);
    }
}
