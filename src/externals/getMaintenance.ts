import { MaintenanceData } from "../types/types";

// get data from endpoint, and assert the data is valid
export async function getMaintenance(search?: string) {
  search = search ? `?q=${search}` : "";
  const response = await fetch(`${process.env.REACT_APP_API_URL!}${search}`);

  if (!response.ok) {
    throw new Error("Failed to fetch maintenance data");
  }
  // type unknow need to be asserted before it can be use!
  const body = (await response.json()) as unknown;
  assertIsMaintenances(body);
  return body;
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
