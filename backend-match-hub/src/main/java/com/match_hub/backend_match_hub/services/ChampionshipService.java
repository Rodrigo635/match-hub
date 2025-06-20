package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.ChampionshipResponseDTO;
import com.match_hub.backend_match_hub.dtos.championship.CreateChampionshipDTO;
import com.match_hub.backend_match_hub.dtos.championship.UpdateChampionshipDTO;
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
import org.springframework.web.multipart.MultipartFile;


@Service
@Transactional
public class ChampionshipService {

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private ProfileImageUploaderService profileImageUploaderService;

    @Autowired
    private FileService fileService;

    @Autowired
    private ChampionshipMapper championshipMapper;

    @Autowired
    private GameRepository gameRepository;

    public PageResponseDTO<ChampionshipResponseDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Championship> championship = championshipRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(championship, championshipMapper::toResponseDto);
    }

    public ChampionshipResponseDTO findById(Long id) {
        Championship championship = championshipRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        return championshipMapper.toResponseDto(championship);
    }

    public ChampionshipResponseDTO save(CreateChampionshipDTO championshipDto) {
        Game game = gameRepository.findById(championshipDto.gameId()).orElseThrow(() -> new ObjectNotFoundException("Game not found"));
        Championship championship = championshipMapper.toEntity(championshipDto);
        championship.setGame(game);
        championshipRepository.save(championship);
        return championshipMapper.toResponseDto(championship);
    }

    public void update(Long id, UpdateChampionshipDTO championshipDto) {
        Championship championship = championshipRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        championshipMapper.updateEntityFromDto(championshipDto, championship);
        championshipRepository.save(championship);
    }

    public void delete(Long id) {
        Championship championship = championshipRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        fileService.deleteImageFolder("championships", id);
        championshipRepository.delete(championship);
    }

    public void addGame(Long championshipId, Long gameId) {
        Championship championship = championshipRepository.findById(championshipId)
                .orElseThrow(() -> new ObjectNotFoundException("Championship not found with ID: " + championshipId));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found with ID: " + gameId));

        championship.setGame(game);
        championshipRepository.save(championship);
    }

    public String uploadProfileImage(Long id, MultipartFile file) {
        Championship championship = championshipRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Championship not found"));
        profileImageUploaderService.deleteProfileImage(championship, championshipRepository, "championships");
        return profileImageUploaderService.uploadProfileImage(championship, file, championshipRepository, "championships");
    }

}
