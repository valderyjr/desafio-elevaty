import { ClientApiError } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchWrapper<T = unknown>(
  input: string | URL | Request,
  init?: RequestInit | undefined
): Promise<T | undefined> {
  const response = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 204) {
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = data as ClientApiError;
    throw new Error(error.message);
    return;
  }
  return data as T;
}
