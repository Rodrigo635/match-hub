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

        // Salvando no banco de dados

        // Criando um objeto Championship
        Championship championship = new Championship();

        championship.setName("Campeonato Brasileiro Série A");
        championship.setImageChampionship("https://example.com/brasileirao-logo.png");
        Championship savedChampionship = championshipRepository.save(championship);


        // Criando um objeto Game
        Game game = new Game();
        game.setName("FIFA 24");
        game.setTournament("eFutebol Championship");
        game.setImage("https://example.com/fifa24-cover.jpg");
        game.setVideo("https://example.com/fifa24-trailer.mp4");
        game.setGif("https://example.com/fifa24-gameplay.gif");
        game.setDescription("O mais recente simulador de futebol da EA Sports com gráficos realistas e jogabilidade aprimorada.");
        game.setTags(Arrays.asList("Esporte", "Futebol", "Simulação", "Multiplayer"));
        game.setRelease(LocalDate.of(2023, 6, 29));
        game.setGenre("Esporte");
        game.setDeveloper("EA Sports");
        game.setPublisher("Electronic Arts");
        game.setAgeRating(12);
        game.setChampionship(savedChampionship);

        gameRepository.save(game);

        System.out.println("Game criado: " + game.getName());

        // Criando Teams (precisamos de pelo menos 2 times para uma partida)
        Team team1 = new Team();
        team1.setName("Flamengo");
        team1.setLogo("https://example.com/flamengo.png");
        Team savedTeam1 = teamRepository.save(team1);

        Team team2 = new Team();
        team2.setName("Palmeiras");
        team2.setLogo("https://example.com/palmeiras.png");
        Team savedTeam2 = teamRepository.save(team2);

        // Criando Match
        Match match = new Match();
        match.setChampionshipId(savedChampionship);
        match.setHour(LocalTime.of(20, 0));
        match.setDate(LocalDate.now());
        match.setLink("https://twitch.tv/matchhub");

        // Salvando a partida primeiro para gerar o ID
        Match savedMatch = matchRepository.save(match);

        // Criando as relações MatchTeam
        MatchTeam matchTeam1 = new MatchTeam(savedTeam1,savedMatch);


        MatchTeam matchTeam2 = new MatchTeam(savedTeam2,savedMatch);

        // Salvando as relações
        matchTeamRepository.save(matchTeam1);
        matchTeamRepository.save(matchTeam2);

        // Adicionando as relações à partida
        match.getMatchTeams().addAll(Arrays.asList(matchTeam1, matchTeam2));
        matchRepository.save(match); // Atualizando a partida com as relações

        System.out.println("Match criado: " + savedMatch.getId() + " entre " +
                savedTeam1.getName() + " e " + savedTeam2.getName());

    }
}
