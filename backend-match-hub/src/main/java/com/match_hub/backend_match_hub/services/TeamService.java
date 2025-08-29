package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.CreateTeamDTO;
import com.match_hub.backend_match_hub.dtos.team.TeamResponseDTO;
import com.match_hub.backend_match_hub.dtos.team.UpdateTeamDTO;
import com.match_hub.backend_match_hub.entities.Team;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.mapper.TeamMapper;
import com.match_hub.backend_match_hub.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private MediaUploaderService mediaUploaderService;

    @Autowired
    private FileService fileService;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private PageMapper pageMapper;

    private static final String FOLDER = "teams";

    public PageResponseDTO<TeamResponseDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Team> matches = teamRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(matches, teamMapper::toResponseDto);
    }

    public TeamResponseDTO findById(Long id) {
        Team team = teamRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Team not found"));
        return teamMapper.toResponseDto(team);
    }

    public Team save(CreateTeamDTO createTeamDTO) {
        Team team = teamMapper.toEntity(createTeamDTO);
        return teamRepository.save(team);
    }


    public TeamResponseDTO update(Long id, UpdateTeamDTO updateTeamDTO) {
        Team existingTeam = teamRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Game not found"));

        teamMapper.updateEntityFromDto(updateTeamDTO, existingTeam);
        Team savedTeam = teamRepository.save(existingTeam);
        return teamMapper.toResponseDto(savedTeam);
    }

    public void delete(Long id) {
        Team team = teamRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Team not found"));
        fileService.deleteImageFolder(FOLDER, id);
        teamRepository.delete(team);
    }

    public String uploadMedia(Long id, MultipartFile file) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("team not found"));

        // Deleta a imagem antiga e faz o upload usando MediaUploaderService
        mediaUploaderService.deleteMedia(team, teamRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
        return mediaUploaderService.uploadMedia(team, file, teamRepository, FOLDER, MediaUploaderService.MediaType.IMAGE);
    }
}
