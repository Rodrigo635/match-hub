package com.match_hub.backend_match_hub.controllers;


import com.match_hub.backend_match_hub.dtos.UserCredentialDTO;
import com.match_hub.backend_match_hub.dtos.UserDTO;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.infra.security.Filter;
import com.match_hub.backend_match_hub.infra.security.TokenService;
import com.match_hub.backend_match_hub.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/users/")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private Filter filter;

    @PostMapping("login")
    public ResponseEntity<String> userCredentials(@Valid @RequestBody UserCredentialDTO userDTO){
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());
        Authentication auth = authenticationManager.authenticate(token);

        return  ResponseEntity.ok(tokenService.generateToken((User) auth.getPrincipal()));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO) {
        UserDTO registeredUser = userService.registerUser(userDTO);
        URI address = URI.create("/api/users/" + registeredUser.email());
        return ResponseEntity.created(address).body(registeredUser);
    }

    @GetMapping("/details")
    public ResponseEntity<UserDTO> getUser(HttpServletRequest request) {
        String token = tokenService.getToken(request);
        String email = tokenService.getSubject(token);
        UserDTO user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }



}
