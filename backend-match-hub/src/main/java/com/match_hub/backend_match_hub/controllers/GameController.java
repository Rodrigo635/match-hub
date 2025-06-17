package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.CreateGameDTO;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDTO;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        gameService.save(createGameDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameResponseDTO> update(@PathVariable Long id, @RequestBody UpdateGameDTO updateGameDto) {
        GameResponseDTO game = gameService.update(id, updateGameDto);
        return ResponseEntity.ok(game);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
