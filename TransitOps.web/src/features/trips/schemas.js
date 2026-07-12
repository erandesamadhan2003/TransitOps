import { z } from "zod";
import { requiredString, positiveNumber } from "@/utils/validators";

export const tripSchema = z.object({
  source: requiredString("Source location"),
  destination: requiredString("Destination"),
  vehicleId: z.coerce.number().min(1, "Select a vehicle"),
  driverId: z.coerce.number().min(1, "Select a driver"),
  cargoWeight: positiveNumber("Cargo weight"),
  plannedDistance: positiveNumber("Planned distance"),
});

export const completeTripSchema = z.object({
  actualDistance: positiveNumber("Actual distance"),
  fuelConsumed: positiveNumber("Fuel consumed"),
  revenue: z.coerce.number().min(0, "Revenue must be non-negative").optional().default(0),
});
