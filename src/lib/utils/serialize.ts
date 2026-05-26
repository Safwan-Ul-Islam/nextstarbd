type AnyTimestamp =
  | { toDate(): Date }
  | { seconds: number; nanoseconds: number }
  | { _seconds: number; _nanoseconds: number };

function isAdminTimestamp(v: unknown): v is { _seconds: number; _nanoseconds: number } {
  return typeof v === "object" && v !== null && "_seconds" in v;
}

function isClientTimestamp(v: unknown): v is { seconds: number; nanoseconds: number } {
  return typeof v === "object" && v !== null && "seconds" in v && "nanoseconds" in v && !("_seconds" in v);
}

// Recursively convert Admin SDK Timestamp instances to plain {seconds, nanoseconds}
export function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (isAdminTimestamp(data)) {
    return { seconds: data._seconds, nanoseconds: data._nanoseconds } as unknown as T;
  }
  if (isClientTimestamp(data)) return data;
  if (Array.isArray(data)) return data.map(serialize) as unknown as T;
  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([k, v]) => [k, serialize(v)])
    ) as T;
  }
  return data;
}
