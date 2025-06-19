package com.match_hub.backend_match_hub.controllers;

import com.match_hub.backend_match_hub.dtos.PageResponseDTO;
import com.match_hub.backend_match_hub.dtos.user.*;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.User.TokenInvalidException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserNotFoundException;
import com.match_hub.backend_match_hub.infra.security.Filter;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.services.CustomOAuth2UserService;
import com.match_hub.backend_match_hub.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private Filter filter;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Operation(summary = "Get all users", description = "Returns all users")
    @GetMapping
    public ResponseEntity<PageResponseDTO<UserResponseDTO>> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<UserResponseDTO> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        UserResponseDTO user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Get user details", description = "Returns user details")
    @GetMapping("/details")
    public ResponseEntity<?> getDetail(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserResponseDTO user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "User login", description = "Logs in a user and returns a JWT token")
    @PostMapping("/login")
    public ResponseEntity<String> userCredentials(@Valid @RequestBody UserCredentialDTO userDTO) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());
        Authentication auth = authenticationManager.authenticate(token);

        return ResponseEntity.ok(tokenService.generateToken((User) auth.getPrincipal()));
    }

    @Operation(summary = "User registration", description = "Registers a new user with optional profile picture and returns a JWT token")
    @PostMapping(path = "/register")
    public ResponseEntity<CreateUserDTO> save(@RequestPart("user") @Valid CreateUserDTO userDTO) {
        // delega para o service: dto + arquivo (pode ser null)
        User registeredUser = userService.save(userDTO);

        URI address = URI.create("/api/users/" + registeredUser.getId());
        return ResponseEntity.created(address).build();
    }

    @Operation(
            summary = "Upload user profile picture",
            description = "Uploads a profile picture for an existing user"
    )
    @PostMapping(value = "/image/upload/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @PathVariable("id")
            @Parameter(description = "User ID", example = "123")
            Long id,

            @RequestParam("file")
            @Parameter(description = "Image file (JPG, PNG, GIF - max 5MB)")
            MultipartFile file) {

        // Processar upload
        String imageUrl = userService.uploadProfileImage(id, file);

        // Resposta
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("userId", id.toString());

        return ResponseEntity.ok(response);

    }


    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> update(HttpServletRequest request, @RequestBody UpdateUserDTO updateUserDTO) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserResponseDTO user = userService.findByEmail(email);
        userService.update(user.id(), updateUserDTO);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> adminUpdate(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {
        userService.update(id, updateUserDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

//Autenticação OAuth2 --> Google

    @GetMapping("/google/login-url")
    @Operation(summary = "Get Google Login URL", description = "Returns Google login URL")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved Google login URL")
    public ResponseEntity<?> getGoogleLoginUrl() {
        String loginUrl = "http://localhost:8080/oauth2/authorization/google";
        return ResponseEntity.ok(Map.of("loginUrl", loginUrl));
    }

    @GetMapping("/oauth2/users")
    @Operation(summary = "Get all users OAuth2", description = "Return all users OAuth2")
    public ResponseEntity<?> getOAuth2Users(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        PageResponseDTO<UserResponseDTO> googleUsers = customOAuth2UserService.findByProvider("GOOGLE", page, size);
        return ResponseEntity.ok(googleUsers);
    }

    @PostMapping("/simulate-token")
    @Operation(summary = "Simulate token OAuth2", description = "Simulate token for an existing user")
    public ResponseEntity<?> simulateOAuth2Token(@RequestParam String email) {
        try {
            var response = customOAuth2UserService.simulateOAuth2Token(email);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "User OAuth2 not found", "suggestion", "Make login with Google: /api/auth/google/login-url"));
        }
    }

    @PutMapping("/profile/complete")
    @Operation(summary = "Complete profile OAuth2", description = "Complete profile for an existing user")
    public ResponseEntity<?> completeOAuth2Profile(@RequestBody @Valid CompleteProfileRequestDTO request, HttpServletRequest httpRequest) {
        try {
            User updatedUser = customOAuth2UserService.completeOAuth2Profile(httpRequest, request);

            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", UserResponseDTO.fromEntity(updatedUser)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (TokenInvalidException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Unexpected error"));
        }
    }
}
