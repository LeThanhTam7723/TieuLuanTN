package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.SendEmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class SendMailController {
    @Autowired
    SendEmailService sendEmailService;
    @Autowired
    AuthService authService;
    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*()-_=+[]{}|;:',.<>?/";


    @PostMapping("/verifyRegister")
    ApiResponse<Void> verifyRegister(@RequestParam ("email") String email) throws ParseException, JOSEException, MessagingException {
        String token = authService.createVerifyToken(email);
        String subject = "Xác thực đăng ký";
        String result = "http://localhost:8080/api/auth/verifyAccount?token="+token;
       sendEmailService.sendMail(email,subject,result);
       return ApiResponse.<Void>builder().build();
    }
    public static String generatePassword(int length) {
        if (length < 4) throw new IllegalArgumentException("Độ dài tối thiểu là 4");

        SecureRandom random = new SecureRandom();
        List<Character> passwordChars = new ArrayList<>();

        // Đảm bảo có ít nhất 1 chữ thường, 1 số, 1 ký tự đặc biệt
        passwordChars.add(LOWERCASE.charAt(random.nextInt(LOWERCASE.length())));
        passwordChars.add(DIGITS.charAt(random.nextInt(DIGITS.length())));
        passwordChars.add(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        // Thêm các ký tự ngẫu nhiên còn lại (trừ ký tự đầu tiên)
        String allChars = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;
        for (int i = 0; i < length - 4; i++) {
            passwordChars.add(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Shuffle để trộn thứ tự, sau đó thêm chữ hoa ở đầu
        Collections.shuffle(passwordChars);
        StringBuilder password = new StringBuilder();
        password.append(UPPERCASE.charAt(random.nextInt(UPPERCASE.length()))); // bắt đầu bằng chữ hoa
        for (char c : passwordChars) {
            password.append(c);
        }

        return password.toString();
    }
    @PostMapping("/forgotPassword")
    ApiResponse<Void> forgotPassword(@RequestParam ("email") String email) throws ParseException, JOSEException, MessagingException {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String subject = "Gửi lại mật khẩu mới";
        String newPassword = generatePassword(8);
        String result=passwordEncoder.encode(newPassword);
        user.setPassword(result);
        userRepository.save(user);
        sendEmailService.sendMail(email,subject,newPassword);
        return ApiResponse.<Void>builder().build();
    }
}
