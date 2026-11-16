/** Express 5 may deliver route params as `string | string[]` — normalize them. */
export function firstParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
