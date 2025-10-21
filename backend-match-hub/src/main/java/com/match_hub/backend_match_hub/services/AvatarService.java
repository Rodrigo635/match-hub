package com.match_hub.backend_match_hub.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AvatarService {

    @Value("${app.upload.avatar}")
    private String avatarDir;

    @Value("${app.upload.ipv4}")
    private String ipv4;

    public String saveAvatar(MultipartFile file) {
        try {
            Path dirPath = Paths.get(avatarDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retorna a URL pública para acessar
            return "/avatar/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar avatar: " + e.getMessage(), e);
        }
    }

    public List<String> listAvatars() {
        try (Stream<Path> files = Files.list(Paths.get(avatarDir))) {
            return files
                    .filter(Files::isRegularFile)
                    .map(path -> "http://" + ipv4 + ":8080/avatar/" + path.getFileName().toString())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao listar avatares: " + e.getMessage(), e);
        }
    }
    public void deleteAvatar(String fileName) {
        try {
            Path filePath = Paths.get(avatarDir).resolve(fileName);

            if (!Files.exists(filePath)) {
                throw new RuntimeException("Avatar não encontrado: " + fileName);
            }

            Files.delete(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar avatar: " + e.getMessage(), e);
        }
    }

}
