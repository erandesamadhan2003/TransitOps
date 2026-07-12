import { useState, useMemo } from "react";
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

  const last6Months = useMemo(() => {
    const months = [];
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 5);
    for (let i = 0; i < 6; i++) {
      months.push(d.getMonth() + 1);
      d.setMonth(d.getMonth() + 1);
    }
    return months;
  }, []);

  const tripsChartData = useMemo(() => last6Months.map(m => {
    const found = (charts?.tripsPerMonth || []).find(item => new Date(item.month).getMonth() + 1 === m);
    return { month: m, count: found ? parseInt(found.count, 10) : 0 };
  }), [charts, last6Months]);

  const fuelChartData = useMemo(() => last6Months.map(m => {
    const found = (charts?.fuelCostPerMonth || []).find(item => new Date(item.month).getMonth() + 1 === m);
    return { month: m, cost: found ? parseFloat(found.totalCost) : 0 };
  }), [charts, last6Months]);

  const maintenanceChartData = useMemo(() => last6Months.map(m => {
    const found = (charts?.maintenanceCostPerMonth || []).find(item => new Date(item.month).getMonth() + 1 === m);
    return { month: m, cost: found ? parseFloat(found.totalCost) : 0 };
  }), [charts, last6Months]);

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

              <Card className="flex flex-col">
                <CardHeader title="Vehicle Utilization" />
                <div className="flex-1 flex flex-col justify-center pb-4 px-2">
                  <div className="mb-8 flex items-baseline gap-2 border-b border-border/50 pb-4">
                    <span className="text-4xl font-bold tracking-tight text-text-primary">
                      {kpis.fleetUtilizationPercent ?? 0}%
                    </span>
                    <span className="text-sm font-medium text-text-secondary">
                      Active Fleet
                    </span>
                  </div>
                  <StatusBreakdownBars 
                    className="space-y-6"
                    data={{
                      available: kpis.availableVehicles,
                      on_trip: kpis.activeVehicles,
                      in_shop: kpis.vehiclesInShop,
                    }} 
                  />
                </div>
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
