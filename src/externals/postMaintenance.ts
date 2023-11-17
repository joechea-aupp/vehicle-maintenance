import { MaintenancePost, SavedMaintenance } from "../types/types";

export default async function postMaintenance(newMaintenance: MaintenancePost) {
  const response = await fetch(process.env.REACT_APP_API_URL!, {
    method: "POST",
    body: JSON.stringify(newMaintenance),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = (await response.json()) as unknown;
  assertIsSavedMaintenance(body);
  return { ...newMaintenance, ...body };
}

function assertIsSavedMaintenance(
  maintenance: any
): asserts maintenance is SavedMaintenance {
  if (!("id" in maintenance)) throw new Error("Maintenance not saved");
  if (typeof maintenance.id !== "number")
    throw new Error("Maintenance not saved");
}
