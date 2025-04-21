package com.supinfo.api_traficandme.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CorsProperties {

    @Value("${cors.allowed-origins}")
    private String allowedOriginsRaw;

    public List<String> getAllowedOrigins() {
        return Arrays.asList(allowedOriginsRaw.split(","));
    }
}
