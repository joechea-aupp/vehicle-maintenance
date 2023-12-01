import { MenuData } from "../types/types";

export async function getMenu(param?: string) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL_SEARCH!}?${param}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search menu data");
  }

  const body = (await response.json()) as unknown;

  assertIsMenu(body);
  return body;
}

export function assertIsMenu(
  menuData: unknown
): asserts menuData is MenuData[] {
  if (!Array.isArray(menuData)) {
    throw new Error("MenuData is not array");
  }
  menuData.forEach((menu) => {
    if (
      typeof menu.id !== "number" ||
      typeof menu.name !== "string" ||
      typeof menu.path !== "string" ||
      typeof menu.description !== "string"
    ) {
      throw new Error("MenuData is invalid");
    }
  });
}
