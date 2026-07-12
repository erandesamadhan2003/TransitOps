import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { AlertTriangle } from "lucide-react";
import { tripSchema } from "../schemas";
import { useCreateTrip } from "../hooks";
import { useDispatchableVehicles } from "@/features/vehicles/hooks";
import { useDispatchableDrivers } from "@/features/drivers/hooks";

const DEFAULTS = {
  source: "",
  destination: "",
  vehicleId: "",
  driverId: "",
  cargoWeight: "",
  plannedDistance: "",
};

export function TripFormModal({ open, onClose }) {
  const create = useCreateTrip();
  const { data: vehicles = [] } = useDispatchableVehicles(open);
  const { data: drivers = [] } = useDispatchableDrivers(open);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(tripSchema), defaultValues: DEFAULTS });

  const vehicleId = watch("vehicleId");
  const cargoWeight = watch("cargoWeight");
  const selectedVehicle = vehicles.find((v) => String(v.id) === String(vehicleId));
  const capacityExceeded =
    selectedVehicle && Number(cargoWeight) > Number(selectedVehicle.maxCapacity);

  useEffect(() => {
    if (open) reset(DEFAULTS);
  }, [open, reset]);

  function onSubmit(values) {
    const payload = {
      source: values.source,
      destination: values.destination,
      vehicleId: Number(values.vehicleId),
      driverId: Number(values.driverId),
      cargoWeight: Number(values.cargoWeight),
      plannedDistance: Number(values.plannedDistance),
    };
    create.mutateAsync(payload).then(onClose).catch(() => {});
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Trip"
      description="A new trip will be saved as a Draft. You can dispatch it from the trips list."
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={create.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={create.isPending}
            disabled={capacityExceeded}
          >
            Create Draft
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Source"
          placeholder="Gandhinagar Depot"
          required
          error={errors.source?.message}
          {...register("source")}
        />
        <Input
          label="Destination"
          placeholder="Ahmedabad Hub"
          required
          error={errors.destination?.message}
          {...register("destination")}
        />
        <Select
          label="Vehicle"
          required
          placeholder="Select available vehicle"
          options={vehicles.map((v) => ({
            value: v.id,
            label: `${v.vehicleName} (${v.registrationNumber}) — ${v.maxCapacity}kg`,
          }))}
          error={errors.vehicleId?.message}
          {...register("vehicleId")}
        />
        <Select
          label="Driver"
          required
          placeholder="Select available driver"
          options={drivers.map((d) => ({
            value: d.id,
            label: `${d.name} (${d.licenseCategory})`,
          }))}
          error={errors.driverId?.message}
          {...register("driverId")}
        />
        <Input
          label="Cargo Weight (kg)"
          type="number"
          required
          placeholder="450"
          error={errors.cargoWeight?.message}
          {...register("cargoWeight")}
        />
        <Input
          label="Planned Distance (km)"
          type="number"
          required
          placeholder="38"
          error={errors.plannedDistance?.message}
          {...register("plannedDistance")}
        />

        {capacityExceeded && (
          <div className="sm:col-span-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              Cargo weight ({cargoWeight} kg) exceeds vehicle capacity (
              {selectedVehicle?.maxCapacity} kg). Reduce cargo or select a different vehicle.
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
}
