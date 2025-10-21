package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.services.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
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

    @Operation(summary = "Get all teams", description = "Retrieves a paginated list of all teams.")
    @GetMapping
    public ResponseEntity<PageResponseDTO<TeamResponseDTO>> findAll(@RequestParam(required = false, defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "10") int size) {
        PageResponseDTO<TeamResponseDTO> teams = teamService.findAll(page, size);
        return ResponseEntity.ok(teams);
    }

    @Operation(summary = "Get team by ID", description = "Retrieves the details of a team by its unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> findById(@PathVariable Long id) {
        TeamResponseDTO team = teamService.findById(id);
        return ResponseEntity.ok(team);
    }

    @Operation(summary = "Create a new team", security = @SecurityRequirement(name = "bearer-key"), description = "Creates a new team with the provided data.")
    @PostMapping
    public ResponseEntity<TeamResponseDTO> save(@RequestBody CreateTeamDTO createTeamDTO) {
        Team savedTeam = teamService.save(createTeamDTO);
        URI address = URI.create("/api/teams/" + savedTeam.getId());
        return ResponseEntity.created(address).build();
    }


    @Operation(
            summary = "Upload team image",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Uploads an image for an existing team."
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "Team ID", example = "123")
            Long id,

            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        String imageUrl = teamService.uploadMedia(id, file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("teamId", id.toString());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a team", security = @SecurityRequirement(name = "bearer-key"), description = "Updates an existing team by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<TeamResponseDTO> update(@PathVariable Long id, @RequestBody @Valid UpdateTeamDTO updateTeamDTO) {
        TeamResponseDTO updatedTeam = teamService.update(id, updateTeamDTO);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a team", security = @SecurityRequirement(name = "bearer-key"), description = "Deletes a team by its unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
