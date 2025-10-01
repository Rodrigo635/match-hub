package com.match_hub.backend_match_hub.repositories;

import com.match_hub.backend_match_hub.entities.Notification;
import com.match_hub.backend_match_hub.entities.User;
import com.match_hub.backend_match_hub.entities.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndReadFalse(User user);
    @Query("""
        SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END
        FROM Notification n
        WHERE n.user = :user
          AND n.matchId = :matchId
          AND n.type = :type
    """)
    boolean existsByUserAndMatchIdAndType(
            @Param("user") User user,
            @Param("matchId") Long matchId,
            @Param("type") NotificationType type
    );
}
