export enum ActivityType {
  RUN = "RUN",
  BIKE = "BIKE",
  SWIM = "SWIM",
  WALK = "WALK",
  STRENGTH = "STRENGTH",
}

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  start_time: string;
  duration_sec: number;
  distance_meters: number | null;
  calories: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityMetrics {
  activity_id: string;
  avg_hr: number | null;
  max_hr: number | null;
  avg_cadence: number | null;
  avg_power: number | null;
  elevation_gain_m: number | null;
  avg_speed_mps: number | null;
  avg_pace_sec_per_km: number | null;
}

export interface Lap {
  id: string;
  activity_id: string;
  lap_index: number;
  duration_sec: number;
  distance_meters: number | null;
  avg_hr: number | null;
}

export interface TrackPoint {
  id: string;
  activity_id: string;
  timestamp: string;
  lat: number;
  lon: number;
  altitude: number | null;
  heart_rate: number | null;
  point_index: number;
}

export interface CreateActivityInput {
  type: ActivityType;
  start_time: string;
  duration_sec: number;
  distance_meters?: number | null;
  calories?: number | null;
  notes?: string | null;
}

export interface UpdateActivityInput {
  type?: ActivityType;
  start_time?: string;
  duration_sec?: number;
  distance_meters?: number | null;
  calories?: number | null;
  notes?: string | null;
}

export interface ActivityFilters {
  type?: ActivityType;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface ActivityWithMetrics extends Activity {
  metrics?: ActivityMetrics | null;
}
