import { Gauge, Fuel, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardHeader, StatCard } from "@/components/ui";
import { Loader, ErrorState } from "@/components/common";
import { useChartsData, useKpisData } from "../hooks";
import { formatCurrency } from "@/utils/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function TripsChart({ data = [] }) {
  const formatted = data.map((d) => ({
    month: new Date(d.month).toLocaleString("default", { month: "short" }),
    Trips: Number(d.count),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="Trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function FuelCostChart({ data = [] }) {
  const formatted = data.map((d) => ({
    month: new Date(d.month).toLocaleString("default", { month: "short" }),
    "Fuel Cost": Number(d.totalCost),
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => formatCurrency(v)} />
        <Bar dataKey="Fuel Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function ReportsPage() {
  const { data: charts, isLoading, error, refetch } = useChartsData();
  const { data: kpis } = useKpisData();

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Fleet performance metrics and operational insights.
          </p>
        </div>
      </div>

      {isLoading && <Loader fullHeight label="Loading analytics…" />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {kpis && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Fleet Utilization"
            value={`${kpis.fleetUtilizationPercent ?? 0}%`}
            accent="ink"
            icon={<Gauge size={18} />}
          />
          <StatCard
            label="Active Vehicles"
            value={kpis.activeVehicles ?? 0}
            accent="teal"
            icon={<BarChart3 size={18} />}
          />
          <StatCard
            label="Active Trips"
            value={kpis.activeTrips ?? 0}
            accent="amber"
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Drivers on Trip"
            value={kpis.driversOnTrip ?? 0}
            accent="teal"
            icon={<Fuel size={18} />}
          />
        </div>
      )}

      {charts && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Trips per Month" subtitle="Last 6 months dispatch activity" />
            <TripsChart data={charts.tripsPerMonth} />
          </Card>

          <Card>
            <CardHeader title="Fuel Cost per Month" subtitle="Total fuel expenditure trend" />
            <FuelCostChart data={charts.fuelCostPerMonth} />
          </Card>
        </div>
      )}
    </div>
  );
}
