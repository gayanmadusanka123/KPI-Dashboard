package com.ucsc.external_data_service.Connector;

import com.ucsc.external_data_service.Dto.ExternalDataIndicatorResponse;
import com.ucsc.external_data_service.Exception.ExternalDataException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class WorldBankConnector implements ExternalDataConnector{

    private final RestClient restClient;
    private final ObjectMapper objectMapper;


    @Override
    public String provider() {
        return "WORLD_BANK";
    }

    @Override
    public List<ExternalDataIndicatorResponse> getData(String indicatorCode, LocalDate startDate, LocalDate endDate) {
        try{
           String response = restClient
                   .get()
                   .uri(uriBuilder -> uriBuilder
                           .scheme("https")
                           .host("api.worldbank.org")
                           .path(
                                   "/v2/country/WLD/" +
                                           "indicator/{indicator}"
                           )
                           .queryParam(
                                   "date",
                                   startDate.getYear() + ":" +
                                           endDate.getYear()

                           )
                                   .queryParam("format","json")
                                   .queryParam("per_page",1000)
                                   .build(indicatorCode)
                           ).retrieve()
                   .body(String.class);

           return parseResponse(
                   response
                   ,indicatorCode,
                   startDate,endDate
           );
        }catch (Exception e){
            throw new ExternalDataException(
                    "World Bank request failes for indicator" +
                            indicatorCode,e
            );
        }
    }

    private List<ExternalDataIndicatorResponse> parseResponse(String response, String indicatorCode, LocalDate startDate, LocalDate endDate) throws  Exception {
        if(response == null || response.isBlank()){
            return List.of();
        }

        JsonNode root = objectMapper.readTree(response);

        if(!root.isArray() ||  root.size() < 2){
            return List.of();
        }

        JsonNode observations = root.get(1);

        if(!observations.isArray()){
            return List.of();
        }

        List<ExternalDataIndicatorResponse> responses = new ArrayList<>();

        for(JsonNode observation : observations){
            JsonNode valueNode = observation.get("value");

            JsonNode dateNode = observation.get("date");

            if(valueNode == null || dateNode == null || valueNode.isNull() || dateNode.isNull()){
                continue;
            }

            LocalDate observationDate = LocalDate.of(Integer.parseInt(dateNode.asText()),1,1);

            if(observationDate.isBefore(startDate) || observationDate.isAfter(endDate)){
                continue;
            }

            responses.add(
                    new ExternalDataIndicatorResponse(
                            provider(),
                            indicatorCode,
                            indicatorCode,
                            observationDate,
                            valueNode.asDouble(),
                            "percentage",
                            "World Bank"
                            )
            );
        }

        return responses;





    }
}
