-- ============================================================================
-- Initial Schema Migration for Fitness Activity Tracking API
-- ============================================================================

-- ==========================================================================
-- (a) Custom enum type for activity types
-- ==========================================================================
CREATE TYPE activity_type AS ENUM ('RUN', 'BIKE', 'SWIM', 'WALK', 'STRENGTH');

-- ==========================================================================
-- (b) Activities table
-- ==========================================================================
CREATE TABLE activities (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type            activity_type   NOT NULL,
    start_time      TIMESTAMPTZ     NOT NULL,
    duration_sec    INTEGER         NOT NULL CHECK (duration_sec > 0),
    distance_meters DOUBLE PRECISION,
    calories        INTEGER,
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

-- ==========================================================================
-- (c) Activity metrics table (one-to-one with activities)
-- ==========================================================================
CREATE TABLE activity_metrics (
    id                   UUID             DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id          UUID             NOT NULL REFERENCES activities(id) ON DELETE CASCADE UNIQUE,
    avg_hr               INTEGER,
    max_hr               INTEGER,
    avg_cadence          INTEGER,
    avg_power            INTEGER,
    elevation_gain_m     DOUBLE PRECISION,
    avg_speed_mps        DOUBLE PRECISION,
    avg_pace_sec_per_km  DOUBLE PRECISION
);

-- ==========================================================================
-- (d) Laps table
-- ==========================================================================
CREATE TABLE laps (
    id              UUID             DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id     UUID             NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    lap_index       INTEGER          NOT NULL,
    duration_sec    INTEGER          NOT NULL,
    distance_meters DOUBLE PRECISION,
    avg_hr          INTEGER,
    UNIQUE (activity_id, lap_index)
);

-- ==========================================================================
-- (e) Track points table (GPS data)
-- ==========================================================================
CREATE TABLE track_points (
    id            UUID             DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id   UUID             NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    timestamp     TIMESTAMPTZ      NOT NULL,
    lat           DOUBLE PRECISION NOT NULL,
    lon           DOUBLE PRECISION NOT NULL,
    altitude      DOUBLE PRECISION,
    heart_rate    INTEGER,
    point_index   INTEGER          NOT NULL,
    UNIQUE (activity_id, point_index)
);

-- ==========================================================================
-- (f) Indexes for query performance
-- ==========================================================================
CREATE INDEX idx_activities_user_id    ON activities(user_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_activities_type       ON activities(type);
CREATE INDEX idx_track_points_activity_point ON track_points(activity_id, point_index);

-- ==========================================================================
-- (g) Enable Row Level Security on all tables
-- ==========================================================================
ALTER TABLE activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE laps             ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_points     ENABLE ROW LEVEL SECURITY;

-- ==========================================================================
-- (h) RLS Policies
-- ==========================================================================

-- --------------------------------------------------------------------------
-- Activities: users can only access their own rows
-- --------------------------------------------------------------------------
CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
    ON activities FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
    ON activities FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------------------------
-- Activity Metrics: access via join to activities (user owns the activity)
-- --------------------------------------------------------------------------
CREATE POLICY "Users can view metrics for their own activities"
    ON activity_metrics FOR SELECT
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert metrics for their own activities"
    ON activity_metrics FOR INSERT
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update metrics for their own activities"
    ON activity_metrics FOR UPDATE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete metrics for their own activities"
    ON activity_metrics FOR DELETE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

-- --------------------------------------------------------------------------
-- Laps: same pattern as activity_metrics
-- --------------------------------------------------------------------------
CREATE POLICY "Users can view laps for their own activities"
    ON laps FOR SELECT
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert laps for their own activities"
    ON laps FOR INSERT
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update laps for their own activities"
    ON laps FOR UPDATE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete laps for their own activities"
    ON laps FOR DELETE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

-- --------------------------------------------------------------------------
-- Track Points: same pattern as activity_metrics
-- --------------------------------------------------------------------------
CREATE POLICY "Users can view track points for their own activities"
    ON track_points FOR SELECT
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert track points for their own activities"
    ON track_points FOR INSERT
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update track points for their own activities"
    ON track_points FOR UPDATE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete track points for their own activities"
    ON track_points FOR DELETE
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE user_id = auth.uid()
        )
    );

-- ==========================================================================
-- (i) Trigger function to auto-update updated_at on activities
-- ==========================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
