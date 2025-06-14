package com.match_hub.backend_match_hub.dtos;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import java.io.Serializable;


public record UserCredentialDTO (
    String email,
    String password
) {

}
