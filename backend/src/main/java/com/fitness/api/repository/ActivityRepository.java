package com.fitness.api.repository;

import com.fitness.api.entity.Activity;
import com.fitness.api.entity.ActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    Page<Activity> findByUserIdAndStartTimeBetween(
        UUID userId,
        LocalDateTime from,
        LocalDateTime to,
        Pageable pageable
    );

    List<Activity> findByUserIdAndType(UUID userId, ActivityType type);

    List<Activity> findByUserId(UUID userId);

    List<Activity> findByUserIdAndStartTimeBetween(
        UUID userId,
        LocalDateTime from,
        LocalDateTime to
    );

    /**
     * Weekly stats: group activities by ISO week, summing distance, duration, and calories.
     * Returns rows of [weekStart, weekNumber, year, count, distanceMeters, durationSec, calories].
     */
    @Query(value = """
        SELECT
            DATE_TRUNC('week', a.start_time)::date AS week_start,
            EXTRACT(WEEK FROM a.start_time)::int AS week_number,
            EXTRACT(YEAR FROM a.start_time)::int AS year,
            COUNT(a.id)::int AS activity_count,
            COALESCE(SUM(a.distance_meters), 0) AS total_distance,
            COALESCE(SUM(a.duration_sec), 0)::int AS total_duration,
            COALESCE(SUM(a.calories), 0)::int AS total_calories
        FROM activities a
        WHERE a.user_id = :userId
          AND (:type IS NULL OR a.type = CAST(:type AS activity_type))
          AND a.start_time >= :since
        GROUP BY week_start, week_number, year
        ORDER BY week_start DESC
        """, nativeQuery = true)
    List<Object[]> findWeeklyStats(
        @Param("userId") UUID userId,
        @Param("type") String type,
        @Param("since") LocalDateTime since
    );

    /**
     * Summary stats: count, total distance, total duration, total calories grouped by activity type.
     * Returns rows of [type, count, totalDistance, totalDuration, totalCalories].
     */
    @Query(value = """
        SELECT
            a.type AS activity_type,
            COUNT(a.id)::int AS activity_count,
            COALESCE(SUM(a.distance_meters), 0) AS total_distance,
            COALESCE(SUM(a.duration_sec), 0)::int AS total_duration,
            COALESCE(SUM(a.calories), 0)::int AS total_calories
        FROM activities a
        WHERE a.user_id = :userId
          AND (CAST(:from AS timestamp) IS NULL OR a.start_time >= CAST(:from AS timestamp))
          AND (CAST(:to AS timestamp) IS NULL OR a.start_time <= CAST(:to AS timestamp))
        GROUP BY a.type
        """, nativeQuery = true)
    List<Object[]> findSummaryStats(
        @Param("userId") UUID userId,
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to
    );

    /**
     * Find the activity with the fastest pace (lowest avg_pace_sec_per_km) for a user and type.
     */
    @Query(value = """
        SELECT a.* FROM activities a
        JOIN activity_metrics m ON m.activity_id = a.id
        WHERE a.user_id = :userId
          AND (:type IS NULL OR a.type = CAST(:type AS activity_type))
          AND m.avg_pace_sec_per_km IS NOT NULL
        ORDER BY m.avg_pace_sec_per_km ASC
        LIMIT 1
        """, nativeQuery = true)
    Activity findFastestPace(
        @Param("userId") UUID userId,
        @Param("type") String type
    );

    /**
     * Find the activity with the longest distance for a user and type.
     */
    @Query(value = """
        SELECT a.* FROM activities a
        WHERE a.user_id = :userId
          AND (:type IS NULL OR a.type = CAST(:type AS activity_type))
          AND a.distance_meters IS NOT NULL
        ORDER BY a.distance_meters DESC
        LIMIT 1
        """, nativeQuery = true)
    Activity findLongestDistance(
        @Param("userId") UUID userId,
        @Param("type") String type
    );

    /**
     * Find the activity with the highest elevation gain for a user and type.
     */
    @Query(value = """
        SELECT a.* FROM activities a
        JOIN activity_metrics m ON m.activity_id = a.id
        WHERE a.user_id = :userId
          AND (:type IS NULL OR a.type = CAST(:type AS activity_type))
          AND m.elevation_gain_m IS NOT NULL
        ORDER BY m.elevation_gain_m DESC
        LIMIT 1
        """, nativeQuery = true)
    Activity findHighestElevationGain(
        @Param("userId") UUID userId,
        @Param("type") String type
    );
}
