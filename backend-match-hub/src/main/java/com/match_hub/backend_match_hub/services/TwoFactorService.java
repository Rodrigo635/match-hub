package com.match_hub.backend_match_hub.services;

import de.taimos.totp.TOTP;
import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

@Service
public class TwoFactorService {
    private static final int TIME_STEP = 30;
    private static final int ALLOWED_TIME_DRIFT = 1;

    public String generateSecretKey() {
        byte[] buffer = new byte[10];
        new SecureRandom().nextBytes(buffer);
        Base32 codec = new Base32();
        return codec.encodeToString(buffer);
    }

    // Cria o link que o Google Authenticator vai ler
    public String getOtpAuthURL(String username, String secret) {
        String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);
        String encodedIssuer = URLEncoder.encode("MatchHub", StandardCharsets.UTF_8);
        return "otpauth://totp/" + encodedIssuer + ":" + encodedUsername + "?secret=" + secret + "&issuer=" + encodedIssuer;
    }

    // Valida o código informado pelo usuário COM JANELA DE TEMPO
    public boolean verifyCode(String secret, String code) {
        try {
            Base32 base32 = new Base32();
            byte[] bytes = base32.decode(secret);
            String hexKey = Hex.encodeHexString(bytes);

            long currentTime = System.currentTimeMillis() / 1000;
            long timeStep = currentTime / TIME_STEP;

            System.out.println("=== DEBUG 2FA ===");
            System.out.println("Hora atual: " + new java.util.Date());
            System.out.println("Time step atual: " + timeStep);
            System.out.println("Código recebido: " + code);

            // Verifica no intervalo [current - ALLOWED_TIME_DRIFT, current + ALLOWED_TIME_DRIFT]
            for (int i = -ALLOWED_TIME_DRIFT; i <= ALLOWED_TIME_DRIFT; i++) {
                // Para usar com a biblioteca TOTP atual, precisamos simular a mudança de tempo
                String testCode = generateCodeForTimeStep(hexKey, timeStep + i);
                System.out.println("Tentando time step " + (timeStep + i) + ", código: " + testCode);

                if (testCode.equals(code)) {
                    System.out.println("✅ Código válido no time step " + (timeStep + i));
                    System.out.println("=================");
                    return true;
                }
            }

            System.out.println("❌ Nenhum código válido encontrado na janela de tempo");
            System.out.println("=================");
            return false;

        } catch (Exception e) {
            System.err.println("Erro ao verificar código: " + e.getMessage());
            return false;
        }
    }

    // Método auxiliar para gerar código para um time step específico
    private String generateCodeForTimeStep(String hexKey, long timeStep) {
        try {
            return generateTOTPForTimeStep(hexKey, timeStep);
        } catch (Exception e) {
            return "";
        }
    }

    private String generateTOTPForTimeStep(String hexKey, long timeStep) {
        try {
            byte[] timeBytes = new byte[8];
            for (int i = 7; i >= 0; i--) {
                timeBytes[i] = (byte) (timeStep & 0xFF);
                timeStep >>= 8;
            }
            byte[] keyBytes = Hex.decodeHex(hexKey.toCharArray());
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA1");
            javax.crypto.spec.SecretKeySpec signKey = new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA1");
            mac.init(signKey);
            byte[] hash = mac.doFinal(timeBytes);

            // Dynamic Truncation (RFC 4226)
            int offset = hash[hash.length - 1] & 0xF;
            long binary = ((hash[offset] & 0x7F) << 24) |
                    ((hash[offset + 1] & 0xFF) << 16) |
                    ((hash[offset + 2] & 0xFF) << 8) |
                    (hash[offset + 3] & 0xFF);

            long otp = binary % 1000000; // 6 dígitos
            return String.format("%06d", otp);

        } catch (Exception e) {
            return "";
        }
    }
}