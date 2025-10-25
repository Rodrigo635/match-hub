package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.*;
import com.match_hub.backend_match_hub.dtos.user.CreateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UpdateUserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserCredentialDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.dtos.user.favorites.FavoriteDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserNotFoundException;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.services.CustomOAuth2UserService;
import com.match_hub.backend_match_hub.services.PasswordResetService;
import com.match_hub.backend_match_hub.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Operation(
            summary = "Retrieve paginated list of users",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Returns a paginated list of users with their basic information."
    )
    @GetMapping
    public ResponseEntity<PageResponseDTO<UserResponseDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        var user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(
            summary = "Get authenticated user details",
            security = @SecurityRequirement(name = "bearer-key")
    )
    @GetMapping("/details")
    public ResponseEntity<?> getDetail(HttpServletRequest request) {
        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);
        var user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserCredentialDTO userDTO) {
        var response = userService.login(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/verify")
    public ResponseEntity<TokenDTO> verifyTwoFactor(@RequestBody Verify2FARequestDTO request) {
        var token = userService.verifyTwoFactor(request.email(), request.code());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<Map<String, String>> setupTwoFactor(@AuthenticationPrincipal User user) {
        var otpUrl = userService.enableTwoFactor(user);
        return ResponseEntity.ok(Map.of("otpUrl", otpUrl));
    }

    @Operation(summary = "User registration")
    @PostMapping("/register")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateUserDTO userDTO) {
        var registeredUser = userService.save(userDTO);
        var address = URI.create("/api/users/" + registeredUser.getId());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/2fa/disable")
    public ResponseEntity<Void> disableTwoFactor(@AuthenticationPrincipal UpdateUserDTO user) {
        userService.disableTwoFactor(user);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Atualiza o avatar do usuário",
            security = @SecurityRequirement(name = "bearer-key")
    )
    @PutMapping("/avatar")
    public ResponseEntity<Map<String, String>> setAvatar(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {

        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);
        var user = userService.findByEmail(email);

        // Pattern matching aprimorado com Java 25
        if (user.profilePicture() instanceof String pic
                && !pic.isBlank()
                && !pic.contains("avatar")) {
            userService.deleteImage(user.id());
        }

        var avatarUrl = body.get("avatarUrl");
        userService.setAvatar(user.id(), avatarUrl);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar atualizado com sucesso!",
                "avatarUrl", avatarUrl
        ));
    }

    @Operation(summary = "Upload user profile picture")
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id") @Parameter(description = "User ID", example = "123") Long id,
            @RequestParam("file") @Parameter(description = "Image file (JPG, PNG, GIF - max 20MB)") MultipartFile file) {

        var imageUrl = userService.uploadMedia(id, file);

        return ResponseEntity.ok(Map.of(
                "message", "Image uploaded successfully",
                "imageUrl", imageUrl,
                "userId", id.toString()
        ));
    }

    @Operation(
            summary = "Add favorite item",
            security = @SecurityRequirement(name = "bearer-key")
    )
    @PatchMapping("/favorites")
    public ResponseEntity<Void> addFavorite(
            @RequestBody FavoriteDTO favoriteDTO,
            HttpServletRequest request) {

        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);

        // Validação com contagem inline usando switch expression
        var count = switch(favoriteDTO) {
            case FavoriteDTO(var gameId, _, _) when gameId != null -> {
                userService.addFavoriteGame(email, gameId);
                yield 1;
            }
            case FavoriteDTO(_, var champId, _) when champId != null -> {
                userService.addFavoriteChampionship(email, champId);
                yield 1;
            }
            case FavoriteDTO(_, _, var teamId) when teamId != null -> {
                userService.addFavoriteTeam(email, teamId);
                yield 1;
            }
            default -> 0;
        };

        if (count != 1) {
            throw new IllegalArgumentException(
                    "Deve enviar exatamente um campo: gameId, championshipId ou teamId"
            );
        }

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete user profile picture", security = @SecurityRequirement(name = "bearer-key"))
    @DeleteMapping("/image/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteProfileImage(
            @PathVariable("id") @Parameter(description = "User ID", example = "123") Long id) {

        userService.deleteImage(id);

        return ResponseEntity.ok(Map.of(
                "message", "Image deleted successfully",
                "userId", id.toString()
        ));
    }

    @Operation(
            summary = "Remove favorite item",
            security = @SecurityRequirement(name = "bearer-key")
    )
    @DeleteMapping("/favorites")
    public ResponseEntity<Void> removeFavorite(
            @RequestBody FavoriteDTO favoriteDTO,
            HttpServletRequest request) {

        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);

        var count = switch(favoriteDTO) {
            case FavoriteDTO(var gameId, _, _) when gameId != null -> {
                userService.removeFavoriteGame(email, gameId);
                yield 1;
            }
            case FavoriteDTO(_, var champId, _) when champId != null -> {
                userService.removeFavoriteChampionship(email, champId);
                yield 1;
            }
            case FavoriteDTO(_, _, var teamId) when teamId != null -> {
                userService.removeFavoriteTeam(email, teamId);
                yield 1;
            }
            default -> 0;
        };

        if (count != 1) {
            throw new IllegalArgumentException(
                    "Deve enviar exatamente um campo: gameId, championshipId ou teamId"
            );
        }

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Remove all favorites",
            security = @SecurityRequirement(name = "bearer-key")
    )
    @DeleteMapping("/favorites/all")
    public ResponseEntity<Void> removeAllFavorites(HttpServletRequest request) {
        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);
        userService.removeAllFavorites(email);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update authenticated user", security = @SecurityRequirement(name = "bearer-key"))
    @PutMapping
    public ResponseEntity<UserResponseDTO> update(
            HttpServletRequest request,
            @RequestBody @Valid UpdateUserDTO updateUserDTO) {

        var token = tokenService.getToken(request);
        var email = tokenService.getSubject(token);
        userService.updateByEmail(email, updateUserDTO);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Admin update user by ID")
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> adminUpdate(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUserDTO updateUserDTO) {
        userService.updateById(id, updateUserDTO);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Initiate password reset")
    @PostMapping("/reset-password")
    public ResponseEntity<String> initiatePasswordReset(@RequestBody @Valid EmailDTO emailDTO) {
        passwordResetService.initiatePasswordReset(emailDTO.email());
        return ResponseEntity.ok("Password reset email sent");
    }

    @Operation(summary = "Confirm password reset")
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestBody @Valid ResetPasswordDTO resetPasswordDTO) {
        passwordResetService.resetPassword(token, resetPasswordDTO.password());
        return ResponseEntity.ok("Password reset successful");
    }

    @Operation(summary = "Get Google login URL")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved Google login URL.")
    @GetMapping("/google/login-url")
    public ResponseEntity<?> getGoogleLoginUrl() {
        var loginUrl = "http://localhost:8080/oauth2/authorization/google";
        return ResponseEntity.ok(Map.of("loginUrl", loginUrl));
    }

    @Operation(summary = "Get all OAuth2 users")
    @GetMapping("/oauth2/users")
    public ResponseEntity<?> getOAuth2Users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var googleUsers = customOAuth2UserService.findByProvider("GOOGLE", page, size);
        return ResponseEntity.ok(googleUsers);
    }

    @Operation(summary = "Simulate OAuth2 token")
    @PostMapping("/simulate-token")
    public ResponseEntity<?> simulateOAuth2Token(@RequestParam String email) {
        try {
            var response = customOAuth2UserService.simulateOAuth2Token(email);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "User OAuth2 not found",
                    "suggestion", "Please log in with Google: /api/auth/google/login-url"
            ));
        }
    }
}