package com.talkfiy.user.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserResponse user;
    
    public static AuthResponse of(String access, String refresh, UserResponse user) {
        return AuthResponse.builder()
            .accessToken(access)
            .refreshToken(refresh)
            .tokenType("Bearer")
            .user(user)
            .build();
    }
}
