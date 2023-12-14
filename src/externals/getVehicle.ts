import { VehicleData } from "../types/types";

export async function getVehicle() {
  const response = await fetch(`${process.env.REACT_APP_API_URL_VEH!}`);
  if (!response.ok) {
    throw new Error("Failed to fetch vehicle data");
  }

  const body = (await response.json()) as unknown;
  assertIsVehicle(body);
  return body;
}

export function assertIsVehicle(
  vehicleData: unknown
): asserts vehicleData is VehicleData[] {
  if (!Array.isArray(vehicleData)) {
    throw new Error("VehicleData is not array");
  }
  vehicleData.forEach((vehicle) => {
    if (
      typeof vehicle.id !== "number" ||
      typeof vehicle.name !== "string" ||
      typeof vehicle.brand !== "string" ||
      typeof vehicle.color !== "string" ||
      typeof vehicle.year !== "string"
    ) {
      throw new Error("VehicleData is invalid");
    }
  });
}
