package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.infra.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileService {

    @Value("${app.upload.dir}")
    private Path baseDir;

    @Value("${app.upload.ipv4}")
    private String ipv4;

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

            return "http://" + ipv4 + "8080:/uploads/" + dir + "/" + id + "/" + filename;

        } catch (IOException e) {
            throw new ObjectNotFoundException("Falha ao salvar imagem");
        }
    }

    public void deleteImageFolder(String dir, Long id) {
        Path folder = baseDir.resolve(dir + "/" + id);
        if (Files.exists(folder)) {
            try (Stream<Path> walk = Files.walk(folder)) {
                walk.sorted(Comparator.reverseOrder()) // delete files first, then directories
                        .forEach(path -> {
                            File file = path.toFile();
                            if (!file.delete()) {
                                throw new RuntimeException("Failed to delete file: " + file.getAbsolutePath());
                            }
                        });

                System.out.println("Deleted folder: " + folder);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete folder: " + folder, e);
            }
        } else {
            System.out.println("Folder does not exist: " + folder);
        }
    }

    public void deleteImage(String dir, Long id, String filename) {
        Path filePath = baseDir.resolve(dir + "/" + id + "/" + filename);
        try {
            if (Files.exists(filePath)) {
                boolean deleted = Files.deleteIfExists(filePath);
                if (!deleted) {
                    throw new RuntimeException("Failed to delete file: " + filePath);
                }
            } else {
                System.out.println("File does not exist: " + filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error deleting file: " + filePath, e);
        }
    }

}

