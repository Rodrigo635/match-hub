package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
import com.match_hub.backend_match_hub.services.ChampionshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/championships")
public class ChampionshipController {
    @Autowired
    private ChampionshipService championshipService;


    @PostMapping("/create")
    public ResponseEntity<Void> createChampionship(@RequestBody @Valid CreateChampionshipDTO championshipDto) {
        ChampionshipResponseDTO createdChampionship = championshipService.createChampionship(championshipDto);
        URI address = URI.create("/api/championships/" + createdChampionship.id());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChampionshipResponseDTO> updateChampionship(@PathVariable Long id, @RequestBody @Valid UpdateChampionshipDTO championshipDto) {
        ChampionshipResponseDTO updatedChampionship = championshipService.updateChampionship(id, championshipDto);
        return ResponseEntity.ok(updatedChampionship);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChampionship(@PathVariable Long id) {
        championshipService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<PageResponseDTO<ChampionshipResponseDTO>> findAll(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        PageResponseDTO<ChampionshipResponseDTO> championships = championshipService.findAll(page, size);
        return ResponseEntity.ok(championships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChampionshipResponseDTO> findById(@PathVariable Long id) {
        ChampionshipResponseDTO championship = championshipService.findById(id);
        return ResponseEntity.ok(championship);
    }

    @PostMapping("/addGame/{id}/{gameId}")
    public ResponseEntity<Void> addGame(@PathVariable Long id, @PathVariable Long gameId) {
        championshipService.addGame(id, gameId);
        return ResponseEntity.noContent().build();
    }

}
