const CS_SERVER_URL = process.env.CS_API_URL || "http://localhost:5000";

// server calls express directly, browser goes through the next proxy
export const cs_apiUrl = (path: string) =>
  typeof window === "undefined" ? `${CS_SERVER_URL}/api${path}` : `/api${path}`;

// fetch helper
export async function cs_apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cs_res = await fetch(cs_apiUrl(path), {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const cs_data = await cs_res.json().catch(() => null);
  if (!cs_res.ok) {
    throw new Error(cs_data?.message || "Something went wrong. Please try again.");
  }
  return cs_data as T;
}
