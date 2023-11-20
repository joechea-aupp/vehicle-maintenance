import { MaintenanceID, deletedMaintenance } from "../types/types";
export default async function delMaintenance(Id: MaintenanceID) {
  const response = await fetch(`${process.env.REACT_APP_API_URL!}/${Id}`, {
    method: "DELETE",
    // body: JSON.stringify(Id),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = (await response.json()) as unknown;
  assertIsMaintenanceID(body);
  return "Maintenance deleted";
}

function assertIsMaintenanceID(
  maintenance: any
): asserts maintenance is deletedMaintenance {
  // if maintenance object is not empty, throw error
  if (Object.keys(maintenance).length !== 0)
    throw new Error("Maintenance not deleted");
}
