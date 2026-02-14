package com.talkfiy.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
        System.out.println("\n✅ TalkFiy User Service Started Successfully!");
        System.out.println("📍 http://localhost:8081");
        System.out.println("🔍 Health: http://localhost:8081/api/auth/health\n");
    }
}
