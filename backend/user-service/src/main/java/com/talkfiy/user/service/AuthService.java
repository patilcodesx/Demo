package com.talkfiy.user.service;

import com.talkfiy.user.dto.request.LoginRequest;
import com.talkfiy.user.dto.request.RegisterRequest;
import com.talkfiy.user.dto.response.AuthResponse;
import com.talkfiy.user.dto.response.UserResponse;
import com.talkfiy.user.model.User;
import com.talkfiy.user.model.UserStatus;
import com.talkfiy.user.repository.UserRepository;
import com.talkfiy.user.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName() != null ? 
            request.getDisplayName() : request.getUsername());
        user.setStatus(UserStatus.ONLINE);
        user.setIsActive(true);
        user.setIsVerified(false);
        
        User savedUser = userRepository.save(user);
        
        String accessToken = jwtUtil.generateAccessToken(savedUser.getId(), savedUser.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getId());
        
        return AuthResponse.of(accessToken, refreshToken, UserResponse.from(savedUser));
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getIdentifier(), request.getIdentifier())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }
        
        user.setStatus(UserStatus.ONLINE);
        userRepository.save(user);
        
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        
        return AuthResponse.of(accessToken, refreshToken, UserResponse.from(user));
    }
}
