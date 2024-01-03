import { TemplateData } from "../types/types";

export async function getTemplate() {
  const response = await fetch(`${process.env.REACT_APP_API_URL_TEMPL!}`);

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
    console.log(templateData);
    throw new Error("TemplateData is not array");
  }
  templateData.forEach((template) => {
    if (
      typeof template.id !== "number" ||
      typeof template.name !== "string" ||
      typeof template.description !== "string"
    ) {
      throw new Error("TemplateData is invalid");
    }
  });
}
