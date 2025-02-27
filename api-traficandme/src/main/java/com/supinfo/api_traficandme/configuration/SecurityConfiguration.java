package com.supinfo.api_traficandme.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    @Order( 1 )
    SecurityFilterChain OAuth2SecurityFilterChain(HttpSecurity httpSecurity) throws Exception{

       return httpSecurity
               .cors(Customizer.withDefaults())
               .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/").permitAll()
                                /*.requestMatchers("/login").permitAll()
                                .requestMatchers("/providerAuth/").permitAll()*/
                                .anyRequest().authenticated())
               .oauth2Login(Customizer.withDefaults())
               .build();
    }

    @Bean
    @Order( 1 )
    SecurityFilterChain ApisecurityFilterChain(HttpSecurity httpSecurity) throws Exception{

       return httpSecurity
               .cors(Customizer.withDefaults())
               .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/").permitAll()
                                .requestMatchers("api/v1/login","api/v1/register").permitAll()
                                .anyRequest().authenticated())
               .build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
