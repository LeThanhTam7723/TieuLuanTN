package com.example.back_end.config;

import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MeilisearchConfig {

    @Bean
    public Client meilisearchClient() {
        Config config = new Config("http://127.0.0.1:7700", "masterKey123");
        return new Client(config);
    }
}
