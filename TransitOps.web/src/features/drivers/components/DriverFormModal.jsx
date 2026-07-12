import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { driverSchema } from "../schemas";
import { useCreateDriver, useUpdateDriver, useUploadDriverDocument } from "../hooks";
import { LICENSE_CATEGORIES } from "@/constants/app";

const DEFAULTS = {
  name: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiry: "",
  contactNumber: "",
  safetyScore: 100,
};

export function DriverFormModal({ open, onClose, driver }) {
  const isEdit = Boolean(driver);
  const create = useCreateDriver();
  const update = useUpdateDriver();
  const uploadDoc = useUploadDriverDocument();
  const pending = create.isPending || update.isPending || uploadDoc.isPending;
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(driverSchema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (open) {
      reset(driver ? { ...DEFAULTS, ...driver } : DEFAULTS);
      setFiles([]);
    }
  }, [open, driver, reset]);

  async function onSubmit(values) {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: driver.id, payload: values });
      } else {
        const newDriver = await create.mutateAsync(values);
        if (files.length > 0) {
          for (const file of files) {
            const formData = new FormData();
            formData.append("document", file);
            formData.append("docType", "Initial Document");
            await uploadDoc.mutateAsync({ id: newDriver.id, formData });
          }
        }
      }
      onClose();
    } catch (error) {
      // Handled by mutations
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Driver" : "Add Driver"}
      description="License number must be unique across all drivers."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={pending}>
            {isEdit ? "Save Changes" : "Add Driver"}
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
          label="Full Name"
          placeholder="Alex"
          required
          containerClassName="sm:col-span-2"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="License Number"
          placeholder="DL-88213"
          required
          error={errors.licenseNumber?.message}
          {...register("licenseNumber")}
        />
        <Select
          label="License Category"
          required
          placeholder="Select category"
          options={LICENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.licenseCategory?.message}
          {...register("licenseCategory")}
        />
        <Input
          label="License Expiry"
          type="date"
          required
          error={errors.licenseExpiry?.message}
          {...register("licenseExpiry")}
        />
        <Input
          label="Contact Number"
          placeholder="9876500000"
          required
          error={errors.contactNumber?.message}
          {...register("contactNumber")}
        />
        <Input
          label="Safety Score"
          type="number"
          min="0"
          max="100"
          placeholder="100"
          error={errors.safetyScore?.message}
          {...register("safetyScore")}
        />
        {!isEdit && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Initial Documents
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="block w-full text-sm text-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-brand-50 file:text-brand-700
                hover:file:bg-brand-100"
            />
            {files.length > 0 && (
              <p className="mt-2 text-xs text-text-tertiary">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}
