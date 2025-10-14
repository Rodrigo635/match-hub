package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.services.AvatarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    @Autowired
    private AvatarService avatarService;

    @Operation(summary = "Lista todos os avatares", description = "Retorna uma lista de URLs dos avatares disponíveis.")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getAvatars() {
        List<String> avatars = avatarService.listAvatars();

        Map<String, Object> response = new HashMap<>();
        response.put("count", avatars.size());
        response.put("avatars", avatars);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Upload do avatar", security = @SecurityRequirement(name = "bearer-key"), description = "Envia e salva um novo avatar no servidor.")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file")
            @Parameter(description = "Arquivo de imagem (JPG, PNG, GIF - máx. 20MB)")
            MultipartFile file) {

        String imageUrl = avatarService.saveAvatar(file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar enviado com sucesso!");
        response.put("imageUrl", imageUrl);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Deletar avatar", security = @SecurityRequirement(name = "bearer-key"), description = "Deleta um avatar pelo nome do arquivo.")
    @DeleteMapping(value = "/{fileName}")
    public ResponseEntity<Map<String, String>> deleteAvatar(
            @PathVariable
            @Parameter(description = "Nome do arquivo do avatar (ex: 1697123456789_avatar.png)")
            String fileName) {

        avatarService.deleteAvatar(fileName);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar deletado com sucesso!");

        return ResponseEntity.ok(response);
    }
}
