package com.match_hub.backend_match_hub.infra.security;
import com.match_hub.backend_match_hub.services.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
@EnableWebSecurity
public class Security {
    @Bean
    public Filter securityFilter() {
        return new Filter(exceptionResolver);
    }

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver exceptionResolver;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .headers().frameOptions().sameOrigin()
                .and()
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/users/details").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/favorites").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/favorites/all").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/users/favorites").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ADMIN")
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Endpoints de autenticação
                        .requestMatchers("/login/**", "/oauth2/**").permitAll() // OAuth2 endpoints

                        .requestMatchers(HttpMethod.DELETE,"/api/teams/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/teams/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/teams/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.DELETE,"/api/games/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/games/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/games/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.DELETE,"/api/matches/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/matches/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/matches/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.DELETE,"/api/championships/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/championships/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,"/api/championships/**").hasAuthority("ADMIN")

                        .requestMatchers(HttpMethod.POST,"/api/avatars/**").hasAuthority("ADMIN")

                        .requestMatchers("/v3/api-docs/**","/swagger-ui.html", "/swagger-ui/**").permitAll()
                        .anyRequest().permitAll()
                )
                // Configuração OAuth2
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oauth2AuthenticationSuccessHandler)
                )
                .addFilterBefore(securityFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
