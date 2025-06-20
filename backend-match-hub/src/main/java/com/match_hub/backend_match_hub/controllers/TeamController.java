package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.services.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping
    public ResponseEntity<PageResponseDTO<TeamResponseDTO>> findAll(@RequestParam(required = false, defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "10") int size) {
        PageResponseDTO<TeamResponseDTO> teams = teamService.findAll(page, size);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> findById(@PathVariable Long id) {
        TeamResponseDTO team = teamService.findById(id);
        return ResponseEntity.ok(team);
    }

    @PostMapping
    public ResponseEntity<TeamResponseDTO> save(@RequestBody CreateTeamDTO createTeamDTO) {
        Team savedTeam = teamService.save(createTeamDTO);
        URI address = URI.create("/api/teams/" + savedTeam.getId());
        return ResponseEntity.created(address).build();
    }

    @Operation(
            summary = "Upload user profile picture",
            description = "Uploads a profile picture for an existing user"
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "Team ID", example = "123")
            Long id,

            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        // Processar upload
        String imageUrl = teamService.uploadProfileImage(id, file);

        // Resposta
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("teamDTOS", id.toString());

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> update(@PathVariable Long id, @RequestBody UpdateTeamDTO updateTeamDTO) {
        TeamResponseDTO updatedTeam = teamService.update(id, updateTeamDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
