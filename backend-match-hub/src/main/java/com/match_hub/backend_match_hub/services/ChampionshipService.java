package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDto;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDto;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDto;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.ChampionshipMapper;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.repositories.ChampionshipRepository;
import com.match_hub.backend_match_hub.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ChampionshipService {

    @Autowired
    private PageMapper pageMapper;


    @Autowired
    private ChampionshipRepository repository;

    @Autowired
    private ChampionshipMapper mapper;

    @Autowired
    private GameRepository gameRepository;

    public ChampionshipResponseDto createChampionship(CreateChampionshipDto championshipDto) {
        Game game = gameRepository.findById(championshipDto.gameId()).orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        Championship championship = mapper.toEntity(championshipDto);
        championship.setGame(game);
        repository.save(championship);
        return mapper.toResponseDto(championship);
    }

    public ChampionshipResponseDto updateChampionship(Long id, UpdateChampionshipDto championshipDto) {
        Championship championship = repository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        if(championshipDto.name() != null) championship.setName(championshipDto.name());
        if(championshipDto.imageChampionship() != null) championship.setImageChampionship(championshipDto.imageChampionship());
        Championship updatedChampionship = repository.save(championship);
        return mapper.toResponseDto(updatedChampionship);
    }

    public void deleteById(Long id) {
        Championship championship = repository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        repository.delete(championship);
    }

    public PageResponseDTO<ChampionshipResponseDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Championship> championship = repository.findAll(pageable);
        return pageMapper.toPageResponseDto(championship, mapper::toResponseDto);
    }

    public ChampionshipResponseDto findById(Long id) {
        Championship championship = repository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        return mapper.toResponseDto(championship);
    }

    public void addGame(Long championshipId, Long gameId) {
        Championship championship = repository.findById(championshipId)
                .orElseThrow(() -> new ObjectNotFoundException("Championship not found with ID: " + championshipId));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found with ID: " + gameId));

        championship.setGame(game);
        repository.save(championship);
    }


}
