package com.match_hub.backend_match_hub.infra.GoogleAuth;

import java.util.Map;

public class GoogleOAuth2UserInfo {
    private Map<String, Object> attributes;

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public String getId() { return (String) attributes.get("id"); }

    public String getName() {
        return (String) attributes.get("name");
    }

    public String getEmail() {
        return (String) attributes.get("email");
    }

    public String getImageUrl() {
        return (String) attributes.get("picture");
    }

    public Boolean getEmailVerified() {
        return (Boolean) attributes.get("email_verified");
    }
}