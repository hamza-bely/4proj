package com.supinfo.api_traficandme;

import com.supinfo.api_traficandme.User.dto.UserRequest;
import com.supinfo.api_traficandme.User.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ApiTrafficAndMeApplication {



	@Bean
	public CommandLineRunner createDefaultUsers(UserService userService) {
		return args -> {
			if (userService.getOneUserByEmail("admin@traficandme.com") == null) {
				userService.createUser(new UserRequest(null,"Admin", "User", "admin@traficandme.com", "AdminPass123!", "ADMIN","ACTIVE"));
				System.out.println("Admin added.");
			}

			if (userService.getOneUserByEmail("hamza.bely@traficandme.com") == null) {
				userService.createUser(new UserRequest(null,"Hamza", "Bely", "hamza.bely@traficandme.com", "UserPass123!", "USER","ACTIVE"));
				System.out.println("User added.");
			}
		};
	}


	public static void main(String[] args) {
		SpringApplication.run(ApiTrafficAndMeApplication.class, args);
	}

}
