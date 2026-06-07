import API from "../../config/api.js";

const API_URL = API;

export async function apiFetch(endpoint, options = {}) {

  const isFormData =
    options.body instanceof FormData;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method: options.method || "GET",

      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                "application/json"
            }),

        ...(options.headers || {})
      },

      body: options.body || null
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Error API"
    );
  }

  return data;
}

export const apiGet = (url) =>
  apiFetch(url);

export const apiPost = (
  url,
  body
) =>
  apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  });

export const apiPut = (
  url,
  body
) =>
  apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const apiDelete = (
  url
) =>
  apiFetch(url, {
    method: "DELETE"
  });