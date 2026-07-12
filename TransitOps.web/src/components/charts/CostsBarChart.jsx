import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { formatCurrency } from "@/utils/format";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold text-text-primary">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function CostsBarChart({ data = [], height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barCategoryGap={12}>
        <XAxis
          dataKey="month"
          tickFormatter={(m) => MONTH_LABELS[(m - 1) % 12]}
          tick={{ fill: "#5A6A7A", fontSize: 11 }}
          axisLine={{ stroke: "#c5d8ec" }}
          tickLine={false}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "rgba(179,36,31,0.06)" }}
        />
        <Bar dataKey="cost" fill="#B3241F" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
