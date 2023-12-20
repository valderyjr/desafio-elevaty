import { ClientApiError } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchWrapper<T = unknown>(
  input: string | URL | Request,
  init?: RequestInit | undefined,
  isPdf?: boolean
): Promise<T | undefined> {
  const headers = init?.headers
    ? init.headers
    : {
        "Content-Type": "application/json",
      };

  const response = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers,
  });

  if (response.status === 204) {
    return;
  }

  if (!response.ok) {
    const error = (await response.json()) as ClientApiError;
    throw new Error(error.message);
    return;
  }

  if (isPdf) {
    const data = await response.blob();
    return data as T;
  }

  const data = await response.json();

  return data as T;
}
