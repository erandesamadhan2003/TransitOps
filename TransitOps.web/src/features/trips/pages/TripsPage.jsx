import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Route } from "lucide-react";
import { Card, StatusBadge } from "@/components/ui";
import { Button, Table, ConfirmDialog, Modal, Input } from "@/components/common";
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
import { completeTripSchema } from "../schemas";

function CompleteTripModal({ trip, onClose, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(completeTripSchema),
    defaultValues: { actualDistance: "", fuelConsumed: "", revenue: "" },
  });

  return (
    <Modal
      open={Boolean(trip)}
      onClose={onClose}
      title={`Complete Trip`}
      description="Enter the final details to mark this trip as completed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={loading}>
            Confirm Complete
          </Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        <Input
          label="Actual Distance (km)"
          type="number"
          required
          placeholder="480"
          error={errors.actualDistance?.message}
          {...register("actualDistance")}
        />
        <Input
          label="Fuel Consumed (L)"
          type="number"
          required
          placeholder="45"
          error={errors.fuelConsumed?.message}
          {...register("fuelConsumed")}
        />
        <Input
          label="Revenue Earned (₹)"
          type="number"
          placeholder="0"
          containerClassName="sm:col-span-2"
          error={errors.revenue?.message}
          {...register("revenue")}
        />
      </form>
    </Modal>
  );
}

export default function TripsPage() {
  const canEdit = permissionService.can("trips", "edit");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { data, isLoading, error, refetch } = useTrips({ ...filters, page, pageSize: 10 });
  const dispatch = useDispatchTrip();
  const cancel = useCancelTrip();
  const complete = useCompleteTrip();

  const [createOpen, setCreateOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [confirmDispatch, setConfirmDispatch] = useState(null);
  const [completeTrip, setCompleteTrip] = useState(null);

  const columns = useMemo(
    () => [
      { header: "Source", accessorKey: "source" },
      { header: "Destination", accessorKey: "destination" },
      { header: "Vehicle", accessorKey: "vehicleName", cell: (info) => info.getValue() ?? "—" },
      { header: "Driver", accessorKey: "driverName", cell: (info) => info.getValue() ?? "—" },
      {
        header: "Cargo (kg)",
        accessorKey: "cargoWeight",
        cell: (info) => info.getValue() ?? "—",
      },
      {
        header: "Revenue (₹)",
        accessorKey: "revenue",
        cell: (info) => {
          const v = info.getValue();
          return v != null ? `₹${Number(v).toLocaleString()}` : "—";
        },
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
                          setCompleteTrip(trip);
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
    [canEdit],
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
            onChange={(e) => {
              setFilters((f) => ({ ...f, status: e.target.value || undefined }));
              setPage(1);
            }}
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
          data={data?.trips || []}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          pagination={{
            page,
            pageSize: 10,
            totalElements: data?.pagination?.total || 0,
            onPageChange: setPage,
          }}
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

      <CompleteTripModal
        trip={completeTrip}
        onClose={() => setCompleteTrip(null)}
        loading={complete.isPending}
        onSubmit={(values) => {
          complete.mutate(
            {
              id: completeTrip.id,
              payload: {
                actualDistance: Number(values.actualDistance),
                fuelConsumed: Number(values.fuelConsumed),
                revenue: Number(values.revenue ?? 0),
              },
            },
            { onSuccess: () => setCompleteTrip(null) },
          );
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmDispatch)}
        onClose={() => setConfirmDispatch(null)}
        onConfirm={() =>
          dispatch.mutate(confirmDispatch.id, {
            onSuccess: () => setConfirmDispatch(null),
          })
        }
        title={`Dispatch this trip?`}
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
        title={`Cancel this trip?`}
        description="This will release the vehicle and driver back to available status."
        confirmLabel="Cancel Trip"
        loading={cancel.isPending}
      />
    </div>
  );
}
