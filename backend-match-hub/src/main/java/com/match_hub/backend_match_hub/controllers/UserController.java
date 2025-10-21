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
import com.match_hub.backend_match_hub.services.TwoFactorService;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private TwoFactorService twoFactorService;

    @Operation(summary = "Retrieve paginated list of users", security = @SecurityRequirement(name = "bearer-key"), description = "Returns a paginated list of users with their basic information. Supports pagination with page number and page size.")
    @GetMapping
    public ResponseEntity<PageResponseDTO<UserResponseDTO>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<UserResponseDTO> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Retrieves a user by their unique ID.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        UserResponseDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Get authenticated user details", security = @SecurityRequirement(name = "bearer-key"), description = "Returns details of the authenticated user based on the JWT token.")
    @GetMapping("/details")
    public ResponseEntity<?> getDetail(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserResponseDTO user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserCredentialDTO userDTO) {
        // Toda lógica de 2FA está no service
        Object response = userService.login(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/verify")
    public ResponseEntity<TokenDTO> verifyTwoFactor(@RequestBody Verify2FARequestDTO request) {
        TokenDTO token = userService.verifyTwoFactor(request.email(), request.code());
        return ResponseEntity.ok(token);
    }

    // Endpoint para ativar 2FA
    @PostMapping("/2fa/setup")
    public ResponseEntity<Map<String, String>> setupTwoFactor(@AuthenticationPrincipal User user) {
        // user vem do token JWT
        String otpUrl = userService.enableTwoFactor(user);
        return ResponseEntity.ok(Map.of("otpUrl", otpUrl));
    }

    @Operation(summary = "User registration", description = "Registers a new user with optional profile picture and returns the location of the created resource.")
    @PostMapping(path = "/register")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateUserDTO userDTO) {
        User registeredUser = userService.save(userDTO);
        URI address = URI.create("/api/users/" + registeredUser.getId());
        return ResponseEntity.created(address).build();
    }

    @PutMapping("/2fa/disable")
    public ResponseEntity<Void> disableTwoFactor(@AuthenticationPrincipal UpdateUserDTO user) {
        userService.disableTwoFactor(user);
        return ResponseEntity.ok().build();
    }

    // Refatorar essa bomba depois, pode ser vetor de ataque. Perigoso :)
    @Operation(
            summary = "Atualiza o avatar do usuário",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Atualiza a URL do avatar do usuário autenticado utilizando o token JWT presente na requisição."
    )
    @PutMapping("/avatar")
    public ResponseEntity<Map<String, String>> setAvatar(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {

        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserResponseDTO user = userService.findByEmail(email);

        if (user.profilePicture() != null
                && !user.profilePicture().isBlank()
                && !user.profilePicture().contains("avatar")) {
            userService.deleteImage(user.id());
        }

        String avatarUrl = body.get("avatarUrl");
        userService.setAvatar(user.id(), avatarUrl);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Avatar atualizado com sucesso!");
        response.put("avatarUrl", avatarUrl);

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "Upload user profile picture", description = "Uploads a profile picture for an existing user.")
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "User ID", example = "123")
            Long id,
            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 20MB)")
            MultipartFile file) {

        String imageUrl = userService.uploadMedia(id, file);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("userId", id.toString());

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Add favorite item",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Adds a favorite item (game, championship, team) to the user's favorites."
    )
    @PatchMapping("/favorites")
    public ResponseEntity<Void> addFavorite(@RequestBody FavoriteDTO favoriteDTO, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);

        int count = 0;

        if (favoriteDTO.gameId() != null) {
            userService.addFavoriteGame(email, favoriteDTO.gameId());
            count++;
        }
        if (favoriteDTO.championshipId() != null) {
            userService.addFavoriteChampionship(email, favoriteDTO.championshipId());
            count++;
        }
        if (favoriteDTO.teamId() != null) {
            userService.addFavoriteTeam(email, favoriteDTO.teamId());
            count++;
        }

        if (count != 1) {
            throw new IllegalArgumentException("Deve enviar exatamente um campo: gameId, championshipId ou teamId");
        }

        return ResponseEntity.noContent().build();
    }


    @Operation(summary = "Delete user profile picture", security = @SecurityRequirement(name = "bearer-key"), description = "Deletes the profile picture for an existing user.")
    @DeleteMapping(value = "/image/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteProfileImage(
            @PathVariable("id")
            @Parameter(description = "User ID", example = "123")
            Long id) {

        userService.deleteImage(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Image deleted successfully");
        response.put("userId", id.toString());

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Remove favorite item",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Removes a favorite item (game, championship, team) from the user's favorites."
    )
    @DeleteMapping("/favorites")
    public ResponseEntity<Void> removeFavorite(@RequestBody FavoriteDTO favoriteDTO, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);

        int count = 0;

        if (favoriteDTO.gameId() != null) {
            userService.removeFavoriteGame(email, favoriteDTO.gameId());
            count++;
        }
        if (favoriteDTO.championshipId() != null) {
            userService.removeFavoriteChampionship(email, favoriteDTO.championshipId());
            count++;
        }
        if (favoriteDTO.teamId() != null) {
            userService.removeFavoriteTeam(email, favoriteDTO.teamId());
            count++;
        }

        if (count != 1) {
            throw new IllegalArgumentException("Deve enviar exatamente um campo: gameId, championshipId ou teamId");
        }

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Remove all favorites",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Removes all favorite games, championships, and teams from the user."
    )
    @DeleteMapping("/favorites/all")
    public ResponseEntity<Void> removeAllFavorites(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.removeAllFavorites(email);
        return ResponseEntity.noContent().build();
    }



    @Operation(summary = "Update authenticated user", security = @SecurityRequirement(name = "bearer-key"), description = "Updates the authenticated user using data from the JWT token.")
    @PutMapping
    public ResponseEntity<UserResponseDTO> update(HttpServletRequest request, @RequestBody @Valid UpdateUserDTO updateUserDTO) {

        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.updateByEmail(email, updateUserDTO);
        return ResponseEntity.noContent().build();

    }

    @Operation(summary = "Admin update user by ID", description = "Allows an admin to update any user by ID.")
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> adminUpdate(@PathVariable Long id, @RequestBody @Valid UpdateUserDTO updateUserDTO) {
        userService.updateById(id, updateUserDTO);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete user by ID", description = "Deletes a user by their unique ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Initiate password reset", description = "Sends a password reset email to the user.")
    @PostMapping("/reset-password")
    public ResponseEntity<String> initiatePasswordReset(@RequestBody @Valid EmailDTO emailDTO) {
        passwordResetService.initiatePasswordReset(emailDTO.email());
        return ResponseEntity.ok("Password reset email sent");
    }

    @Operation(summary = "Confirm password reset", description = "Confirms and completes the password reset process.")
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordDTO resetPasswordDTO) {
        passwordResetService.resetPassword(token, resetPasswordDTO.password());
        return ResponseEntity.ok("Password reset successful");
    }

    @Operation(summary = "Get Google login URL", description = "Returns the Google OAuth2 login URL.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved Google login URL.")
    @GetMapping("/google/login-url")
    public ResponseEntity<?> getGoogleLoginUrl() {
        String loginUrl = "http://localhost:8080/oauth2/authorization/google";
        return ResponseEntity.ok(Map.of("loginUrl", loginUrl));
    }

    @Operation(summary = "Get all OAuth2 users", description = "Returns all users authenticated via OAuth2 (Google).")
    @GetMapping("/oauth2/users")
    public ResponseEntity<?> getOAuth2Users(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<UserResponseDTO> googleUsers = customOAuth2UserService.findByProvider("GOOGLE", page, size);
        return ResponseEntity.ok(googleUsers);
    }

    @Operation(summary = "Simulate OAuth2 token", description = "Simulates an OAuth2 token for an existing user.")
    @PostMapping("/simulate-token")
    public ResponseEntity<?> simulateOAuth2Token(@RequestParam String email) {
        try {
            var response = customOAuth2UserService.simulateOAuth2Token(email);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "User OAuth2 not found", "suggestion", "Please log in with Google: /api/auth/google/login-url"));
        }
    }
}
