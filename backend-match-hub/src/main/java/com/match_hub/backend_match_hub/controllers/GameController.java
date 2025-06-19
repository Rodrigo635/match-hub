package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.CreateGameDTO;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDTO;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.services.GameService;
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
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public ResponseEntity<PageResponseDTO<GameResponseDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<GameResponseDTO> games = gameService.findAll(page, size);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponseDTO> findById(@PathVariable Long id) {
        GameResponseDTO game = gameService.findById(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<Game> save(@RequestBody CreateGameDTO createGameDto) {
        Game savedGame = gameService.save(createGameDto);
        URI address = URI.create("/api/games/" + savedGame.getId());
        return ResponseEntity.created(address).build();
    }

    @Operation(
            summary = "Upload user profile picture",
            description = "Uploads a profile picture for an existing user"
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "User ID", example = "123")
            Long id,

            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        // Processar upload
        String imageUrl = gameService.uploadProfileImage(id, file);

        // Resposta
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("gameId", id.toString());

        return ResponseEntity.ok(response);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateGameDTO updateGameDto) {
        gameService.update(id, updateGameDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
