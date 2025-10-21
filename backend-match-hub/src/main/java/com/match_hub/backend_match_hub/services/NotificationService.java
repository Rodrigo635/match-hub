package com.match_hub.backend_match_hub.services;

import com.match_hub.backend_match_hub.entities.Championship;
import com.match_hub.backend_match_hub.entities.Match;
import com.match_hub.backend_match_hub.entities.MatchTeam;
import com.match_hub.backend_match_hub.entities.Notification;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.entities.enums.NotificationType;
import com.match_hub.backend_match_hub.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private  NotificationRepository notificationRepository;


    public void createInitialNotification(User user, Match match) {
        LocalDateTime start = toMatchStartDateTime(match);
        Championship championship = getChampionship(match);
        List<String> teamNames = getTeamNames(match);
        String matchInfo = formatMatchInfo(teamNames);

        Notification notification = Notification.builder()
                .user(user)
                .matchId(match.getId())
                .teams(teamNames)
                .championshipName(championship.getName())
                .gameName(championship.getGame() != null ? championship.getGame().getName() : null)
                .tounamentName(championship.getGame() != null ? championship.getGame().getTournament(): null)
                .type(NotificationType.INITIAL)
                .message("Partida " + matchInfo + " do " + championship.getName() + " nos próximos dias!")
                .scheduledAt(start.minusDays(2))
                .build();

        notificationRepository.save(notification);
    }

    public void createReminderNotification(User user, Match match) {
        LocalDateTime start = toMatchStartDateTime(match);
        Championship championship = getChampionship(match);
        List<String> teamNames = getTeamNames(match);
        String matchInfo = formatMatchInfo(teamNames);

        Notification notification = Notification.builder()
                .user(user)
                .matchId(match.getId())
                .teams(teamNames)
                .championshipName(championship.getName())
                .gameName(championship.getGame() != null ? championship.getGame().getName() : null)
                .type(NotificationType.REMINDER)
                .message("Partida começando em 1 hora: " + matchInfo + " - " + championship.getName())
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

    private Championship getChampionship(Match match) {
        if (match.getChampionshipId() != null) {
            return match.getChampionshipId();
        }
        throw new IllegalArgumentException("Match must have a championship");
    }

    private List<String> getTeamNames(Match match) {
        if (match.getMatchTeams() == null || match.getMatchTeams().isEmpty()) {
            return List.of();
        }

        return match.getMatchTeams().stream()
                .map(MatchTeam::getTeam)
                .filter(Objects::nonNull)
                .map(team -> team.getName() != null ? team.getName() : "Time Desconhecido")
                .collect(Collectors.toList());
    }

    private String formatMatchInfo(List<String> teamNames) {
        if (teamNames.isEmpty()) {
            return "Time 1 vs Time 2";
        } else if (teamNames.size() == 1) {
            return teamNames.getFirst() + " vs Time 2";
        } else {
            return teamNames.stream().limit(2).collect(Collectors.joining(" vs "));
        }
    }
}