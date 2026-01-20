package com.usosmatch.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI usosMatchConfig(){
        return new OpenAPI().info(new Info()
                .title("UsosMatch API Dokumentacja")
                .description("Backend aplikacji randkowej dla studentów")
                .version("v1.0"));
    }
}
