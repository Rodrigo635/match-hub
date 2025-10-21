package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
import com.match_hub.backend_match_hub.services.ChampionshipService;
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
@RequestMapping("/api/championships")
public class ChampionshipController {

    @Autowired
    private ChampionshipService championshipService;

    @Operation(summary = "Get all championships", description = "Retrieves a paginated list of all championships.")
    @GetMapping("")
    public ResponseEntity<PageResponseDTO<ChampionshipResponseDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<ChampionshipResponseDTO> championships = championshipService.findAll(page, size);
        return ResponseEntity.ok(championships);
    }

    @Operation(summary = "Get Championships by Game", description = "List all championships from the selected game")
    @GetMapping("/game/{gameId}")
    public ResponseEntity<PageResponseDTO<ChampionshipResponseDTO>> findByGame(
            @PathVariable Long gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponseDTO<ChampionshipResponseDTO> championships = championshipService.findByGame(gameId, page, size);

        return ResponseEntity.ok(championships);
    }

    @Operation(summary = "Get championship by ID", description = "Retrieves the details of a championship by its unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ChampionshipResponseDTO> findById(@PathVariable Long id) {
        ChampionshipResponseDTO championship = championshipService.findById(id);
        return ResponseEntity.ok(championship);
    }

    @Operation(summary = "Create a new championship", security = @SecurityRequirement(name = "bearer-key"), description = "Creates a new championship with the provided data.")
    @PostMapping("")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateChampionshipDTO championshipDto) {
        ChampionshipResponseDTO createdChampionship = championshipService.save(championshipDto);
        URI address = URI.create("/api/championships/" + createdChampionship.id());
        return ResponseEntity.created(address).build();
    }

    @Operation(
            summary = "Upload championship image",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Uploads an image for an existing championship."
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "Championship ID", example = "123")
            Long id,
            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        String imageUrl = championshipService.uploadMedia(id, file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("championshipId", id.toString());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a championship", security = @SecurityRequirement(name = "bearer-key"), description = "Updates an existing championship by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid UpdateChampionshipDTO championshipDto) {
        championshipService.update(id, championshipDto);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a championship", security = @SecurityRequirement(name = "bearer-key"), description = "Deletes a championship by its unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        championshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add a game to championship", security = @SecurityRequirement(name = "bearer-key"), description = "Adds an existing game to a championship.")
    @PostMapping("/addgame/{id}/{gameId}")
    public ResponseEntity<Void> addGame(@PathVariable Long id, @PathVariable Long gameId) {
        championshipService.addGame(id, gameId);
        return ResponseEntity.noContent().build();
    }

}
