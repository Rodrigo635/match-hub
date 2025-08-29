package com.match_hub.backend_match_hub.infra.config;

import com.match_hub.backend_match_hub.entities.*;
import com.match_hub.backend_match_hub.enums.UserRole;
import com.match_hub.backend_match_hub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@Configuration
@Profile({"dev","dev1"})
public class Mocks implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChampionshipRepository championshipRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MatchTeamRepository matchTeamRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private GameRepository gameRepository;

    @Override
    public void run(String... args) throws Exception {



        User user = new User();
        user.setName("admin");
        user.setEmail("admin@admin.com");
        user.setPassword(new BCryptPasswordEncoder().encode("admin"));
        user.setRole(UserRole.ADMIN);
        user.setHasPassword(true);
        user.setBirthDate(LocalDate.of(2000, 1, 1));
        userRepository.save(user);

        User user2 = new User();
        user2.setName("user");
        user2.setEmail("user@user.com");
        user2.setPassword(new BCryptPasswordEncoder().encode("user"));
        user2.setRole(UserRole.USER);
        user2.setHasPassword(true);
        user2.setBirthDate(LocalDate.of(2000, 1, 1));
        userRepository.save(user2);





    }
}
