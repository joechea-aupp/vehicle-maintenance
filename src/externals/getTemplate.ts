import { TemplateData } from "../types/types";

export async function getTemplate(templateId?: number) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL_TEMPL!}${
      templateId ? `/${templateId}` : ""
    }`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch template data");
  }

  const body = (await response.json()) as unknown;
  assertIsTemplate(body);
  return body;
}

export function assertIsTemplate(
  templateData: unknown
): asserts templateData is TemplateData[] {
  if (!Array.isArray(templateData)) {
    // check if templateData is type TemplateData
    if (typeof templateData !== "object") {
      throw new Error("TemplateData is not array");
    }
  }
}
