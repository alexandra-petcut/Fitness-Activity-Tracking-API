package com.fitness.api.dto;

import com.fitness.api.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsSummaryResponse {

    private int totalActivities;
    private double totalDistanceMeters;
    private int totalDurationSec;
    private int totalCalories;
    private Map<ActivityType, TypeStats> byType;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeStats {
        private int count;
        private double distance;
        private int duration;
        private int calories;
    }
}
