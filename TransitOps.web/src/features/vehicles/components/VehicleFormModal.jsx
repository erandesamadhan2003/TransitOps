import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { vehicleSchema } from "../schemas";
import { useCreateVehicle, useUpdateVehicle } from "../hooks";
import { VEHICLE_TYPES, REGIONS } from "@/constants/app";

const DEFAULTS = {
  registrationNumber: "",
  vehicleName: "",
  vehicleType: "",
  maxCapacity: "",
  odometer: "",
  purchaseCost: "",
  purchaseDate: "",
  region: "",
};

export function VehicleFormModal({ open, onClose, vehicle }) {
  const isEdit = Boolean(vehicle);
  const create = useCreateVehicle();
  const update = useUpdateVehicle();
  const pending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (open) reset(vehicle ? { ...DEFAULTS, ...vehicle } : DEFAULTS);
  }, [open, vehicle, reset]);

  function onSubmit(values) {
    const mutation = isEdit
      ? update.mutateAsync({ id: vehicle.id, payload: values })
      : create.mutateAsync(values);
    mutation.then(onClose).catch(() => {});
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
      description="Registration number must be unique across the fleet."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={pending}>
            {isEdit ? "Save Changes" : "Add Vehicle"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Input
          label="Registration Number"
          placeholder="GJ01AB452"
          required
          containerClassName="sm:col-span-2"
          error={errors.registrationNumber?.message}
          {...register("registrationNumber")}
        />
        <Input
          label="Vehicle Name / Model"
          placeholder="Van-05"
          required
          error={errors.vehicleName?.message}
          {...register("vehicleName")}
        />
        <Select
          label="Type"
          required
          placeholder="Select type"
          options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
          error={errors.vehicleType?.message}
          {...register("vehicleType")}
        />
        <Input
          label="Max Load Capacity (kg)"
          type="number"
          required
          placeholder="500"
          error={errors.maxCapacity?.message}
          {...register("maxCapacity")}
        />
        <Input
          label="Odometer (km)"
          type="number"
          placeholder="0"
          error={errors.odometer?.message}
          {...register("odometer")}
        />
        <Input
          label="Purchase Cost (₹)"
          type="number"
          required
          placeholder="620000"
          error={errors.purchaseCost?.message}
          {...register("purchaseCost")}
        />
        <Input
          label="Purchase Date"
          type="date"
          required
          error={errors.purchaseDate?.message}
          {...register("purchaseDate")}
        />
        <Select
          label="Region"
          required
          placeholder="Select region"
          options={REGIONS.map((r) => ({ value: r, label: r }))}
          error={errors.region?.message}
          {...register("region")}
        />
      </form>
    </Modal>
  );
}
