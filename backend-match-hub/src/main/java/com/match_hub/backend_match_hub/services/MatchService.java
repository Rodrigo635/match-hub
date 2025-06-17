package com.match_hub.backend_match_hub.services;


import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.match.MatchDTO;
import com.match_hub.backend_match_hub.dtos.match.UpdateMatchDTO;
import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import com.match_hub.backend_match_hub.mapper.MatchMapper;
import com.match_hub.backend_match_hub.mapper.PageMapper;
import com.match_hub.backend_match_hub.repositories.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
    @Autowired
    private MatchRepository MatchRepository;

    @Autowired
    private MatchMapper matchMapper;

    @Autowired
    private PageMapper pageMapper;


    public PageResponseDTO<MatchDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Match> matches = MatchRepository.findAll(pageable);
        return pageMapper.toPageResponseDto(matches, matchMapper::toResponseDto);
    }

    public Match findById(Long id) {
        return MatchRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Match not found"));
    }

    public Match save(Match Match) {
        return MatchRepository.save(Match);
    }


    public MatchDTO update(Long id, UpdateMatchDTO updateMatchDTO) {
        Match existingMatch = MatchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Match not found"));

        matchMapper.updateEntityFromDto(updateMatchDTO, existingMatch);
        Match savedMatch = MatchRepository.save(existingMatch);
        return matchMapper.toResponseDto(savedMatch);
    }

    public void delete(Long id) {
        MatchRepository.deleteById(id);
    }
}
