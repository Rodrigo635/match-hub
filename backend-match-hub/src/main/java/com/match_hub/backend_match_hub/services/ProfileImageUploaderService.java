package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;

@Service
public class ProfileImageUploaderService {

    @Autowired
    private FileService imageService;

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

    public <T extends HasProfileImage> void deleteProfileImage(T entity, JpaRepository<T, Long> repository, String folderName) {
        String profilePictureUrl = entity.getProfilePicture();

        if (profilePictureUrl != null && !profilePictureUrl.isBlank()) {
            // Extrai o nome do arquivo da URL
            String filename = Paths.get(profilePictureUrl).getFileName().toString();

            // Deleta a imagem específica (arquivo), não a pasta inteira
            imageService.deleteImage(folderName, entity.getId(), filename);

            // Remove a referência da imagem da entidade
            entity.setProfilePicture(null);

            // Salva a entidade atualizada
            repository.save(entity);
        }
    }

}
