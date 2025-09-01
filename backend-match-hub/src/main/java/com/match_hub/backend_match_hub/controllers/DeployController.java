package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.enums.UserRole;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deploy")
public class DeployController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserService userService;

    @Operation(
            summary = "Deploy da aplicação",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Executa script de deploy no servidor. Requer permissão de ADMIN."
    )
    @PostMapping("/start")
    public ResponseEntity<String> deploy(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);

        UserResponseDTO user = userService.findByEmail(email);
        if (user.role() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas administradores podem iniciar deploy.");
        }

        try {
            // Executa o script em background
            new ProcessBuilder("/bin/bash", "/root/deploy.sh")
                    .start();

            return ResponseEntity.ok("Deploy iniciado. O servidor será reiniciado em breve.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao iniciar deploy: " + e.getMessage());
        }
    }
}