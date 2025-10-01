package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import com.match_hub.backend_match_hub.entities.Notification;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.entities.enums.NotificationType;
import com.match_hub.backend_match_hub.repositories.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createInitialNotification(User user, Match match) {
        LocalDateTime start = toMatchStartDateTime(match);
        String championshipName = safeChampionshipName(match);
        List<String> teamNames = getTeamNames(match);

        String team1 = !teamNames.isEmpty() ? teamNames.get(0) : "Time 1";
        String team2 = teamNames.size() > 1 ? teamNames.get(1) : "Time 2";
        String matchInfo = team1 + " vs " + team2;

        Notification notification = Notification.builder()
                .user(user)
                .matchId(match.getId())
                .team1Name(team1)
                .team2Name(team2)
                .championshipName(championshipName)
                .type(NotificationType.INITIAL)
                .message("Partida " + matchInfo + " do " + championshipName + " nos próximos dias!")
                .scheduledAt(start.minusDays(2))
                .build();

        notificationRepository.save(notification);
    }

    public void createReminderNotification(User user, Match match) {
        LocalDateTime start = toMatchStartDateTime(match);
        String championshipName = safeChampionshipName(match);
        List<String> teamNames = getTeamNames(match);

        String team1 = !teamNames.isEmpty() ? teamNames.get(0) : "Time 1";
        String team2 = teamNames.size() > 1 ? teamNames.get(1) : "Time 2";
        String matchInfo = team1 + " vs " + team2;

        Notification notification = Notification.builder()
                .user(user)
                .matchId(match.getId())
                .team1Name(team1)
                .team2Name(team2)
                .championshipName(championshipName)
                .type(NotificationType.REMINDER)
                .message("Partida começando em 1 hora: " + matchInfo + " - " + championshipName)
                .scheduledAt(start.minusHours(1))
                .build();

        notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndReadFalse(user);
    }

    private LocalDateTime toMatchStartDateTime(Match match) {
        if (match.getDate() == null || match.getHour() == null) {
            throw new IllegalArgumentException("Match must have date and hour set to compute start time");
        }
        return LocalDateTime.of(match.getDate(), match.getHour());
    }

    private String safeChampionshipName(Match match) {
        if (match.getChampionshipId() != null && match.getChampionshipId().getName() != null) {
            return match.getChampionshipId().getName();
        } else {
            return "campeonato";
        }
    }

    private List<String> getTeamNames(Match match) {
        if (match.getMatchTeams() == null || match.getMatchTeams().isEmpty()) {
            return List.of();
        }

        return match.getMatchTeams().stream()
                .map(MatchTeam::getTeam)
                .filter(team -> team != null)
                .map(team -> team.getName() != null ? team.getName() : "Time Desconhecido")
                .collect(Collectors.toList());
    }
}