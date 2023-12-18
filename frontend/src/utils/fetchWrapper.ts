const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchWrapper<T = unknown>(
  input: string | URL | Request,
  init?: RequestInit | undefined
): Promise<T | void> {
  const response = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 204) {
    return;
  }

  const data = await response.json();
  return data as T;
}
