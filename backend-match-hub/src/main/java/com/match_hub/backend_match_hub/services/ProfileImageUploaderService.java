package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileImageUploaderService {
    private final ImageService imageService;

    public ProfileImageUploaderService(ImageService imageService) {
        this.imageService = imageService;
    }

    public <T extends HasProfileImage> String uploadProfileImage(
            T entity,
            MultipartFile file,
            JpaRepository<T, Long> repository,
            String folderName
    ) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Invalid file format or size");
        }

        System.out.println("Uploading image for entity with ID: " + entity.getId());
        String savedAvatarUrl = imageService.saveImage(file, folderName, entity.getId());

        entity.setProfilePicture(savedAvatarUrl);
        repository.save(entity);

        return savedAvatarUrl;
    }
}
