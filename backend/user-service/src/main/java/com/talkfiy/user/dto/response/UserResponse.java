package com.talkfiy.user.dto.response;

import com.talkfiy.user.model.User;
import com.talkfiy.user.model.UserStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String avatar;
    private String bio;
    private UserStatus status;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    
    public static UserResponse from(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .displayName(user.getDisplayName())
            .avatar(user.getAvatar())
            .bio(user.getBio())
            .status(user.getStatus())
            .isVerified(user.getIsVerified())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
