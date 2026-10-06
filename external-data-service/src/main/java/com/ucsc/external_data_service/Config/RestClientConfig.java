package com.ucsc.external_data_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient(RestClient.Builder builder) {

        return builder
                .defaultStatusHandler(
                        HttpStatusCode::isError,((request, response) -> {
                            throw new IllegalStateException(
                                    "External data service request failed with status code " +
                                            response.getStatusCode()
                            );
                        })
                )
                .build();
    }
}
