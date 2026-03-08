# Fitness Activity Tracker

A full-stack fitness activity tracking application inspired by Garmin Connect. Log workouts (run, bike, swim, walk, strength), view activity history, track weekly progress, and see personal bests.

Built as a **Turborepo monorepo** with a Next.js web app, Expo mobile app, Spring Boot analytics API, and Supabase for auth and data storage.

> **Status:** Work in progress. The backend analytics API and database schema are implemented. Authentication and frontend are still under active development.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js 15, React 19, Tailwind CSS 4, Recharts, TanStack Query |
| Mobile | Expo 52, React Native 0.76, Expo Router |
| Shared | TypeScript, axios, TanStack Query hooks |
| Backend | Java 21, Spring Boot 3.4, Spring Data JPA, Lombok |
| Database | PostgreSQL (Supabase-hosted) |
| Auth | Supabase Auth (JWT), validated by Spring Boot via JWKS |
| API Docs | springdoc-openapi (Swagger UI) |

## Project Structure

```
fitness-tracker/
├── apps/
│   ├── web/               # Next.js web app (dark Garmin-style dashboard)
│   └── mobile/            # Expo / React Native mobile app
├── packages/
│   ├── shared/            # @fitness/shared — types, API clients, hooks, utils
│   ├── ui/                # @fitness/ui — shared UI components
│   └── tsconfig/          # Shared TypeScript configs
├── backend/               # Spring Boot API (Maven, independent of pnpm)
└── supabase/              # Database migrations and seed data
```

## Architecture

```
Frontend (Next.js / Expo)
    ├── Supabase (direct) ──→ Auth + Activity CRUD (with Row Level Security)
    └── Spring Boot API ───→ Stats & analytics (validates Supabase JWT via JWKS)
                                └── Same Supabase PostgreSQL (JDBC)
```

Supabase handles authentication and basic CRUD operations. Spring Boot handles complex analytics queries (summary stats, weekly breakdowns, personal bests). Both frontends share types, API clients, and hooks through the `@fitness/shared` package.

## Prerequisites

- **Node.js** >= 18
- **pnpm** 10.x (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Java** 21+ (for the backend)
- A **Supabase** project (free tier works)

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd fitness-tracker
pnpm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/20240101000000_initial_schema.sql` via the Supabase SQL editor or CLI
3. Note your project URL, anon key, and database credentials

### 3. Configure environment variables

**Web app** — create `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SPRING_API_URL=http://localhost:8080
```

**Mobile app** — create `apps/mobile/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
EXPO_PUBLIC_SPRING_API_URL=http://localhost:8080
```

**Backend** — edit `backend/src/main/resources/application-local.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://db.<your-project>.supabase.co:5432/postgres
    username: postgres
    password: <your-db-password>
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: https://<your-project>.supabase.co/auth/v1/.well-known/jwks.json
```

### 4. Run the apps

```bash
# Frontend (from repo root)
pnpm dev:web          # Next.js at localhost:3000
pnpm dev:mobile       # Expo dev server

# Backend (from repo root)
pnpm dev:backend      # or: cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Available Scripts

### Root (Turborepo)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm dev:web` | Start Next.js only |
| `pnpm dev:mobile` | Start Expo only |
| `pnpm dev:backend` | Start Spring Boot |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm type-check` | TypeScript check all |
| `pnpm db:gen-types` | Regenerate TS types from Supabase schema |

### Backend (Maven)

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Run the API |
| `./mvnw clean install` | Build JAR |
| `./mvnw test` | Run all tests |
| `./mvnw test -Dtest=ClassName` | Run a single test class |
| `./mvnw test -Dtest=ClassName#method` | Run a single test method |

## API Endpoints

Spring Boot API (default: `http://localhost:8080`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/summary?from=&to=` | Totals by activity type |
| GET | `/api/stats/weekly?weeks=12&type=RUN` | Weekly bucketed stats |
| GET | `/api/stats/personal-bests?type=RUN` | Fastest pace, longest distance, etc. |

Activity CRUD is handled directly through Supabase (not Spring Boot).

Swagger UI available at `/swagger-ui` when the backend is running.

## Database Schema

Managed via Supabase migrations. Core tables:

- **activities** — id, user_id, type, start_time, duration_sec, distance_meters, calories, notes
- **activity_metrics** — avg_hr, max_hr, avg_cadence, avg_power, elevation_gain_m, avg_speed_mps, avg_pace_sec_per_km
- **laps** — lap_index, duration_sec, distance_meters, avg_hr
- **track_points** — timestamp, lat, lon, altitude, heart_rate (GPS data)

Activity types: `RUN`, `BIKE`, `SWIM`, `WALK`, `STRENGTH`

Row Level Security ensures users can only access their own data.

## What's Done

- Supabase database schema with RLS policies
- Spring Boot analytics API (summary, weekly stats, personal bests)
- `@fitness/shared` package (types, API clients, TanStack Query hooks, formatting utils)
- Next.js app structure (dashboard, activities, stats pages, sidebar layout)
- Expo mobile app structure (tab navigation, screen scaffolding)

## What's In Progress

- Authentication flow (login, register, session management)
- Frontend feature completion (activity forms, stats visualizations, charts)
- Integration testing
- Deployment configuration
