package com.smartops.alert.controller;

import com.smartops.alert.model.Insight;
import com.smartops.alert.service.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final InsightService insightService;

    @GetMapping
    public List<Insight> getInsights(@RequestHeader("X-User-Id") String userId) {
        return insightService.getInsights(userId);
    }
}
