package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
import com.match_hub.backend_match_hub.services.ChampionshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @GetMapping("")
    public ResponseEntity<PageResponseDTO<ChampionshipResponseDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<ChampionshipResponseDTO> championships = championshipService.findAll(page, size);
        return ResponseEntity.ok(championships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChampionshipResponseDTO> findById(@PathVariable Long id) {
        ChampionshipResponseDTO championship = championshipService.findById(id);
        return ResponseEntity.ok(championship);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateChampionshipDTO championshipDto) {
        ChampionshipResponseDTO createdChampionship = championshipService.save(championshipDto);
        URI address = URI.create("/api/championships/" + createdChampionship.id());
        return ResponseEntity.created(address).build();
    }

    @Operation(
            summary = "Upload user profile picture",
            description = "Uploads a profile picture for an existing user"
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "Championship ID", example = "123")
            Long id,

            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        // Processar upload
        String imageUrl = championshipService.uploadProfileImage(id, file);

        // Resposta
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("championshipId", id.toString());

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid UpdateChampionshipDTO championshipDto) {
        championshipService.update(id, championshipDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        championshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/addGame/{id}/{gameId}")
    public ResponseEntity<Void> addGame(@PathVariable Long id, @PathVariable Long gameId) {
        championshipService.addGame(id, gameId);
        return ResponseEntity.noContent().build();
    }

}
