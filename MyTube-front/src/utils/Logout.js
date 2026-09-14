import { useDispatch } from "react-redux";
import { authThunk } from "../slices/authSlice";
import { useEffect } from "react";

export default function Logout({}) {
  const dispatch = useDispatch();
  useEffect(() => {
    logoutFunction();
  }, []);
  const logoutFunction = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = "/users/logout";
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      localStorage.clear();
      console.log("usuario deslogado com sucesso");
      setTimeout(() => {
        return (window.location.href = "/");
      }, 50);
    } else {
      const parse = JSON.parse(res.payload);
      console.log(parse);
    }
  };
}
