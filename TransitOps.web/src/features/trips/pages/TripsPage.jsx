import { useMemo, useState } from "react";
import { Plus, Route } from "lucide-react";
import { Card, StatusBadge } from "@/components/ui";
import { Button, Table, ConfirmDialog } from "@/components/common";
import { Select } from "@/components/forms";
import {
  useTrips,
  useDispatchTrip,
  useCancelTrip,
  useCompleteTrip,
} from "../hooks";
import { TripFormModal } from "../components/TripFormModal";
import { permissionService } from "@/services/permission.service";
import { TRIP_STATUS, TRIP_STATUS_LABELS } from "@/constants/app";

export default function TripsPage() {
  const canEdit = permissionService.can("trips", "edit");
  const [filters, setFilters] = useState({});
  const { data: trips = [], isLoading, error, refetch } = useTrips(filters);
  const dispatch = useDispatchTrip();
  const cancel = useCancelTrip();
  const complete = useCompleteTrip();

  const [createOpen, setCreateOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [confirmDispatch, setConfirmDispatch] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Code",
        accessorKey: "code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold">
            {info.getValue()}
          </span>
        ),
      },
      { header: "Source", accessorKey: "source" },
      { header: "Destination", accessorKey: "destination" },
      {
        header: "Cargo (kg)",
        accessorKey: "cargoWeight",
        cell: (info) => info.getValue() ?? "—",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      ...(canEdit
        ? [
            {
              header: "",
              id: "actions",
              cell: ({ row }) => {
                const trip = row.original;
                return (
                  <div className="flex justify-end gap-1">
                    {trip.status === TRIP_STATUS.DRAFT && (
                      <Button
                        size="sm"
                        variant="teal"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDispatch(trip);
                        }}
                      >
                        Dispatch
                      </Button>
                    )}
                    {trip.status === TRIP_STATUS.DISPATCHED && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          complete.mutate({ id: trip.id, payload: {} });
                        }}
                      >
                        Complete
                      </Button>
                    )}
                    {[TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED].includes(
                      trip.status,
                    ) && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmCancel(trip);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [canEdit, complete],
  );

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Trips
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Dispatch, track, and complete vehicle trips.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Status: All"
            value={filters.status ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value || undefined }))
            }
            options={Object.entries(TRIP_STATUS_LABELS).map(
              ([value, label]) => ({ value, label }),
            )}
            containerClassName="w-44"
          />
          {canEdit && (
            <Button
              icon={<Plus size={16} />}
              onClick={() => setCreateOpen(true)}
            >
              Create Trip
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={trips}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          emptyTitle="No trips yet"
          emptyDescription="Create a trip to get started with dispatching."
          emptyAction={
            canEdit && (
              <Button
                icon={<Plus size={16} />}
                onClick={() => setCreateOpen(true)}
              >
                Create Trip
              </Button>
            )
          }
        />
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
          <Route size={13} />
          Rule: Cargo weight must not exceed vehicle capacity · Only available
          vehicles and drivers can be dispatched.
        </p>
      </Card>

      {canEdit && (
        <TripFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      )}

      <ConfirmDialog
        open={Boolean(confirmDispatch)}
        onClose={() => setConfirmDispatch(null)}
        onConfirm={() =>
          dispatch.mutate(confirmDispatch.id, {
            onSuccess: () => setConfirmDispatch(null),
          })
        }
        title={`Dispatch ${confirmDispatch?.code}?`}
        description="This will mark the vehicle and driver as On Trip."
        confirmLabel="Dispatch"
        tone="primary"
        loading={dispatch.isPending}
      />
      <ConfirmDialog
        open={Boolean(confirmCancel)}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() =>
          cancel.mutate(confirmCancel.id, {
            onSuccess: () => setConfirmCancel(null),
          })
        }
        title={`Cancel ${confirmCancel?.code}?`}
        description="This will release the vehicle and driver back to available status."
        confirmLabel="Cancel Trip"
        loading={cancel.isPending}
      />
    </div>
  );
}
