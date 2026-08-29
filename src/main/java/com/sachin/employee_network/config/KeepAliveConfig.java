package com.sachin.employee_network.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableScheduling
public class KeepAliveConfig {

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedDelay = 840000)
    public void keepAlive() {
        try {
            restTemplate.getForObject(
                    "https://employee-skill-network.onrender.com/api/employees",
                    String.class);
            System.out.println("✅ Keep alive ping sent!");
        } catch (Exception e) {
            System.out.println("Keep alive failed: " + e.getMessage());
        }
    }
}