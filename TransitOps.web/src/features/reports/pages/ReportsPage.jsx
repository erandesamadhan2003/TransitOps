import { useState } from "react";
import { Download, Gauge, Fuel, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardHeader, StatCard } from "@/components/ui";
import { Button, Loader, ErrorState, Pagination } from "@/components/common";
import { useAnalyticsData, useKpisData } from "../hooks";
import { reportsApi } from "../api";
import { RevenueBarChart } from "@/components/charts/RevenueBarChart";
import { CostliestVehiclesBars } from "@/components/charts/CostliestVehiclesBars";
import { formatCurrency } from "@/utils/format";

// ── CSV export helper ────────────────────────────────────────────────
function exportToCsv(analytics, kpis) {
  const rows = [
    // Header
    [
      "Vehicle",
      "Registration",
      "Total Revenue (₹)",
      "Fuel Cost (₹)",
      "Maintenance Cost (₹)",
      "Total Operational Cost (₹)",
      "ROI (%)",
    ],
    // Per-vehicle rows
    ...(analytics?.vehicles ?? []).map((v) => [
      v.vehicleName,
      v.registrationNumber,
      v.totalRevenue,
      v.totalFuelCost,
      v.totalMaintenanceCost,
      v.totalCost,
      v.roi ?? "N/A",
    ]),
    // Summary row
    [],
    ["Fleet Summary"],
    ["Fleet Utilization (%)", kpis?.fleetUtilizationPercent ?? 0],
    ["Drivers on Duty", kpis?.driversOnDuty ?? 0],
    ["Fuel Efficiency (km/L)", analytics?.fuelEfficiencyKmL ?? "N/A"],
    ["Total Fleet Revenue (₹)", analytics?.totalRevenue ?? 0],
  ];

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transitops_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── ROI badge colour ─────────────────────────────────────────────────
function RoiBadge({ value }) {
  if (value == null) return <span className="text-xs text-text-tertiary">N/A</span>;
  const color = value >= 0 ? "text-green-600" : "text-red-600";
  return <span className={`text-xs font-semibold ${color}`}>{value}%</span>;
}

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const { data: analytics, isLoading, error, refetch } = useAnalyticsData({ page, pageSize: 10 });
  const { data: kpis } = useKpisData();

  // Build revenue-by-month data for RevenueBarChart
  const revenueChartData = (analytics?.revenueByMonth ?? []).map((d) => ({
    month: d.month,
    revenue: Number(d.revenue),
  }));

  // Build costliest vehicles data for CostliestVehiclesBars
  const costliestData = analytics?.topCostliestVehicles ?? [];

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Fleet performance, cost breakdown, and ROI insights.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<Download size={16} />}
          onClick={async () => {
            try {
              const fullAnalytics = await reportsApi.getAnalytics();
              exportToCsv(fullAnalytics, kpis);
            } catch (err) {
              console.error("Failed to fetch full analytics for export", err);
              exportToCsv(analytics, kpis);
            }
          }}
          disabled={!analytics}
        >
          Export CSV
        </Button>
      </div>

      {isLoading && <Loader fullHeight label="Loading analytics…" />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      {(kpis || analytics) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Fleet Utilization"
            value={`${kpis?.fleetUtilizationPercent ?? 0}%`}
            accent="ink"
            icon={<Gauge size={18} />}
          />
          <StatCard
            label="Drivers on Duty"
            value={kpis?.driversOnDuty ?? 0}
            accent="teal"
            icon={<TrendingUp size={18} />}
          />
          <StatCard
            label="Fuel Efficiency"
            value={
              analytics?.fuelEfficiencyKmL != null
                ? `${analytics.fuelEfficiencyKmL} km/L`
                : "—"
            }
            accent="amber"
            icon={<Fuel size={18} />}
          />
          <StatCard
            label="Total Revenue"
            value={formatCurrency(analytics?.totalRevenue ?? 0)}
            accent="teal"
            icon={<DollarSign size={18} />}
          />
        </div>
      )}

      {/* ── Charts Row ────────────────────────────────────────────── */}
      {analytics && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Monthly Revenue"
              subtitle="Revenue from completed trips in the last 6 months"
            />
            {revenueChartData.length > 0 ? (
              <div className="mt-4">
                <RevenueBarChart data={revenueChartData} height={220} />
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-text-secondary">
                No completed trips with revenue yet.
              </p>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Top 5 Costliest Vehicles"
              subtitle="Combined fuel + maintenance expenditure"
            />
            {costliestData.length > 0 ? (
              <div className="mt-4">
                <CostliestVehiclesBars data={costliestData} />
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-text-secondary">
                No cost data yet.
              </p>
            )}
          </Card>
        </div>
      )}

      {/* ── Per-Vehicle ROI Table ─────────────────────────────────── */}
      {analytics?.vehicles?.length > 0 && (
        <Card>
          <CardHeader
            title="Vehicle ROI Breakdown"
            subtitle="ROI = (Revenue − Operational Cost) ÷ Acquisition Cost"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wide text-text-secondary">
                  <th className="py-2 pr-4 text-left font-semibold">Vehicle</th>
                  <th className="py-2 px-3 text-right font-semibold">Revenue</th>
                  <th className="py-2 px-3 text-right font-semibold">Fuel Cost</th>
                  <th className="py-2 px-3 text-right font-semibold">Maint. Cost</th>
                  <th className="py-2 px-3 text-right font-semibold">Total Cost</th>
                  <th className="py-2 pl-3 text-right font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {analytics.vehicles.map((v) => (
                  <tr
                    key={v.vehicleId}
                    className="border-b border-border/60 last:border-0 hover:bg-ink-50/40"
                  >
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-text-primary">{v.vehicleName}</p>
                      <p className="text-xs text-text-secondary">{v.registrationNumber}</p>
                    </td>
                    <td className="py-2.5 px-3 text-right text-green-700">
                      {formatCurrency(v.totalRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-700">
                      {formatCurrency(v.totalFuelCost)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-red-700">
                      {formatCurrency(v.totalMaintenanceCost)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-text-primary">
                      {formatCurrency(v.totalCost)}
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <RoiBadge value={v.roi} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination 
            page={page} 
            totalPages={analytics?.pagination?.totalPages || 0} 
            onPageChange={setPage} 
          />
        </Card>
      )}
    </div>
  );
}
