package com.smartops.monitor.kafka;

import com.smartops.common.event.UserEvent;
import com.smartops.monitor.repository.ServiceStatusRepository;
import com.smartops.monitor.service.LogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventConsumer {

    private final ServiceStatusRepository repository;
    private final LogService logService;

    @KafkaListener(
            topics = "user-events",
            groupId = "monitoring-user-group"
    )
    public void consume(UserEvent event) {

        if ("USER_DELETED".equals(event.getEventType())) {

            String userId = event.getUserId();

            log.info(
                    "User deleted: {}. Removing monitored services.",
                    userId
            );

            repository.deleteByUserId(userId);
            logService.deleteLogsByUserId(userId);

            log.info(
                    "Monitoring services removed for user: {}",
                    userId
            );
        }
    }
}
