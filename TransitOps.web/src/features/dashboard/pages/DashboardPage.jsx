import { useState } from "react";
import {
  Truck,
  CheckCircle2,
  Wrench,
  Navigation,
  Clock,
  Users,
  Gauge,
} from "lucide-react";
import { Card, CardHeader, StatCard } from "@/components/ui";
import { Loader, ErrorState } from "@/components/common";
import { useDashboardKpis, useDashboardCharts } from "../hooks";
import { DashboardFilters } from "../components/DashboardFilters";
import { RecentTripsList } from "../components/RecentTripsList";
import { StatusBreakdownBars } from "@/components/charts";

export default function DashboardPage() {
  const [filters, setFilters] = useState({});
  const { data: kpis, isLoading, error, refetch } = useDashboardKpis(filters);
  const { data: charts } = useDashboardCharts();

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            A live snapshot of fleet, trips, and driver availability.
          </p>
        </div>
        <DashboardFilters filters={filters} onChange={setFilters} />
      </div>

      {isLoading && <Loader fullHeight label="Loading dashboard…" />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {kpis && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            <StatCard
              label="Active Vehicles"
              value={kpis.activeVehicles}
              accent="ink"
              icon={<Truck size={18} />}
            />
            <StatCard
              label="Available"
              value={kpis.availableVehicles}
              accent="teal"
              icon={<CheckCircle2 size={18} />}
            />
            <StatCard
              label="In Maintenance"
              value={kpis.vehiclesInShop}
              accent="amber"
              icon={<Wrench size={18} />}
            />
            <StatCard
              label="Active Trips"
              value={kpis.activeTrips}
              accent="ink"
              icon={<Navigation size={18} />}
            />
            <StatCard
              label="Pending Trips"
              value={kpis.pendingTrips}
              accent="slate"
              icon={<Clock size={18} />}
            />
            <StatCard
              label="Drivers on Duty"
              value={kpis.driversOnDuty}
              accent="teal"
              icon={<Users size={18} />}
            />
            <StatCard
              label="Fleet Utilization"
              value={`${kpis.fleetUtilizationPercent ?? 0}%`}
              accent="ink"
              icon={<Gauge size={18} />}
            />
          </div>

          {charts && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader
                  title="Trips per Month"
                  subtitle="Historical dispatch activity"
                />
                <RecentTripsList trips={charts.tripsPerMonth} />
              </Card>

              <Card>
                <CardHeader title="Vehicle Utilization" />
                <StatusBreakdownBars data={charts.vehicleUtilization} />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
