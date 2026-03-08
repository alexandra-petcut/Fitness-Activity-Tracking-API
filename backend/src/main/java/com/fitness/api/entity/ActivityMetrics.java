package com.fitness.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "activity_metrics")
public class ActivityMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "activity_id", nullable = false)
    private UUID activityId;

    @Column(name = "avg_hr")
    private Integer avgHr;

    @Column(name = "max_hr")
    private Integer maxHr;

    @Column(name = "avg_cadence")
    private Integer avgCadence;

    @Column(name = "avg_power")
    private Integer avgPower;

    @Column(name = "elevation_gain_m")
    private Double elevationGainM;

    @Column(name = "avg_speed_mps")
    private Double avgSpeedMps;

    @Column(name = "avg_pace_sec_per_km")
    private Double avgPaceSecPerKm;
}
