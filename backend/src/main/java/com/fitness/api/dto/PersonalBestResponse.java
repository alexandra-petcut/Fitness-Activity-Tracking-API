package com.fitness.api.dto;

import com.fitness.api.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalBestResponse {

    private ActivityType type;
    private List<PersonalBestEntry> bests;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalBestEntry {
        private String metric;
        private double value;
        private String unit;
        private UUID activityId;
        private LocalDateTime achievedAt;
    }
}
