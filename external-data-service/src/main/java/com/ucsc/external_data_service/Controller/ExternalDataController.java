package com.ucsc.external_data_service.Controller;

import com.ucsc.external_data_service.Dto.ExternalDataIndicatorResponse;
import com.ucsc.external_data_service.Service.ExternalDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.propertyeditors.StringArrayPropertyEditor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/external-data")
public class ExternalDataController {

    private final ExternalDataService externalDataService;

    @GetMapping("/indicators")
    public ResponseEntity<List<ExternalDataIndicatorResponse>> getIndicatorData(
            @RequestParam String provider,
            @RequestParam String indicatorCode,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
            ){
        List<ExternalDataIndicatorResponse> externalDataIndicatorResponses = externalDataService.fetchDataAndSave(provider, indicatorCode, startDate, endDate);

        return ResponseEntity.ok(externalDataIndicatorResponses);
    }

    public ResponseEntity<List<ExternalDataIndicatorResponse>> getStoredData(
            @RequestParam String provider,
            @RequestParam String indicatorCode,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ){
        return ResponseEntity.ok(
                externalDataService.getStoredData(provider, indicatorCode, startDate, endDate)
        );
    }

    @DeleteMapping("/cache")
    public ResponseEntity<Void> clearCache(){
        externalDataService.clearCache();

        return ResponseEntity.noContent().build();
    }
}
