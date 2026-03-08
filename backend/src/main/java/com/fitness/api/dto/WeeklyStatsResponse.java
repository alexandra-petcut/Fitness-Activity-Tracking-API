package com.fitness.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyStatsResponse {

    private String weekStart;
    private int weekNumber;
    private int year;
    private int count;
    private double distanceMeters;
    private int durationSec;
    private int calories;
}
