package com.match_hub.backend_match_hub.infra.GoogleAuth;

import com.match_hub.backend_match_hub.entities.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User, OidcUser {
    private final OAuth2User oauth2User;
    @Getter
    private final User user;
    private final OidcUser oidcUser;

    // Construtor principal que você está usando
    public CustomOAuth2User(Map<String, Object> attributes, User user) {
        this.oauth2User = new org.springframework.security.oauth2.core.user.DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                "email"
        );
        this.user = user;
        this.oidcUser = null; // Não temos OidcUser neste caso
    }

    // Construtor adicional para compatibilidade com OidcUser
    public CustomOAuth2User(OidcUser oidcUser, User user) {
        this.oidcUser = oidcUser;
        this.oauth2User = oidcUser;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2User.getName();
    }

    // Implementação dos métodos OidcUser
    @Override
    public Map<String, Object> getClaims() {
        return oidcUser != null ? oidcUser.getClaims() : getAttributes();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return oidcUser != null ? oidcUser.getUserInfo() : null;
    }

    @Override
    public OidcIdToken getIdToken() {
        return oidcUser != null ? oidcUser.getIdToken() : null;
    }

    // Métodos de conveniência
    public String getEmail() {
        return (String) getAttributes().get("email");
    }

    public String getFullName() {
        return (String) getAttributes().get("name");
    }

    public String getPicture() {
        return (String) getAttributes().get("picture");
    }
}