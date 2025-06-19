package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.upload.dir}")
    private Path baseDir;

    public String saveImage(MultipartFile file, String dir, Long id) {
        System.out.println(baseDir);
        Path saveDir = baseDir.resolve(dir + "/" + id);
        System.out.println(saveDir);
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio");
        }

        try {
            // garante diretório
            if (Files.notExists(saveDir)) {
                Files.createDirectories(saveDir);
            }

            // gera nome único
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }
            String filename = UUID.randomUUID() + ext;

            // salva no disco
            Path target = saveDir.resolve(filename);
            file.transferTo(target.toFile());

            // retorna URL de acesso
            return "uploads/" + dir + "/" + id + "/" + filename;

        } catch (IOException e) {
            throw new ObjectNotFoundException("Falha ao salvar imagem");
        }
    }
}

