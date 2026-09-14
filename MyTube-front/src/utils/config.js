export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  if (image) {
    config = {
      method,
      credentials: "include",
      body: data,
      headers: {},
    };
  } else if (method === "DELETE" || method === "GET") {
    config = {
      method,
      credentials: "include",
      headers: {},
    };
  } else {
    config = {
      method,
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return config;
};
