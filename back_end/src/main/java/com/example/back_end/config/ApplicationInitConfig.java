package com.example.back_end.config;

import com.example.back_end.constant.PredefinedPayment;
import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.entity.PaymentMethod;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.repository.DiscountRepository;
import com.example.back_end.repository.PaymentRepository;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "Tam123456@";

    @NonFinal
    static final String TEST_USER_NAME = "testuser";

    @NonFinal
    static final String TEST_USER_PASSWORD = "Test123456@";

    @NonFinal
    static final String MANAGER_USER_NAME = "manager";

    @NonFinal
    static final String MANAGER_PASSWORD = "Manager123456@";

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PaymentRepository paymentRepository, DiscountRepository discountRepository) {
        log.info("Initializing application.....");
        return args -> {
            if (!paymentRepository.existsPaymentMethodByTypePayment(PredefinedPayment.COD)) {
                paymentRepository.save(PaymentMethod.builder()
                        .typePayment(PredefinedPayment.COD)
                        .build());
            }

            if (!paymentRepository.existsPaymentMethodByTypePayment(PredefinedPayment.VN_PAY)) {
                paymentRepository.save(PaymentMethod.builder()
                        .typePayment(PredefinedPayment.VN_PAY)
                        .build());
            }

            // Tạo role USER nếu chưa tồn tại
            Role userRole = roleRepository.findByName(PredefinedRole.USER_ROLE)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                            .build()));

            // Tạo role ADMIN nếu chưa tồn tại
            Role adminRole = roleRepository.findByName(PredefinedRole.ADMIN_ROLE)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                            .build()));

            // Tạo role MANAGER nếu chưa tồn tại
            Role managerRole = roleRepository.findByName(PredefinedRole.MANAGER_ROLE)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(PredefinedRole.MANAGER_ROLE)
                            .description("Manager role")
                            .build()));

            // Tạo tài khoản admin nếu chưa tồn tại
            if (!userRepository.existsByUsername(ADMIN_USER_NAME)) {
                var adminRoles = new HashSet<Role>();
                adminRoles.add(adminRole);
                adminRoles.add(managerRole);

                User admin = User.builder()
                        .username(ADMIN_USER_NAME)
                        .email("tamle7723@gmail.com")
                        .fullname(ADMIN_USER_NAME)
                        .phone("0911281672")
                        .active(true)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(adminRoles)
                        .build();

                userRepository.save(admin);
                log.warn("Admin user has been created with default password: {}, please change it", ADMIN_PASSWORD);
            }

            // Tạo tài khoản test user nếu chưa tồn tại
            if (!userRepository.existsByUsername(TEST_USER_NAME)) {
                var userRoles = new HashSet<Role>();
                userRoles.add(userRole);

                User testUser = User.builder()
                        .username(TEST_USER_NAME)
                        .email("testuser@example.com")
                        .fullname("Test User")
                        .phone("0123456789")
                        .active(true)
                        .password(passwordEncoder.encode(TEST_USER_PASSWORD))
                        .roles(userRoles)
                        .build();

                userRepository.save(testUser);
                log.warn("Test user has been created with default password: {}, please change it", TEST_USER_PASSWORD);
            }

            // Tạo tài khoản manager nếu chưa tồn tại
            if (!userRepository.existsByUsername(MANAGER_USER_NAME)) {
                var managerRoles = new HashSet<Role>();
                managerRoles.add(managerRole);

                User manager = User.builder()
                        .username(MANAGER_USER_NAME)
                        .email("manager@example.com")
                        .fullname("Store Manager")
                        .phone("0987654321")
                        .active(true)
                        .password(passwordEncoder.encode(MANAGER_PASSWORD))
                        .roles(managerRoles)
                        .build();

                userRepository.save(manager);
                log.warn("Manager user has been created with default password: {}, please change it", MANAGER_PASSWORD);
            }

            log.info("Application initialization completed .....");
        };
    }
}
