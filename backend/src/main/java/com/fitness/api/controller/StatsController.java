package com.fitness.api.controller;

import com.fitness.api.dto.PersonalBestResponse;
import com.fitness.api.dto.StatsSummaryResponse;
import com.fitness.api.dto.WeeklyStatsResponse;
import com.fitness.api.entity.ActivityType;
import com.fitness.api.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "Activity statistics and analytics endpoints")
@SecurityRequirement(name = "bearerAuth")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/summary")
    @Operation(summary = "Get summary statistics", description = "Aggregate stats across all activities, optionally filtered by date range")
    public ResponseEntity<StatsSummaryResponse> getSummary(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        UUID userId = UUID.fromString(jwt.getSubject());
        StatsSummaryResponse summary = statsService.getSummary(userId, from, to);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/weekly")
    @Operation(summary = "Get weekly stats", description = "Weekly breakdown of activities for the specified number of past weeks")
    public ResponseEntity<List<WeeklyStatsResponse>> getWeeklyStats(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "12") int weeks,
            @RequestParam(required = false) ActivityType type) {

        UUID userId = UUID.fromString(jwt.getSubject());
        List<WeeklyStatsResponse> weeklyStats = statsService.getWeeklyStats(userId, weeks, type);
        return ResponseEntity.ok(weeklyStats);
    }

    @GetMapping("/personal-bests")
    @Operation(summary = "Get personal bests", description = "Personal bests including fastest pace, longest distance, and highest elevation gain")
    public ResponseEntity<PersonalBestResponse> getPersonalBests(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) ActivityType type) {

        UUID userId = UUID.fromString(jwt.getSubject());
        PersonalBestResponse personalBests = statsService.getPersonalBests(userId, type);
        return ResponseEntity.ok(personalBests);
    }
}
