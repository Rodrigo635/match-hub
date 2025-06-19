package com.match_hub.backend_match_hub.infra.config;


import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Getter
public class EnviromentConfig {

    @Autowired
    private Environment env;

    private String clientId;
    private String clientSecret;
    private String appUrlDir;

    @PostConstruct
    public void init() {
        this.clientId = env.getProperty("GOOGLE_CLIENT_ID");
        this.clientSecret = env.getProperty("GOOGLE_CLIENT_SECRET");
        this.appUrlDir = env.getProperty("app.upload.dir");

        System.out.println("=== DEBUG VARIÁVEIS FINAL ===");
        System.out.println("GOOGLE_CLIENT_ID: " + (clientId != null ? "DEFINIDO" : "NÃO DEFINIDO"));
        System.out.println("GOOGLE_CLIENT_SECRET: " + (clientSecret != null ? "DEFINIDO" : "NÃO DEFINIDO"));
        System.out.println("app.upload.dir: " + (appUrlDir != null ? "DEFINIDO" : "NÃO DEFINIDO"));

        if (clientId == null || clientSecret == null) {
            throw new IllegalStateException("Variáveis OAuth não estão definidas!");
        }

        if (appUrlDir == null) {
            throw new IllegalStateException("Variável app.url.dir não está definida!");
        }

    }

}
