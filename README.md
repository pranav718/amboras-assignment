# Store Analytics Dashboard

Project Video Walkthrough: https://youtu.be/dC1azVo4sfA

A real-time analytics dashboard for Amboras's multi-tenant eCommerce platform. Store owners can track revenue, conversion rates, top products, and customer activity, with everything loading in under 2 seconds.

## Setup Instructions

### Prerequisites
* Node.js v18+ and npm
* PostgreSQL 14+ running locally or via Docker
* Git

### 1. Clone and Install

```bash
git clone https://github.com/pranav718/amboras-assignment.git
cd amboras-assignment

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Set Up PostgreSQL

```bash
# Create the database
psql -U postgres -c "CREATE USER amboras WITH PASSWORD 'amboras_secret';"
psql -U postgres -c "CREATE DATABASE amboras_analytics OWNER amboras;"
```

Or with Docker:
```bash
docker run -d --name amboras-pg \
  -e POSTGRES_USER=amboras \
  -e POSTGRES_PASSWORD=amboras_secret \
  -e POSTGRES_DB=amboras_analytics \
  -p 5432:5432 \
  postgres:16
```

### 3. Configure Environment

```bash
# Copy the example env file
cp .env.example backend/.env
```

Edit the `backend/.env` file if your PostgreSQL connection details differ from the defaults.

### 4. Seed Demo Data

```bash
cd backend
npm run seed
```

This step simulates a realistic environment by creating 2 demo stores with 50,000 events spread over 30 days. It creates the pre-aggregated daily metrics and product metrics. You can log into these demo stores later.

### 5. Start the Application

Terminal 1 (Backend):
```bash
cd backend
npm run start:dev
# Runs on http://localhost:3001
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 6. Login

Open http://localhost:3000 and log in with the generated demo credentials:
* Store 1: demo@store1.com / password123
* Store 2: demo@store2.com / password123

---

## Architecture Decisions

### Data Aggregation Strategy
**Decision:** I used a hybrid approach. The system writes to an append-only events log, but also maintains pre-aggregated tables (daily_metrics and product_metrics) that are updated via atomic upserts during event ingestion. Live queries are used only for calculating recent activity.

**Why:** With around 10,000 events per minute, scanning raw events on the fly for aggregate metrics like total revenue or conversion rate would be far too slow, effectively O(n). Pre-aggregation guarantees O(1) read speeds because the dashboard is just looking up a running total. Using the PostgreSQL INSERT ... ON CONFLICT ... DO UPDATE SET pattern makes sure these counters increment atomically, which completely avoids race conditions when multiple writes happen simultaneously.

**Trade-offs:** 
* Gained: Dashboard reads are incredibly fast (under 50ms) regardless of how many events the store has processed. The database size scales linearly with time rather than event count.
* Sacrificed: Write complexity is slightly higher since each ingestion triggers multiple upserts instead of a single insert.

### Real-time vs. Batch Processing
**Decision:** I went with real-time ingestion where events are aggregated on write, combined with a polling-based read strategy on the frontend (polling every 10 to 30 seconds).

**Why:** A cron-based batch aggregation job would be easier to build but it introduces a noticeable staleness window for the end user. Running real-time upserts keeps the dashboard perfectly accurate up to the very last event. I chose automatic HTTP polling over WebSockets because it avoids the operational complexity of managing persistent connections and sync logic, while still feeling "live" to the user.

**Trade-offs:**
* Gained: Near-real-time accuracy without needing heavier infrastructure like Kafka or Redis Streams.
* Sacrificed: Data on the dashboard might be up to 30 seconds stale depending on the polling cycle, which is generally acceptable for this kind of analytics use case.

### Multi-tenancy Security
**Decision:** I implemented strict row-level isolation using a store_id column. JWT tokens carry the store_id, and every single database query filters by it.

**Why:** This is much simpler and more cost-effective than creating a separate database or schema for every tenant. Creating composite indexes on the store_id keeps queries extremely fast. This pattern scales comfortably up to tens of thousands of tenants.

**Trade-offs:**
* Gained: A simple implementation that is very easy to secure and test.
* Sacrificed: At extreme scale, this can suffer from the "noisy neighbor" problem where one massive store affects database performance for smaller stores. In a real production environment, this could be mitigated by partitioning the tables by store_id.

### Frontend Data Fetching
**Decision:** I used TanStack Query (React Query) configured with refetchInterval for polling.

**Why:** It provides reliable caching, loading states, and automatic background refetching right out of the box. By including the date range in the query keys, changing the time range on the dashboard automatically fetches fresh data. The stale-while-revalidate pattern means users see their cached data instantly while fresh data loads quietly in the background.

### Performance Optimizations
1. Database indexes: Set up composite indexes on (store_id, date) for daily_metrics and (store_id, timestamp) for events, mapping perfectly to the WHERE clauses used by the API.
2. Pre-aggregated tables: The overview API endpoint only needs to scan about 30 rows instead of millions of events.
3. Batch revenue query: The backend fetches revenue for all three time periods (today, week, month) in a single SQL query using CASE expressions to minimize database round trips.
4. Polling intervals: The React Query intervals are tiered based on how fast data actually changes. Recent activity polls every 10 seconds, but top products only polls every 60 seconds.

---

## Known Limitations

1. No true WebSocket real-time: Because it uses polling, events appear on the dashboard with up to a 10-second delay. For instantaneous feeds, Socket.IO would be needed.
2. No Redis caching layer: The pre-aggregated tables are currently fast enough that Redis is overkill. However, at 100K+ events per minute, a caching layer would become necessary.
3. Hardcoded product names: The product name mapping is currently stored client-side in the frontend to keep the raw events lightweight. In production, this would be tied to a dedicated Products table.
4. No data export: Store owners currently cannot export their analytics reports to CSV or PDF.

## What I would improve with more time

1. WebSocket integration: Pushing events to the dashboard instantly using NestJS Gateways.
2. Redis caching: Caching the overview and top-products JSON responses with a 30-second TTL to get sub-10ms read times.
3. Custom calendars: Adding a custom date range picker instead of restricting users to today, week, or month.
4. Data comparison: Showing trend indicators like "Revenue is up 15 percent vs last week".
5. Database migrations: Replacing TypeORM's auto-synchronize with programmatic migration files for safer production deployments.
6. Rate limiting: Protecting the high-volume event ingestion endpoint from abuse.

## Time Spent
Approximately 3 to 4 hours total.
