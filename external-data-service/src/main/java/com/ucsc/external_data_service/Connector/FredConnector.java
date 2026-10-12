package com.ucsc.external_data_service.Connector;

import com.ucsc.external_data_service.Dto.ExternalDataIndicatorResponse;
import com.ucsc.external_data_service.Exception.ExternalDataException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component

public class FredConnector implements ExternalDataConnector {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final String apiKey;

    public FredConnector(
            RestClient restClient,
            ObjectMapper objectMapper,
            @Value("${external-data-service.fred.api-key:}")
            String apiKey) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
    }


    @Override
    public String provider() {
        return "FRED";
    }

    @Override
    public List<ExternalDataIndicatorResponse> getData(String indicatorCode, LocalDate startDate, LocalDate endDate) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new ExternalDataException(
                    "FRED API key is not configured"
            );

        }

        try {
            String response = restClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("api.stlouisfed.org")
                            .path("/fred/series/observations")
                            .queryParam(
                                    "series_id",
                                    indicatorCode
                            )
                            .queryParam("api_key", apiKey)
                            .queryParam("file_type", "json")
                            .queryParam(
                                    "observation_start",
                                    startDate
                            )
                            .queryParam(
                                    "observation_end",
                                    endDate
                            )
                            .build()
                    )
                    .retrieve()
                    .body(String.class);

            return parseResponse(
                    response,
                    indicatorCode
            );
        } catch (Exception e) {

            throw new ExternalDataException(
                    "FRED request failed for series " +
                            indicatorCode, e
            );
        }
    }

    private List<ExternalDataIndicatorResponse> parseResponse(String response, String indicatorCode) throws Exception {
        if (response == null || response.isBlank()) {
            return List.of();
        }

        JsonNode root = objectMapper.readTree(response);
        JsonNode observations = root.get("observations");

        if (!observations.isArray()) {
            return List.of();
        }

        List<ExternalDataIndicatorResponse> responses = new ArrayList<>();

        for (JsonNode observation : observations) {
            String dateText =
                    observation.path("date").asText();

            String valueText =
                    observation.path("value").asText();

            if (dateText.isBlank()
                    || valueText.isBlank()
                    || ".".equals(valueText)) {
                continue;
            }

            responses.add(
                    new ExternalDataIndicatorResponse(
                            provider(),
                            indicatorCode,
                            indicatorCode,
                            LocalDate.parse(dateText),
                            Double.parseDouble(valueText),
                            null,
                            "FRED"
                    )
            );
        }

        return responses;
    }
}
