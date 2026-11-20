
package com.ucsc.kpi_dashboard.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class PerformanceCalculationClient {

    private final String mlServiceUrl;
    private final HttpClient httpClient;

    public PerformanceCalculationClient(
            @Value("${ml.service.base-url}") String mlServiceUrl
    ) {
        this.mlServiceUrl = mlServiceUrl;
        this.httpClient = HttpClient.newHttpClient();
    }

    public void triggerCalculation(UUID kpiId) {

        String requestBody =
                "{\"kpiId\":\"" + kpiId + "\"}";

        System.out.println("Sending JSON: " + requestBody);

        byte[] requestBytes = requestBody.getBytes(StandardCharsets.UTF_8);

        System.out.println("Request bytes: " + requestBytes.length);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(mlServiceUrl + "/api/performance/calculate"))
                .version(HttpClient.Version.HTTP_1_1)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofByteArray(requestBytes))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            System.out.println("FastAPI status: " + response.statusCode());
            System.out.println("FastAPI response: " + response.body());

            if (response.statusCode() != 202) {
                throw new IllegalStateException(
                        "Performance calculation request failed: "
                                + response.body()
                );
            }

        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not communicate with ML service", e
            );
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(
                    "ML service request was interrupted", e
            );
        }
    }
}
