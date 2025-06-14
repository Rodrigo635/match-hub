package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.game.CreateGameDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameResponseDto>> findAll() {
        List<GameResponseDto> games = gameService.findAll();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponseDto> findById(@PathVariable Long id) {
        GameResponseDto game = gameService.findById(id);
        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<Game> save(@RequestBody CreateGameDto createGameDto) {
        Game savedGame = gameService.save(createGameDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
