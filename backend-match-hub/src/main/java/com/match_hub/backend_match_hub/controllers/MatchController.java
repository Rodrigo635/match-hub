package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.CreateMatchDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.services.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping
    public ResponseEntity<PageResponseDTO<MatchResponseDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<MatchResponseDTO> matches = matchService.findAll(page, size);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponseDTO> findById(@PathVariable Long id) {
        MatchResponseDTO match = matchService.findById(id);
        return ResponseEntity.ok(match);
    }

    @PostMapping
    @Operation(summary = "Create a match", description = "Complete match for an existing team")
    public ResponseEntity<?> save(@RequestBody @Valid CreateMatchDTO createMatchDTO) {
        MatchResponseDTO match = matchService.save(createMatchDTO);
        System.out.println(match);
        URI address = URI.create("/api/matches/" + match.id());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody @Valid UpdateMatchDTO updateMatchDTO) {
        matchService.update(id, updateMatchDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
