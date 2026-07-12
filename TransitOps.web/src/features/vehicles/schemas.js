import { z } from "zod";
import {
  requiredString,
  registrationNumber,
  positiveNumber,
  nonNegativeNumber,
} from "@/utils/validators";
import { VEHICLE_TYPES, REGIONS } from "@/constants/app";

export const vehicleSchema = z.object({
  registrationNumber,
  vehicleName: requiredString("Vehicle name"),
  vehicleType: z.enum(VEHICLE_TYPES, {
    errorMap: () => ({ message: "Select a vehicle type" }),
  }),
  maxCapacity: positiveNumber("Maximum load capacity"),
  odometer: nonNegativeNumber("Odometer"),
  purchaseCost: positiveNumber("Purchase cost"),
  purchaseDate: requiredString("Purchase date"),
  region: z.enum(REGIONS, { errorMap: () => ({ message: "Select a region" }) }),
});
