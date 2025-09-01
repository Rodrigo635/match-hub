package com.match_hub.backend_match_hub.controllers;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;

public class DeployController {

    @Operation(
            summary = "Deploy da aplicação",
            description = "Executa script de deploy no servidor. Requer permissão de ADMIN."
    )
    @PostMapping("/deploy")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deploy() {
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