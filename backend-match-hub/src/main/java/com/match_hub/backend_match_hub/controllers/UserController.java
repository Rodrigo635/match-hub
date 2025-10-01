package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.EmailDTO;
import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.ResetPasswordDTO;
import com.match_hub.backend_match_hub.dtos.TokenDTO;
import com.match_hub.backend_match_hub.dtos.user.*;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    @Operation(summary = "Retrieve paginated list of users", description = "Returns a paginated list of users with their basic information. Supports pagination with page number and page size.")
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

    @Operation(summary = "User login", description = "Authenticates a user with email and password, and returns a JWT token.")
    @PostMapping("/login")
    public ResponseEntity<TokenDTO> userCredentials(@RequestBody @Valid UserCredentialDTO userDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());
        Authentication auth = authenticationManager.authenticate(token);
        return ResponseEntity.ok(new TokenDTO(tokenService.generateToken((User) auth.getPrincipal())));
    }

    @Operation(summary = "User registration", description = "Registers a new user with optional profile picture and returns the location of the created resource.")
    @PostMapping(path = "/register")
    public ResponseEntity<Void> save(@RequestBody @Valid CreateUserDTO userDTO) {
        User registeredUser = userService.save(userDTO);
        URI address = URI.create("/api/users/" + registeredUser.getId());
        return ResponseEntity.created(address).build();
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

    @Operation(summary = "Add favorite game", security = @SecurityRequirement(name = "bearer-key"), description = "Adds a game to the user's favorites.")
    @PatchMapping("/favorites/games/{gameId}")
    public ResponseEntity<Void> addFavoriteGame(@PathVariable Long gameId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.addFavoriteGame(email, gameId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add favorite championship", security = @SecurityRequirement(name = "bearer-key"), description = "Adds a championship to the user's favorites.")
    @PatchMapping("/favorites/championships/{championshipId}")
    public ResponseEntity<Void> addFavoriteChampionship(@PathVariable Long championshipId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.addFavoriteChampionship(email, championshipId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add favorite team", security = @SecurityRequirement(name = "bearer-key"), description = "Adds a team to the user's favorites.")
    @PatchMapping("/favorites/teams/{teamId}")
    public ResponseEntity<Void> addFavoriteTeam(@PathVariable Long teamId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.addFavoriteTeam(email, teamId);
        return ResponseEntity.noContent().build();
    }


    @Operation(summary = "Delete user profile picture", description = "Deletes the profile picture for an existing user.")
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

    @Operation(summary = "Remove favorite game", security = @SecurityRequirement(name = "bearer-key"), description = "Removes a game from the user's favorites.")
    @DeleteMapping("/favorites/games/{gameId}")
    public ResponseEntity<Void> removeFavoriteGame(@PathVariable Long gameId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.removeFavoriteGame(email, gameId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Remove favorite championship", security = @SecurityRequirement(name = "bearer-key"), description = "Removes a championship from the user's favorites.")
    @DeleteMapping("/favorites/championships/{championshipId}")
    public ResponseEntity<Void> removeFavoriteChampionship(@PathVariable Long championshipId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.removeFavoriteChampionship(email, championshipId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Remove favorite team", security = @SecurityRequirement(name = "bearer-key"), description = "Removes a team from the user's favorites.")
    @DeleteMapping("/favorites/teams/{teamId}")
    public ResponseEntity<Void> removeFavoriteTeam(@PathVariable Long teamId, HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        userService.removeFavoriteTeam(email, teamId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Remove all favorites",
            security = @SecurityRequirement(name = "bearer-key"),
            description = "Removes all favorite games, championships, and teams from the user."
    )
    @DeleteMapping("/favorites")
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
