package com.ucsc.kpi_dashboard.Util;

import com.ucsc.kpi_dashboard.Model.KpiProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Component
public class KpiCalculator {

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${python.executable:python3}")
    private String pythonExecutable;
    @Value("${python.calculator.script.path}")
    private String scriptPath;

    public CalculationResult calculationResult(KpiProfile kpiProfile,double actualValue){
        try{
            Map<String,Object> payload = new HashMap<>();
            payload.put("kpiType",kpiProfile.getKpiType().name());
            payload.put("target",kpiProfile.getTarget());
            payload.put("warningThreshold",kpiProfile.getWarningThreshold());
            payload.put("criticalThreshold",kpiProfile.getCriticalThreshold());
            payload.put("weight",kpiProfile.getWeight());
            //payload.put("higherBetter",kpiProfile.getHigherBetter());
            payload.put("actualValue",actualValue);

            String inputJson = objectMapper.writeValueAsString(payload);

            ProcessBuilder processBuilder = new ProcessBuilder(pythonExecutable,scriptPath,inputJson);

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null ){
                    output.append(line);
                }
            }

            int exitCode = process.waitFor();
            if(exitCode!=0){
                throw new RuntimeException("python script failed: "+output);
            }
            Map<String, Object> result = objectMapper.readValue(output.toString(), new TypeReference<Map<String, Object>>() {});

            String status = String.valueOf(result.getOrDefault("status","UNKNOWN"));

            double normalizedScore = Double.parseDouble(result.getOrDefault("normalizedScore","0").toString());

            return new CalculationResult(status,normalizedScore);
        }

        catch (Exception e){
            throw new RuntimeException("Failed to execute python script",e);
        }
    }

    public record CalculationResult(String status,double normalizedScore){}

}
