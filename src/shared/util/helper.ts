import Ajv from "ajv/dist/jtd";

export function tryCatch<T>(fn: () => T, defaultValue: T|null = null): T | null {
  try {
    return fn();
  } catch (error) {
    return defaultValue;
  }
}

export function isUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

export function ajvInstance() {
  let ajv: Ajv | null = null;

  if (!ajv) {
    ajv = new Ajv();
  }

  return ajv;
}