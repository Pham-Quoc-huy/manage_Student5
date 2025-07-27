package com.example.student_api.service;

import com.example.student_api.config.JwtTokenUtil;
import com.example.student_api.model.User;
import com.example.student_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Collections;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Sử dụng PasswordEncoder từ Spring Security

    @Autowired
    private JwtTokenUtil jwtTokenUtil;  // Inject JwtTokenUtil để tạo JWT token

    // Đăng ký người dùng
    public User register(User user) {
        // Kiểm tra email hợp lệ
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Email không hợp lệ!");
        }

        // Kiểm tra số điện thoại hợp lệ
        if (user.getPhone() == null || !user.getPhone().matches("^\\d{9,11}$")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ!");
        }

        // Kiểm tra tên người dùng
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên không được để trống!");
        }

        String password = user.getPassword();
        // Kiểm tra mật khẩu
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự!");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Mật khẩu phải chứa ít nhất 1 chữ in hoa!");
        }

        // Kiểm tra email đã tồn tại trong hệ thống
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại!");
        }

        // Mã hóa mật khẩu và lưu người dùng vào DB
        user.setPassword(passwordEncoder.encode(password));  // Mã hóa mật khẩu
        user.setProvider("local");  
        return userRepository.save(user);  
    }

    public String generateTokenForUser(User user) {
        return jwtTokenUtil.generateToken(user.getName());
    }

    // Đăng nhập người dùng
    public String login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Email không tồn tại!");
        }

        User user = userOpt.get();

        if (!"local".equals(user.getProvider())) {
            throw new IllegalArgumentException("Tài khoản này đăng nhập bằng Google/Facebook!");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu không đúng!");
        }

        String token = jwtTokenUtil.generateToken(user.getName());  

        return token; 
    }

    // Đăng nhập Google/Facebook (Social Login)
    public String loginSocial(String email, String provider, String providerId, String name, String avatarUrl) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Không lấy được email từ tài khoản Google/Facebook!");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setName(name != null ? name : "No Name");
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        }

        String token = jwtTokenUtil.generateToken(user.getEmail());
        return token;
    }

    // Verify Google ID Token và lấy thông tin user
    public GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("654694306838-is9r0g83dbced6571d253ekjbv57ac0i.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            } else {
                throw new RuntimeException("Invalid ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google token verify failed: " + e.getMessage());
        }
    }
}
