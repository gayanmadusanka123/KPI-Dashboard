package com.ucsc.external_data_service.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExternalDataRefreshService {

    private final ExternalDataService externalDataService;
    private final boolean enabled;

    public ExternalDataRefreshService(
            ExternalDataService externalDataService,
                                      @Value("${external-data.refresh.enabled:true}")
                                      boolean enabled) {

        this.externalDataService = externalDataService;
        this.enabled = enabled;

    }

    public void refreshExternalDataIndicators(){
        if(!enabled){
            return;
        }

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusYears(10);

        List<String> indicators = List.of(
                "NY.GDP.MKTP.KD.ZG",
                "FP.CPI.TOTL.ZG",
                "SL.UEM.TOTL.ZS"
        );

        for(String indicator : indicators){
            try{
                externalDataService.fetchDataAndSave(
                        "WORLD_BANK",
                        indicator,
                        startDate,
                        endDate
                );
            } catch (Exception e) {
                System.err.println(
                        "Refreshed failed for " +
                                indicator + ": " + e.getMessage()
                );
            }
        }
    }
}
