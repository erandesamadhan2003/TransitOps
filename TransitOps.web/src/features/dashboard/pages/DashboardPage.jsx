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
import { useTrips } from "@/features/trips/hooks";
import { DashboardFilters } from "../components/DashboardFilters";
import { RecentTripsList } from "../components/RecentTripsList";
import { StatusBreakdownBars, TripsBarChart, CostsBarChart } from "@/components/charts";

export default function DashboardPage() {
  const [filters, setFilters] = useState({});
  const { data: kpis, isLoading, error, refetch } = useDashboardKpis(filters);
  const { data: charts } = useDashboardCharts();
  const { data: tripsData } = useTrips({ 
    page: 1, 
    pageSize: 5, 
    vehicleType: filters.vehicleType, 
    region: filters.region 
  });

  const tripsChartData = (charts?.tripsPerMonth || []).map(item => ({
    month: new Date(item.month).getMonth() + 1,
    count: item.count
  }));

  const fuelChartData = (charts?.fuelCostPerMonth || []).map(item => ({
    month: new Date(item.month).getMonth() + 1,
    cost: parseFloat(item.totalCost)
  }));

  const maintenanceChartData = (charts?.maintenanceCostPerMonth || []).map(item => ({
    month: new Date(item.month).getMonth() + 1,
    cost: parseFloat(item.totalCost)
  }));

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
                  title="Recent Trips"
                  subtitle="Latest dispatch activity"
                />
                <RecentTripsList trips={tripsData?.trips || []} />
              </Card>

              <Card>
                <CardHeader title="Vehicle Utilization" />
                <StatusBreakdownBars 
                  data={{
                    available: kpis.availableVehicles,
                    on_trip: kpis.activeVehicles,
                    in_shop: kpis.vehiclesInShop,
                    retired: kpis.retiredVehicles,
                  }} 
                />
              </Card>
            </div>
          )}

          {charts && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <CardHeader title="Trips Volume (6 Months)" />
                <div className="pt-2">
                  <TripsBarChart data={tripsChartData} />
                </div>
              </Card>

              <Card>
                <CardHeader title="Fuel Costs (6 Months)" />
                <div className="pt-2">
                  <CostsBarChart data={fuelChartData} />
                </div>
              </Card>

              <Card>
                <CardHeader title="Maintenance Costs (6 Months)" />
                <div className="pt-2">
                  <CostsBarChart data={maintenanceChartData} />
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
