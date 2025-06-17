package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.mapper.MatchMapper;
import com.match_hub.backend_match_hub.services.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @Autowired
    private MatchMapper matchMapper;


    @GetMapping
    public ResponseEntity<PageResponseDTO<MatchDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<MatchDTO> matches = matchService.findAll(page, size);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchDTO> findById(@PathVariable Long id) {
        Match match = matchService.findById(id);
        MatchDTO MatchDTO = matchMapper.toResponseDto(match);
        return ResponseEntity.ok(MatchDTO);
    }

    @PostMapping
    public ResponseEntity<MatchDTO> save(@RequestBody CreateMatchDTO createMatchDTO) {
        Match Match = matchMapper.toEntity(createMatchDTO);
        Match savedMatch = matchService.save(Match);
        MatchDTO savedMatchDTO = matchMapper.toResponseDto(savedMatch);
        URI address = URI.create("/api/matches/" + savedMatchDTO.id());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MatchDTO> update(@PathVariable Long id, @RequestBody UpdateMatchDTO updateMatchDTO) {
        MatchDTO updatedMatch = matchService.update(id, updateMatchDTO);
        return ResponseEntity.ok(updatedMatch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
