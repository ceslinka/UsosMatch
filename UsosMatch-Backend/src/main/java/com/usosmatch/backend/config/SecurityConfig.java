package com.usosmatch.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Wyłącz CSRF, bo mamy React
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // WAŻNE DLA H2 CONSOLE!
                .authorizeHttpRequests(auth -> auth
                        // Lista adresów, które są publicznie dostępne bez logowania
                        .requestMatchers("/h2-console/**").permitAll() // POZWÓL na dostęp do konsoli
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger też
                        .anyRequest().permitAll() // Reszta też jest otwarta (na razie)
                );

        return http.build();
    }


}
