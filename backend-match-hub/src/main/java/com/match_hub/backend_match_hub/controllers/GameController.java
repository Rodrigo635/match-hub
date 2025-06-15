package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.CreateGameDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDto;
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
    public ResponseEntity<PageResponseDTO<GameResponseDto>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<GameResponseDto> games = gameService.findAll(page, size);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponseDto> findById(@PathVariable Long id) {
        GameResponseDto game = gameService.findById(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<Game> save(@RequestBody CreateGameDto createGameDto) {
        gameService.save(createGameDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameResponseDto> update(@PathVariable Long id, @RequestBody UpdateGameDto updateGameDto) {
        GameResponseDto game = gameService.update(id, updateGameDto);
        return ResponseEntity.ok(game);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gameService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
