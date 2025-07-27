package com.example.student_api.controller;

import com.example.student_api.model.User;
import com.example.student_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Đăng ký truyền thống
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.register(user);
            String token = userService.generateTokenForUser(registeredUser);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Đăng nhập truyền thống
    @PostMapping("/login") 
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");
            String token = userService.login(email, password); 
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Đăng nhập Google/Facebook (social login)
    @PostMapping("/login/social")
    public ResponseEntity<?> loginSocial(@RequestBody Map<String, String> body) {
        try {
            String provider = body.get("provider"); // "google" hoặc "facebook"
            
            if ("google".equals(provider)) {
                // Xử lý Google Login
                String idToken = body.get("idToken");
                if (idToken == null || idToken.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Google ID token không được cung cấp!"));
                }
                
                // Verify Google ID token và lấy thông tin user
                GoogleIdToken.Payload payload = userService.verifyGoogleToken(idToken);
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String avatarUrl = (String) payload.get("picture");
                String providerId = payload.getSubject();
                
                // Gọi service để tạo hoặc lấy user và sinh token
                String token = userService.loginSocial(email, provider, providerId, name, avatarUrl);
                return ResponseEntity.ok(Map.of("token", token));
                
            } else if ("facebook".equals(provider)) {
                // Xử lý Facebook Login (cần implement thêm)
                String accessToken = body.get("accessToken");
                String userID = body.get("userID");
                String email = body.get("email");
                String name = body.get("name");
                String avatarUrl = body.get("avatarUrl");
                
                if (email == null || email.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Không lấy được email từ Facebook!"));
                }
                
                String token = userService.loginSocial(email, provider, userID, name, avatarUrl);
                return ResponseEntity.ok(Map.of("token", token));
                
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Provider không được hỗ trợ!"));
            }
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 