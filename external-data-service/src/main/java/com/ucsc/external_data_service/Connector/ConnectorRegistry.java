package com.ucsc.external_data_service.Connector;

import com.ucsc.external_data_service.Entity.ExternalIndicators;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ConnectorRegistry {

    private final Map<String,ExternalDataConnector> connectors;

    public ConnectorRegistry(
            List<ExternalDataConnector> connectorList

    ){
        this.connectors = connectorList.stream()
                .collect(Collectors.toUnmodifiableMap(
                        connector -> normalize(
                                connector.provider()
                        ), Function.identity()
                ));
    }

    public ExternalDataConnector getConnector(String provider){

        if(provider == null || provider.isBlank()){
            throw new IllegalArgumentException("provider cannot be null or blank.provider is required");

        }

        ExternalDataConnector connector = connectors.get(normalize(provider));
        if(connector == null){
            throw new IllegalArgumentException("Connector not found for "+provider);
        }

        return connector;
    }

    private String normalize(String provider) {
        return provider.trim().toUpperCase(Locale.ROOT);
    }
}
