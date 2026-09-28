package com.ucsc.kpi_dashboard.Util;


import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Model.KpiProfile;
import com.ucsc.kpi_dashboard.Model.KpiValues;
import com.ucsc.kpi_dashboard.Repository.KpiProfileRepository;
import com.ucsc.kpi_dashboard.Repository.KpiValuesRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
//@RequiredArgsConstructor
public class KpiGenerator {

    private final KpiProfileRepository kpiProfileRepository;
    private final KpiValuesRepository kpiValuesRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Value("${python.executable:python}")
    private String pythonExecutable;

    @Value("${python.generator.script.path}")
    private String generatorScriptPath;

    public KpiGenerator(KpiProfileRepository kpiProfileRepository, KpiValuesRepository kpiValuesRepository) {
        this.kpiProfileRepository = kpiProfileRepository;
        this.kpiValuesRepository = kpiValuesRepository;
    }

    @PostConstruct
    public void seedProfile() {
        if (kpiProfileRepository.count() > 0) {
            return;
        }

        List<KpiProfile> kpiProfiles = List.of(
                new KpiProfile(null, KpiTypes.MONTHLY_REVENUE, "Monthly Revenue", "USD", 250000.0, 20000.0, 15000.0, 1.20, true),
                new KpiProfile(null, KpiTypes.CSAT_SCORE, "Csat Score", "%", 90, 80, 70, 1.00, true),
                new KpiProfile(null, KpiTypes.HEAD_COUNT, "Head count", "Employees", 120, 100, 85, 0.70, true),
                new KpiProfile(null, KpiTypes.DEFECT_RATE, "Defect Rate", "%", 2.0, 3.5, 5.0, 1.10, false),
                new KpiProfile(null, KpiTypes.SALES_CONVERSION, "Sales Conversion", "%", 22, 16, 10, 1.00, true),
                new KpiProfile(null, KpiTypes.OPERATIONAL_COST, "Operational Cost", "USD", 100000, 120000, 140000, 1.15, false),
                new KpiProfile(null, KpiTypes.WEBSITE_TRAFFIC, "Website Traffic", "Visits", 500000, 350000, 250000, 0.80, true),
                new KpiProfile(null, KpiTypes.ON_TIME_DELIVERY, "On-Time Delivery", "%", 96, 90, 82, 1.05, true)
        );

        kpiProfileRepository.saveAll(kpiProfiles);

    }

    @Transactional
    public int generateAndSave(int months) {
        try {
            String json = runPython(months);
            List<Map<String, Object>> rows = objectMapper.readValue(
                    json, new TypeReference<List<Map<String, Object>>>() {
                    }
            );
            List<KpiValues> toSave = new ArrayList<>();
            LocalDate start = LocalDate.now().minusMonths(months);

            KpiProfile revenue = getProfile(KpiTypes.MONTHLY_REVENUE);
            KpiProfile csat = getProfile(KpiTypes.CSAT_SCORE);
            KpiProfile headcount = getProfile(KpiTypes.HEAD_COUNT);
            KpiProfile defectRate = getProfile(KpiTypes.DEFECT_RATE);
            KpiProfile salesConversion = getProfile(KpiTypes.SALES_CONVERSION);
            KpiProfile operationalCost = getProfile(KpiTypes.OPERATIONAL_COST);
            KpiProfile websiteTraffic = getProfile(KpiTypes.WEBSITE_TRAFFIC);
            KpiProfile onTimeDelivery = getProfile(KpiTypes.ON_TIME_DELIVERY);

            for (int i = 0; i < rows.size(); i++) {
                Map<String, Object> row = rows.get(i);
                LocalDate data = start.plusMonths(i);

                addValue(toSave, websiteTraffic, getDouble(row, "Traffic"), data);
                addValue(toSave, salesConversion, getDouble(row, "Conversion") * 100.0, data);
                addValue(toSave, operationalCost, getDouble(row, "Operational Cost"), data);
                addValue(toSave, defectRate, getDouble(row, "Defect Rate") * 100.0, data);
                addValue(toSave, headcount, getDouble(row, "Head Count"), data);
                addValue(toSave, revenue, getDouble(row, "Revenue"), data);
                addValue(toSave, csat, getDouble(row, "CSAT") * 100.0, data);
                addValue(toSave, onTimeDelivery, getDouble(row, "On Time Delivery"), data);

            }

            kpiValuesRepository.saveAll(toSave);
            return toSave.size();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate KPI data from python script", e);
        }
    }

    private double getDouble(Map<String, Object> row, String key) {
        Object value = row.get(key);
        if (value == null) return 0;
        return Double.parseDouble(String.valueOf(value));

    }

    private void addValue(List<KpiValues> list, KpiProfile kpiProfile, double value, LocalDate date) {
        KpiValues kpiValues = new KpiValues();
        kpiValues.setKpiProfile(kpiProfile);
        kpiValues.setActualValue(value);
        kpiValues.setValueDate(date);
        list.add(kpiValues);
    }

    private KpiProfile getProfile(KpiTypes kpiType) {
        return kpiProfileRepository.findByKpiType(kpiType).orElseThrow(() -> new RuntimeException("Missing Kpi Profile :" + kpiType));

    }

    private String runPython(int months) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutable, generatorScriptPath,
                String.valueOf(months)
        );
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        StringBuilder output = new StringBuilder();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                output.append(line);
            }
        }

        int exit = process.waitFor();
        if (exit != 0) {
            throw new RuntimeException("Python exited with code " + exit + ": " + output);
        }

        return output.toString().trim();
    }

}
