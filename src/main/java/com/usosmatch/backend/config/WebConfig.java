package com.usosmatch.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // To klasa konfiguracyjna, Spring uruchomi ją przy starcie
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Pozwól na dostęp do WSZYSTKICH endpointów (/api/...)
                .allowedOrigins("http://localhost:3000") // ...tylko dla aplikacji z tego adresu (React)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Pozwól na te metody
                .allowedHeaders("*") // Pozwól na wszystkie nagłówki
                .allowCredentials(true); // Pozwól na przesyłanie ciasteczek/autoryzacji
    }
}