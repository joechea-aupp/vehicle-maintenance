import { GarageData } from "../types/types";
export async function getGarage() {
  const response = await fetch(`${process.env.REACT_APP_API_URL_GAR!}`);
  console.log(process.env.REACT_APP_API_URL_GAR!);
  if (!response.ok) {
    throw new Error("Failed to fetch garage data");
  }

  const body = (await response.json()) as unknown;
  assertIsGarage(body);
  return body;
}

export function assertIsGarage(
  garageData: unknown
): asserts garageData is GarageData[] {
  if (!Array.isArray(garageData)) {
    throw new Error("GarageData is not array");
  }
  garageData.forEach((garage) => {
    if (
      typeof garage.id !== "number" ||
      typeof garage.name !== "string" ||
      typeof garage.address !== "string" ||
      typeof garage.phone !== "string"
    ) {
      throw new Error("GarageData is invalid");
    }
  });
}
