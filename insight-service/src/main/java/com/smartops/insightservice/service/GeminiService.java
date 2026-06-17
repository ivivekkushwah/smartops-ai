package com.smartops.insightservice.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostConstruct
    public void test() {
        System.out.println("Key loaded: " + (apiKey != null));
    }

    public String generateInsight(String prompt) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                        + apiKey;

        String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": "%s"
                        }
                      ]
                    }
                  ]
                }
                """.formatted(
                prompt
                        .replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n")
        );

        try {
            return webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        }
        catch (Exception e) {
            return """
    {
      "severity":"INFO",
      "summary":"AI service unavailable",
      "rootCause":"Gemini quota exceeded",
      "impact":"AI analysis temporarily unavailable",
      "recommendation":"Retry later",
      "confidence":0
    }
    """;
        }
    }
}