package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.user.UserCredentialDTO;
import com.match_hub.backend_match_hub.dtos.user.CompleteProfileRequestDTO;
import com.match_hub.backend_match_hub.dtos.user.UserDTO;
import com.match_hub.backend_match_hub.dtos.user.UserResponseDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.exceptions.User.TokenInvalidException;
import com.match_hub.backend_match_hub.infra.exceptions.User.UserNotFoundException;
import com.match_hub.backend_match_hub.infra.security.Filter;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import com.match_hub.backend_match_hub.services.CustomOAuth2UserService;
import com.match_hub.backend_match_hub.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

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

    @Operation(summary = "User login", description = "Logs in a user and returns a JWT token")
    @PostMapping("/login")
    public ResponseEntity<String> userCredentials(@Valid @RequestBody UserCredentialDTO userDTO){
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());
        Authentication auth = authenticationManager.authenticate(token);

        return  ResponseEntity.ok(tokenService.generateToken((User) auth.getPrincipal()));
    }

    @Operation(summary = "User registration", description = "Registers a new user and returns a JWT token")
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO) {
        UserDTO registeredUser = userService.registerUser(userDTO);
        URI address = URI.create("/api/users/" + registeredUser.email());
        return ResponseEntity.created(address).body(registeredUser);
    }

    @Operation(summary = "Get user details", description = "Returns user details")
    @GetMapping("/details")
    public ResponseEntity<UserDTO> getUser(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserDTO user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }


    //Autenticação OAuth2 --> Google


    @GetMapping("/google/login-url")
    @Operation(summary = "Get Google Login URL", description = "Returns Google login URL")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved Google login URL")
    public ResponseEntity<?> getGoogleLoginUrl() {
        String loginUrl = "http://localhost:8080/oauth2/authorization/google";
        return ResponseEntity.ok(Map.of(
                "loginUrl", loginUrl
        ));
    }

    @GetMapping("/oauth2/users")
    @Operation(summary = "Get all users OAuth2", description = "Return all users OAuth2")
    public ResponseEntity<?> getOAuth2Users() {
        List<User> googleUsers = userRepository.findByProvider("GOOGLE");
        return ResponseEntity.ok(googleUsers.stream().map(UserResponseDTO::fromEntity).collect(Collectors.toList()));
    }

    @PostMapping("/simulate-token")
    @Operation(summary = "Simulate token OAuth2", description = "Simulate token for an existing user")
    public ResponseEntity<?> simulateOAuth2Token(@RequestParam String email) {
        try {
            var response = customOAuth2UserService.simulateOAuth2Token(email);
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "User OAuth2 not found",
                    "suggestion", "Make login with Google: /api/auth/google/login-url"
            ));
        }
    }

    @PutMapping("/profile/complete")
    @Operation(summary = "Complete profile OAuth2", description = "Complete profile for an existing user")
    public ResponseEntity<?> completeOAuth2Profile(@RequestBody @Valid CompleteProfileRequestDTO request, HttpServletRequest httpRequest) {
        try {
            User updatedUser = customOAuth2UserService.completeOAuth2Profile(httpRequest, request);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "user", UserResponseDTO.fromEntity(updatedUser)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (TokenInvalidException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Unexpected error"));
        }
    }
}
