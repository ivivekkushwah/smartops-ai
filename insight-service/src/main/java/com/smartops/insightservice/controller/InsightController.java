package com.smartops.insightservice.controller;

import com.smartops.insightservice.model.Insight;
import com.smartops.insightservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.smartops.insightservice.service.InsightService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final InsightService insightService;
    private final GeminiService geminiService;

    @GetMapping("/gemini-test")
    public String geminiTest() {

        return geminiService.generateInsight("""
        You are a Site Reliability Engineer.

        Analyze this alert:

        Service: AUTH-SERVICE
        Severity: CRITICAL
        Title: Service Down
        Message: Authentication service is not responding.

        Return ONLY valid JSON.

        {
          "severity":"",
          "summary":"",
          "rootCause":"",
          "impact":"",
          "recommendation":"",
          "confidence":0
        }
        """);
    }

    @GetMapping("/test")
    public String test() {
        return "Insight Service Working";
    }

    @GetMapping
    public List<Insight> getAllInsights() {
        return insightService.getAllInsights();
    }

    @GetMapping("/{id}")
    public Insight getInsightById(@PathVariable String id) {
        return insightService.getInsightById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteInsight(@PathVariable String id) {
        insightService.deleteInsight(id);
        return "Insight deleted successfully";
    }

    @DeleteMapping
    public String deleteAllInsights() {
        insightService.deleteAllInsights();
        return "All insights deleted successfully";
    }

    @GetMapping("/count")
    public long getInsightCount() {
        return insightService.getInsightCount();
    }
}