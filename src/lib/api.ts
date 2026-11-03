const CS_SERVER_URL = process.env.CS_API_URL || "http://localhost:5000";

// server calls express directly, browser goes through the next proxy
export const cs_apiUrl = (path: string) =>
  typeof window === "undefined" ? `${CS_SERVER_URL}/api${path}` : `/api${path}`;

const cs_request = (path: string, init: RequestInit) =>
  fetch(cs_apiUrl(path), {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

// fetch helper
export async function cs_apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let cs_res = await cs_request(path, init);

  // refresh an expired jwt once, then retry
  if (cs_res.status === 401 && typeof window !== "undefined" && path !== "/jwt") {
    const cs_refreshed = await fetch("/api/jwt", { method: "POST", credentials: "include" });
    if (cs_refreshed.ok) cs_res = await cs_request(path, init);
  }

  const cs_data = await cs_res.json().catch(() => null);
  if (!cs_res.ok) {
    throw new Error(cs_data?.message || "Something went wrong. Please try again.");
  }
  return cs_data as T;
}
