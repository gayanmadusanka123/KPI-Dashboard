package com.ucsc.kpi_dashboard.Controller;

import com.ucsc.kpi_dashboard.Domain.KpiTypes;
import com.ucsc.kpi_dashboard.Exeptions.UserException;
import com.ucsc.kpi_dashboard.Model.User;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiProfileDto;
import com.ucsc.kpi_dashboard.Payload.Dto.KpiValueDto;
import com.ucsc.kpi_dashboard.Service.KPIService;
import com.ucsc.kpi_dashboard.Service.UserService;
import com.ucsc.kpi_dashboard.Util.KpiGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/kpis")
@RequiredArgsConstructor
public class KpiController {
    private final KPIService kpiService;
    private final KpiGenerator kpiGenerator;
    private final UserService userService;

    @GetMapping("/profiles")
    public ResponseEntity<List<KpiProfileDto>> getAllKpiProfiles(@RequestHeader("Authorization") String jwt) throws UserException {

        userService.getUserByJwtToken(jwt);

        return ResponseEntity.ok(kpiService.getAllKpiProfiles());
    }

    @GetMapping("/profiles/{kpiType}")
    public ResponseEntity<KpiProfileDto> getProfileByType(@RequestHeader("Authorization") String jwt, @PathVariable String kpiType) throws UserException {

        User user = userService.getUserByJwtToken(jwt);

        KpiTypes type = KpiTypes.valueOf(kpiType.trim().toUpperCase());

        return ResponseEntity.ok(kpiService.getKpiProfileByType(type));
    }

    @PostMapping("values/{type}")
    public ResponseEntity<KpiValueDto> saveKpiValue(@RequestHeader("Authorization") String jwt, @PathVariable String type, @RequestParam double actualValue, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) throws UserException {

        return ResponseEntity.ok(kpiService.saveKpiValue(
                KpiTypes.valueOf(type.trim().toUpperCase()),
                actualValue,
                date
        ));
    }

    @GetMapping("values/get/{type}")
    public ResponseEntity<List<KpiValueDto>> getValueByType(@RequestHeader("Authorization") String jwt, @PathVariable String type) throws UserException {

        userService.getUserByJwtToken(jwt);

        return ResponseEntity.ok(
                kpiService.getValueByType(KpiTypes.valueOf(type.trim().toUpperCase()))

        );
    }

    @PostMapping("/generate")
    public ResponseEntity<Integer> generate(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "12") int months
    ) throws UserException {
        userService.getUserByJwtToken(token);

        int inserted = kpiGenerator.generateAndSave(months);

        return ResponseEntity.ok(inserted);
    }

}