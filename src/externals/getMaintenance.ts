import { MaintenanceData } from "../types/types";

// get data from endpoint, and assert the data is valid
export async function getMaintenance(param?: string) {
  param = param ? `${param}&_limit=5` : "_limit=5";
  const response = await fetch(`${process.env.REACT_APP_API_URL!}?${param}`);

  if (!response.ok) {
    throw new Error("Failed to fetch maintenance data");
  }
  // type unknown needs to be asserted before it can be used!
  const body = (await response.json()) as unknown;
  assertIsMaintenances(body);

  return {
    body,
    headers: response.headers,
  };
}

export function assertIsMaintenances(
  maintenanceData: unknown // declare parameter type as unknown
): asserts maintenanceData is MaintenanceData[] {
  //and assert before return
  if (!Array.isArray(maintenanceData)) {
    throw new Error("MaintenanceData is not array");
  }
  maintenanceData.forEach((maintenance) => {
    if (
      typeof maintenance.id !== "number" ||
      typeof maintenance.vehicle !== "string" ||
      typeof maintenance.maintenance_date !== "string" ||
      typeof maintenance.current_odo !== "string" ||
      typeof maintenance.next_odo !== "string" ||
      typeof maintenance.garage !== "string"
    ) {
      throw new Error("MaintenanceData is invalid");
    }

    // make sure that service is an array
    if (!Array.isArray(maintenance.service)) {
      throw new Error("MaintenanceData service is invalid");
    }
  });
}
