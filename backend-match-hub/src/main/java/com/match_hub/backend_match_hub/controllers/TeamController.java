package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.mapper.TeamMapper;
import com.match_hub.backend_match_hub.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private TeamMapper teamMapper;

    @GetMapping
    public ResponseEntity<PageResponseDTO<TeamDTO>> findAll(@RequestParam(required = false, defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "10") int size) {
        PageResponseDTO<TeamDTO> teams = teamService.findAll(page, size);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> findById(@PathVariable Long id) {
        Team team = teamService.findById(id);
        TeamDTO teamDTO = teamMapper.toResponseDto(team);
        return ResponseEntity.ok(teamDTO);
    }

    @PostMapping
    public ResponseEntity<TeamDTO> save(@RequestBody CreateTeamDTO createTeamDTO) {
        Team team = teamMapper.toEntity(createTeamDTO);
        Team savedTeam = teamService.save(team);
        TeamDTO savedTeamDTO = teamMapper.toResponseDto(savedTeam);
        URI address = URI.create("/api/teams/" + savedTeamDTO.id());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> update(@PathVariable Long id, @RequestBody UpdateTeamDTO updateTeamDTO) {
        TeamDTO updatedTeam = teamService.update(id, updateTeamDTO);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
