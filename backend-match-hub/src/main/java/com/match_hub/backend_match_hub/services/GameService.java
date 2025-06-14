package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.game.CreateGameDto;
import com.match_hub.backend_match_hub.dtos.game.GameResponseDto;
import com.match_hub.backend_match_hub.entities.Game;
import com.match_hub.backend_match_hub.mapper.GameMapper;
import com.match_hub.backend_match_hub.repositories.ChampionshipRepository;
import com.match_hub.backend_match_hub.repositories.GameRepository;
import com.match_hub.backend_match_hub.services.exceptions.ObjectAlreadyExistsException;
import com.match_hub.backend_match_hub.services.exceptions.ObjectNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class GameService {

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameMapper gameMapper;

    public GameResponseDto findById(Long id) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Game not found"));
        return gameMapper.toResponseDto(game);
    }

    public List<GameResponseDto> findAll() {
        List<Game> games = gameRepository.findAll();
        return gameMapper.toResponseDtoList(games);
    }

    public Game save(CreateGameDto game) {
        try {
            if (!championshipRepository.existsById(game.championshipId())) {
                throw new ObjectNotFoundException("Championship not found");
            }
            Game savedGame = gameMapper.toEntity(game);
            gameRepository.save(savedGame);
            return savedGame;
        } catch (DataIntegrityViolationException e) {
            throw new ObjectAlreadyExistsException("Game already exists");
        }
    }
}
