import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui";
import { EmptyState } from "@/components/common";
import { ROUTES } from "@/constants/routes";

export function RecentTripsList({ trips = [] }) {
  if (!trips.length)
    return (
      <EmptyState
        title="No recent trips"
        description="Dispatched trips will show up here."
      />
    );

  return (
    <div className="scroll-none overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-secondary">
            <th className="py-2 pr-3 font-semibold">Trip</th>
            <th className="py-2 pr-3 font-semibold">Vehicle</th>
            <th className="py-2 pr-3 font-semibold">Driver</th>
            <th className="py-2 pr-3 font-semibold">Status</th>
            <th className="py-2 pr-0 text-right font-semibold">ETA</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr
              key={trip.id}
              className="border-b border-border/60 last:border-0"
            >
              <td className="py-2.5 pr-3 font-mono text-xs text-text-primary">
                {trip.code}
              </td>
              <td className="py-2.5 pr-3 text-text-primary">
                {trip.vehicleName}
              </td>
              <td className="py-2.5 pr-3 text-text-primary">
                {trip.driverName}
              </td>
              <td className="py-2.5 pr-3">
                <StatusBadge status={trip.status} />
              </td>
              <td className="py-2.5 pr-0 text-right text-text-secondary">
                {trip.etaMinutes ? `${trip.etaMinutes} min` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-right">
        <Link
          to={ROUTES.TRIPS}
          className="text-xs font-semibold text-ink-500 hover:underline"
        >
          View all trips →
        </Link>
      </div>
    </div>
  );
}
