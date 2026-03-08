package com.fitness.api.service;

import com.fitness.api.dto.PersonalBestResponse;
import com.fitness.api.dto.PersonalBestResponse.PersonalBestEntry;
import com.fitness.api.dto.StatsSummaryResponse;
import com.fitness.api.dto.StatsSummaryResponse.TypeStats;
import com.fitness.api.dto.WeeklyStatsResponse;
import com.fitness.api.entity.Activity;
import com.fitness.api.entity.ActivityMetrics;
import com.fitness.api.entity.ActivityType;
import com.fitness.api.repository.ActivityMetricsRepository;
import com.fitness.api.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ActivityRepository activityRepository;
    private final ActivityMetricsRepository activityMetricsRepository;

    /**
     * Aggregate summary statistics for a user within an optional date range.
     * Groups totals by activity type.
     */
    public StatsSummaryResponse getSummary(UUID userId, LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = activityRepository.findSummaryStats(userId, from, to);

        Map<ActivityType, TypeStats> byType = new EnumMap<>(ActivityType.class);
        int totalActivities = 0;
        double totalDistance = 0;
        int totalDuration = 0;
        int totalCalories = 0;

        for (Object[] row : rows) {
            String typeName = (String) row[0];
            int count = (int) row[1];
            double distance = ((Number) row[2]).doubleValue();
            int duration = (int) row[3];
            int calories = (int) row[4];

            ActivityType activityType = ActivityType.valueOf(typeName);
            byType.put(activityType, TypeStats.builder()
                .count(count)
                .distance(distance)
                .duration(duration)
                .calories(calories)
                .build());

            totalActivities += count;
            totalDistance += distance;
            totalDuration += duration;
            totalCalories += calories;
        }

        return StatsSummaryResponse.builder()
            .totalActivities(totalActivities)
            .totalDistanceMeters(totalDistance)
            .totalDurationSec(totalDuration)
            .totalCalories(totalCalories)
            .byType(byType)
            .build();
    }

    /**
     * Weekly breakdown of activity stats for a given number of past weeks,
     * optionally filtered by activity type.
     */
    public List<WeeklyStatsResponse> getWeeklyStats(UUID userId, int weeks, ActivityType type) {
        LocalDateTime since = LocalDateTime.now().minusWeeks(weeks);
        String typeStr = type != null ? type.name() : null;

        List<Object[]> rows = activityRepository.findWeeklyStats(userId, typeStr, since);
        List<WeeklyStatsResponse> result = new ArrayList<>();

        for (Object[] row : rows) {
            result.add(WeeklyStatsResponse.builder()
                .weekStart(row[0].toString())
                .weekNumber((int) row[1])
                .year((int) row[2])
                .count((int) row[3])
                .distanceMeters(((Number) row[4]).doubleValue())
                .durationSec((int) row[5])
                .calories((int) row[6])
                .build());
        }

        return result;
    }

    /**
     * Personal bests for a user, optionally filtered by activity type.
     * Computes: fastest pace, longest distance, highest elevation gain.
     */
    public PersonalBestResponse getPersonalBests(UUID userId, ActivityType type) {
        String typeStr = type != null ? type.name() : null;
        List<PersonalBestEntry> bests = new ArrayList<>();

        // Fastest pace
        Activity fastestPace = activityRepository.findFastestPace(userId, typeStr);
        if (fastestPace != null) {
            ActivityMetrics metrics = activityMetricsRepository.findByActivityId(fastestPace.getId())
                .orElse(null);
            if (metrics != null && metrics.getAvgPaceSecPerKm() != null) {
                bests.add(PersonalBestEntry.builder()
                    .metric("Fastest Pace")
                    .value(metrics.getAvgPaceSecPerKm())
                    .unit("sec/km")
                    .activityId(fastestPace.getId())
                    .achievedAt(fastestPace.getStartTime())
                    .build());
            }
        }

        // Longest distance
        Activity longestDistance = activityRepository.findLongestDistance(userId, typeStr);
        if (longestDistance != null && longestDistance.getDistanceMeters() != null) {
            bests.add(PersonalBestEntry.builder()
                .metric("Longest Distance")
                .value(longestDistance.getDistanceMeters())
                .unit("meters")
                .activityId(longestDistance.getId())
                .achievedAt(longestDistance.getStartTime())
                .build());
        }

        // Highest elevation gain
        Activity highestElevation = activityRepository.findHighestElevationGain(userId, typeStr);
        if (highestElevation != null) {
            ActivityMetrics metrics = activityMetricsRepository.findByActivityId(highestElevation.getId())
                .orElse(null);
            if (metrics != null && metrics.getElevationGainM() != null) {
                bests.add(PersonalBestEntry.builder()
                    .metric("Highest Elevation Gain")
                    .value(metrics.getElevationGainM())
                    .unit("meters")
                    .activityId(highestElevation.getId())
                    .achievedAt(highestElevation.getStartTime())
                    .build());
            }
        }

        return PersonalBestResponse.builder()
            .type(type)
            .bests(bests)
            .build();
    }
}
