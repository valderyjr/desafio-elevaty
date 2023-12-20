import { ZipCodeApiResponse } from "../../utils/types";

const BASE_URL_ZIP_CODE_API = "https://viacep.com.br/ws";

export async function fetchZipCode(
  zipCode: string
): Promise<[null, true] | [ZipCodeApiResponse, false]> {
  try {
    const response = await fetch(`${BASE_URL_ZIP_CODE_API}/${zipCode}/json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [null, true];
    }

    const data = await response.json();

    if (data?.erro) {
      return [null, true];
    }

    return [data as ZipCodeApiResponse, false];
  } catch (error) {
    return [null, true];
  }
}
