package com.fitness.api.repository;

import com.fitness.api.entity.ActivityMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivityMetricsRepository extends JpaRepository<ActivityMetrics, UUID> {

    Optional<ActivityMetrics> findByActivityId(UUID activityId);
}
