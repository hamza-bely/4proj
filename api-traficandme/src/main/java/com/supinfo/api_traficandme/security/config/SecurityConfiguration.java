package com.supinfo.api_traficandme.security.config;

import com.supinfo.api_traficandme.security.utlis.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthFilter jwtAuthFilter;

    /*
    @Bean
    @Order(1)
    SecurityFilterChain OAuth2SecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/").permitAll()
                                .requestMatchers("/login").permitAll()
                                .requestMatchers("/providerAuth/").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2Login(Customizer.withDefaults())
                .build();
    }
    */

    @Bean
    SecurityFilterChain ApisecurityFilterChain(HttpSecurity httpSecurity) throws Exception{

        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/api/auth/**").permitAll()
                                .requestMatchers("/v3/api-docs/**").permitAll()
                                .requestMatchers("/api-docs.yaml").permitAll()
                                .requestMatchers("/swagger-resources/**").permitAll()
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/webjars/**").permitAll()
                                .requestMatchers("/h2-console/**").permitAll()
                                .requestMatchers("/v3/api-docs/swagger-config").permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement( session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }


}
