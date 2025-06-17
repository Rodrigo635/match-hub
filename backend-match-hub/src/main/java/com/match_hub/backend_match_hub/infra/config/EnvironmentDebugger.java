package com.match_hub.backend_match_hub.infra.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

// Classe para debug das variáveis de ambiente
@Component
public class EnvironmentDebugger {

    @Autowired
    private Environment environment;

    @PostConstruct
    public void debugEnvironmentVariables() {
        System.out.println("=== DEBUG VARIÁVEIS DE AMBIENTE ===");

        // Método 1: Usando Environment
        String clientId = environment.getProperty("GOOGLE_CLIENT_ID");
        String clientSecret = environment.getProperty("GOOGLE_CLIENT_SECRET");

        // Verificações
        if (clientId == null || clientId.isEmpty() || clientId.contains("${")) {
            System.err.println("❌ GOOGLE_CLIENT_ID não está definida corretamente");
        } else {
            System.out.println("✅ GOOGLE_CLIENT_ID está definida");
        }

        if (clientSecret == null || clientSecret.isEmpty() || clientSecret.contains("${")) {
            System.err.println("❌ GOOGLE_CLIENT_SECRET não está definida corretamente");
        } else {
            System.out.println("✅ GOOGLE_CLIENT_SECRET está definida");
        }
    }
}
