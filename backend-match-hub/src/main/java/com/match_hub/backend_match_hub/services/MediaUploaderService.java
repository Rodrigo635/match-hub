package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.entities.interfaces.HasGif;
import com.match_hub.backend_match_hub.entities.interfaces.HasProfileImage;
import com.match_hub.backend_match_hub.entities.interfaces.HasVideo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;

@Service
public class MediaUploaderService {

    @Autowired
    private FileService fileService;

    public enum MediaType {
        IMAGE, GIF, VIDEO
    }

    public <T> String uploadMedia(
            T entity,
            MultipartFile file,
            JpaRepository<T, Long> repository,
            String folderName,
            MediaType type
    ) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Invalid file format or size");
        }

        Long id = getEntityId(entity);
        String savedUrl = fileService.saveImage(file, folderName, id);

        switch (type) {
            case IMAGE -> ((HasProfileImage) entity).setProfilePicture(savedUrl);
            case GIF -> ((HasGif) entity).setGif(savedUrl);
            case VIDEO -> ((HasVideo) entity).setVideo(savedUrl);
        }

        repository.save(entity);
        return savedUrl;
    }

    public <T> void deleteMedia(
            T entity,
            JpaRepository<T, Long> repository,
            String folderName,
            MediaType type
    ) {
        String url = switch (type) {
            case IMAGE -> ((HasProfileImage) entity).getProfilePicture();
            case GIF -> ((HasGif) entity).getGif();
            case VIDEO -> ((HasVideo) entity).getVideo();
        };

        if (url != null && !url.isBlank()) {
            String filename = Paths.get(url).getFileName().toString();
            fileService.deleteImage(folderName, getEntityId(entity), filename);

            switch (type) {
                case IMAGE -> ((HasProfileImage) entity).setProfilePicture(null);
                case GIF -> ((HasGif) entity).setGif(null);
                case VIDEO -> ((HasVideo) entity).setVideo(null);
            }

            repository.save(entity);
        }
    }

    private <T> Long getEntityId(T entity) {
        if (entity instanceof HasProfileImage img) return img.getId();
        if (entity instanceof HasGif gif) return gif.getId();
        if (entity instanceof HasVideo vid) return vid.getId();
        throw new IllegalArgumentException("Entity must implement a media interface");
    }
}
