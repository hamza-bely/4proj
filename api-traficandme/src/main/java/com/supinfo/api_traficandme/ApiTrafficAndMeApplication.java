package com.supinfo.api_traficandme;

import com.supinfo.api_traficandme.user.dto.UserRequest;
import com.supinfo.api_traficandme.user.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ApiTrafficAndMeApplication {



	@Bean
	@Profile("!test")
	public CommandLineRunner createDefaultUsers(UserService userService) {
		return args -> {

			//create admin
			if (userService.getOneUserByEmail("admin@traficandme.com") == null) {
				userService.createUser(new UserRequest(null,"Admin", "User", "admin@traficandme.com", "AdminPass123!", "ADMIN","ACTIVE"));
				System.out.println("Admin added.");
			}

			//create user
			if (userService.getOneUserByEmail("hamza.bely@traficandme.com") == null) {
				userService.createUser(new UserRequest(null,"Hamza", "Bely", "hamza.bely@traficandme.com", "UserPass123!", "USER","ACTIVE"));
				System.out.println("User added.");
			}

			//create moderator user
			if (userService.getOneUserByEmail("moderator.@traficandme.com") == null) {
				userService.createUser(new UserRequest(null,"Moderator", "User", "moderator.@traficandme.com", "ModeratorPass123!", "MODERATOR","ACTIVE"));
				System.out.println("User added.");
			}
		};
	}


	public static void main(String[] args) {
		SpringApplication.run(ApiTrafficAndMeApplication.class, args);
	}

}
