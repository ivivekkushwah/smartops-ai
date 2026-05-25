package com.smartops.monitor.websocket;

import com.smartops.monitor.model.LogDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketLogService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendLog(LogDocument log) {

        messagingTemplate.convertAndSend(
                "/topic/logs",
                log
        );
    }
}