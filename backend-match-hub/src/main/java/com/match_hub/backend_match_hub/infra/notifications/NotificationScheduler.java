package com.match_hub.backend_match_hub.infra.notifications;

import com.match_hub.backend_match_hub.entities.*;
import com.match_hub.backend_match_hub.entities.enums.NotificationType;
import com.match_hub.backend_match_hub.repositories.MatchRepository;
import com.match_hub.backend_match_hub.repositories.NotificationRepository;
import com.match_hub.backend_match_hub.repositories.UserRepository;
import com.match_hub.backend_match_hub.services.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Executa a cada 1 hora para verificar e criar notificações
     */
    @Scheduled(cron = "0 0 * * * *") // A cada hora no minuto 00
    //@Scheduled(fixedRate = 10000)
    @Transactional
    public void scheduleNotifications() {
        LocalDate today = LocalDate.now();
        LocalDate inSevenDays = today.plusDays(7);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = LocalDateTime.of(today, LocalTime.MIN); // 00:00 de hoje

        log.info("=== NotificationScheduler started at {} (reference: {}) ===", now, startOfDay);

        // Busca partidas dos próximos 7 dias
        List<Match> upcomingMatches = matchRepository.findByDateBetween(today, inSevenDays);
        log.info("Found {} upcoming matches between {} and {}", upcomingMatches.size(), today, inSevenDays);

        // Percorre todos os usuários
        List<User> users = userRepository.findAll();
        log.info("Found {} users to check for notifications", users.size());

        for (User user : users) {
            log.debug("Processing user: {} ({})", user.getName(), user.getId());

            for (Match match : upcomingMatches) {
                processMatchNotifications(user, match, startOfDay, now);
            }
        }

        log.info("=== NotificationScheduler finished ===");
    }

    private void processMatchNotifications(User user, Match match, LocalDateTime startOfDay, LocalDateTime now) {
        log.debug("Checking match {} for user {}", match.getId(), user.getId());

        // Verifica se o usuário tem algum favorito relacionado à partida
        if (!userHasFavoriteInMatch(user, match)) {
            log.debug("User {} has no favorites for match {}", user.getId(), match.getId());
            return;
        }

        LocalDateTime matchStart = LocalDateTime.of(match.getDate(), match.getHour());

        // Notificação Inicial: dentro de 7 dias antes do evento
        createInitialNotificationIfNeeded(user, match, matchStart, startOfDay);

        // Notificação de Lembrete: 1 hora antes
        createReminderNotificationIfNeeded(user, match, matchStart, now);
    }

    private boolean userHasFavoriteInMatch(User user, Match match) {
        // Verifica campeonato favorito
        Championship championship = match.getChampionshipId();
        if (championship != null && user.getFavoriteChampionships().contains(championship)) {
            log.debug("User {} favorited championship {}", user.getId(), championship.getId());
            return true;
        }

        // Verifica jogo favorito
        Game game = (championship != null) ? championship.getGame() : null;
        if (game != null && user.getFavoriteGames().contains(game)) {
            log.debug("User {} favorited game {}", user.getId(), game.getId());
            return true;
        }

        // Verifica times favoritos
        for (MatchTeam mt : match.getMatchTeams()) {
            Team team = mt.getTeam();
            if (team != null && user.getFavoriteTeams().contains(team)) {
                log.debug("User {} favorited team {}", user.getId(), team.getId());
                return true;
            }
        }

        return false;
    }

    private void createInitialNotificationIfNeeded(User user, Match match, LocalDateTime matchStart, LocalDateTime startOfDay) {
        LocalDateTime sevenDaysBeforeMatch = matchStart.minusDays(7);

        // Cria a notificação se:
        // 1. Estamos dentro da janela de 7 dias antes do evento
        // 2. A notificação ainda não existe
        // 3. A partida ainda não começou
        if (startOfDay.isAfter(sevenDaysBeforeMatch.minusDays(1)) &&
                startOfDay.isBefore(matchStart) &&
                !notificationRepository.existsByUserAndMatchIdAndType(user, match.getId(), NotificationType.INITIAL)) {

            log.info("Creating INITIAL notification for user {} for match {} (match at: {}, notification window: 7 days before)",
                    user.getId(), match.getId(), matchStart);
            notificationService.createInitialNotification(user, match);
        } else if (startOfDay.isBefore(sevenDaysBeforeMatch)) {
            log.debug("Waiting to create INITIAL notification for match {} - still more than 7 days away (match at: {})",
                    match.getId(), matchStart);
        }
    }

    private void createReminderNotificationIfNeeded(User user, Match match, LocalDateTime matchStart, LocalDateTime now) {
        LocalDateTime oneHourBeforeMatch = matchStart.minusHours(1);

        // Cria a notificação se:
        // 1. Estamos dentro da janela de 1 hora antes até o início da partida
        // 2. A notificação ainda não existe
        // 3. A partida ainda não começou
        if (now.isAfter(oneHourBeforeMatch) &&
                now.isBefore(matchStart) &&
                !notificationRepository.existsByUserAndMatchIdAndType(user, match.getId(), NotificationType.REMINDER)) {

            log.info("Creating REMINDER notification for user {} for match {} (match starts at: {})",
                    user.getId(), match.getId(), matchStart);
            notificationService.createReminderNotification(user, match);
        } else if (now.isBefore(oneHourBeforeMatch)) {
            log.debug("Waiting to create REMINDER notification for match {} - more than 1 hour away (match at: {})",
                    match.getId(), matchStart);
        }
    }
}