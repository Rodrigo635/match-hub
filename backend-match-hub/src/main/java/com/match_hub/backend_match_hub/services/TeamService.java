package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.TeamMapper;
import com.match_hub.backend_match_hub.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private PageMapper pageMapper;



    public PageResponseDTO<TeamDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> matches = teamRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(matches, teamMapper::toResponseDto);
    }

    public Team findById(Long id) {
        return teamRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Team not found"));
    }

    public Team save(Team team) {
        return teamRepository.save(team);
    }


    public TeamDTO update(Long id, UpdateTeamDTO updateTeamDTO) {
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        teamMapper.updateEntityFromDto(updateTeamDTO, existingTeam);
        Team savedTeam = teamRepository.save(existingTeam);
        return teamMapper.toResponseDto(savedTeam);
    }

    public void delete(Long id) {
        teamRepository.deleteById(id);
    }
}
