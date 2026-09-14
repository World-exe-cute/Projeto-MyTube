import { api, requestConfig } from "../utils/config";

const fetchUser = async (data, info) => {
  const config = requestConfig(info.path, data, info?.token, info?.image);

  try {
    const path = `${info.fetch}`;
    const response = await fetch(api + path, config);

    const res = await response.json();

    if (!response.ok) {
      if (response.statusText.includes("Unauthorized")) {
        throw new Error("usuario nao autorizado."); //false?
      }
    }

    if (res) {
      return res;
    }
  } catch (error) {
    return error.message;
  }
};

const authService = {
  fetchUser,
};

export default authService;
