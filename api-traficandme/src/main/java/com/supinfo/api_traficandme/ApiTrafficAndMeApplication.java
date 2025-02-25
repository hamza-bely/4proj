package com.supinfo.api_traficandme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ApiTrafficAndMeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiTrafficAndMeApplication.class, args);
	}

}
