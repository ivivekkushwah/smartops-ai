package com.smartops.monitor.kafka;

import com.smartops.common.event.LogEvent;
import com.smartops.monitor.model.LogDocument;
import com.smartops.monitor.service.LogService;
import com.smartops.monitor.websocket.WebSocketLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final LogService logService;

    private final WebSocketLogService webSocketLogService;

    @KafkaListener(
            topics = "smartops-logs",
            groupId = "monitor-group"
    )
    public void consume(LogEvent event) {

        // Console Output
        System.out.println("================================");
        System.out.println("SERVICE : " + event.getServiceName());
        System.out.println("LEVEL   : " + event.getLevel());
        System.out.println("MESSAGE : " + event.getMessage());
        System.out.println("TIME    : " + event.getTimestamp());
        System.out.println("================================");

        // Save into MongoDB
        LogDocument savedLog = logService.saveLog(event);

        // Send live log via WebSocket
        webSocketLogService.sendLog(savedLog);

        log.info("Log saved and broadcasted successfully");
    }
}