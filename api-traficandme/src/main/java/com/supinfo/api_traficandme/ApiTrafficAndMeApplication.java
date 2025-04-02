package com.supinfo.api_traficandme;

import com.supinfo.api_traficandme.User.dto.UserRequest;
import com.supinfo.api_traficandme.User.service.UserService;
import com.supinfo.api_traficandme.common.Role;
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
			if (userService.getOneUserByEmail("admin@example.com") == null) {
				userService.createUser(new UserRequest(null,"Admin", "User", "admin@example.com", "AdminPass123!", "ADMIN"));
				System.out.println("Admin ajouté.");
			}

			if (userService.getOneUserByEmail("john.doe@example.com") == null) {
				userService.createUser(new UserRequest(null,"John", "Doe", "john.doe@example.com", "UserPass123!", "USER"));
				System.out.println("Utilisateur ajouté.");
			}
		};
	}


	public static void main(String[] args) {
		SpringApplication.run(ApiTrafficAndMeApplication.class, args);
	}

}
