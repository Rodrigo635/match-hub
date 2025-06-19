package com.match_hub.backend_match_hub.services;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.MatchMapper;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.repositories.MatchRepository;
import com.match_hub.backend_match_hub.repositories.MatchTeamRepository;
import com.match_hub.backend_match_hub.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MatchService {

    @Autowired
    private MatchTeamRepository matchTeamRepository;

    @Autowired
    private MatchRepository MatchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MatchMapper matchMapper;

    @Autowired
    private PageMapper pageMapper;


    public PageResponseDTO<MatchResponseDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Match> matches = MatchRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(matches, matchMapper::toResponseDto);
    }

    public MatchResponseDTO findById(Long id) {
        Match match = MatchRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Match not found"));
        MatchResponseDTO matchDTO = matchMapper.toResponseDto(match);
        return matchDTO;
    }

    public MatchResponseDTO save(CreateMatchDTO createMatchDTO) {
        if (createMatchDTO.matchTeams().getFirst().teamId() == null) {
            throw new ObjectNotFoundException("Team not found");
        }
        Team team = teamRepository.findById(createMatchDTO.matchTeams().getFirst().teamId()).orElseThrow(() -> new ObjectNotFoundException("Team not found"));
        Match match = matchMapper.toEntity(createMatchDTO);
        MatchTeam matchTeam = new MatchTeam(team, match);
        MatchTeam savedMatchTeam = matchTeamRepository.save(matchTeam);
        match.getMatchTeams().add(savedMatchTeam);
        Match savedMatch = MatchRepository.save(match);
        return matchMapper.toResponseDto(savedMatch);
    }


    public MatchResponseDTO update(Long id, UpdateMatchDTO updateMatchDTO) {
        Match existingMatch = MatchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Match not found"));

        matchMapper.updateEntityFromDto(updateMatchDTO, existingMatch);
        Match savedMatch = MatchRepository.save(existingMatch);
        return matchMapper.toResponseDto(savedMatch);
    }

    public void delete(Long id) {
        MatchRepository.deleteById(id);
    }
}
