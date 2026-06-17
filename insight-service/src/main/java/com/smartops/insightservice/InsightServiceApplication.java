package com.smartops.insightservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class InsightServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsightServiceApplication.class, args);
    }

}
