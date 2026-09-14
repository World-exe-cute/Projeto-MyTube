import { Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Channel } from "../App";

export default function PrivateRouter({ child, token }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { load } = useContext(Channel);
  const [authorized, setAuthorized] = useState(null);

  const checkUser = async () => {
    const formData = {};
    const infoData = {};

    infoData.fetch = `/users/privateRoute`;
    infoData.path = "GET";

    const percentUp = setInterval(() => {
      load.setLoad((e) => {
        if (e >= 80) {
          return e;
        } else {
          return e + 1;
        }
      });
    }, 5);

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setAuthorized(true);
      clearInterval(percentUp);
      load.setLoad(100);
    } else {
      setAuthorized(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (authorized === false) {
    navigate("/login");
  }

  return child;
}
