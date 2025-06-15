package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.game.CreateGameDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.dtos.game.UpdateGameDto;
import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.mapper.GameMapper;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.repositories.ChampionshipRepository;
import com.match_hub.backend_match_hub.repositories.GameRepository;
import com.match_hub.backend_match_hub.services.exceptions.ObjectAlreadyExistsException;
import com.match_hub.backend_match_hub.services.exceptions.ObjectNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class GameService {

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameMapper gameMapper;

    @Autowired
    private PageMapper pageMapper;


    public GameResponseDto findById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Game not found"));
        return gameMapper.toResponseDto(game);
    }

    // Usando PageResponseDto Record, não sei como funciona mais funciona 👍
    public PageResponseDTO<GameResponseDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Game> games = gameRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(games, gameMapper::toResponseDto);
    }

    public void save(CreateGameDto game) {
        try {
            Championship championship = championshipRepository.findById(game.championshipId())
                    .orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
            Game savedGame = gameMapper.toEntity(game);
            savedGame.setChampionship(championship);
            gameRepository.save(savedGame);
        } catch (DataIntegrityViolationException e) {
            throw new ObjectAlreadyExistsException("Game already exists");
        }
    }

    public GameResponseDto update(Long id, UpdateGameDto updateGameDto) {
        Game existingGame = gameRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        // Validar championship se fornecido
        if (updateGameDto.championshipId() != null) {
            championshipRepository.findById(updateGameDto.championshipId())
                    .orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        }

        gameMapper.updateEntityFromDto(updateGameDto, existingGame);
        Game savedGame = gameRepository.save(existingGame);
        return gameMapper.toResponseDto(savedGame);
    }

    public void deleteById(Long id) {
        gameRepository.deleteById(id);
    }
}
