import { API_URL }
from "../config/config.js";

export async function apiFetch(
  endpoint,
  options = {}
) {

  const token =
    localStorage.getItem(
      "token"
    );

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {

        ...options,

        headers: {

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {})
        }
      }
    );

  return await response.json();
}