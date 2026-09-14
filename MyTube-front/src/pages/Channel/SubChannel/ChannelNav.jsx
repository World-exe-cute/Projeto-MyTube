import "./ChannelNav.css";
import { Link } from "react-router-dom";
import { useRef } from "react";
import ObserverBorderBottom from "../../../scripts/ObserverBorderBottom";
import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../../slices/authSlice";
export const NavContext = createContext({});

export default function ChannelNav({ active, route }) {
  const dispatch = useDispatch();
  const [activeDelete, setActiveDelete] = useState([]);
  const customOptions = useRef(null);
  const path = "http://localhost:3000/myStudio/channel";

  const deleteVideos = async () => {
    const formData = { videosHash: activeDelete };
    const infoData = {};

    infoData.fetch = "/videos/deleteVideos";
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      window.location.reload();
    } else {
      const parse = res.payload;
      console.log(parse[0].msg);
    }
  };

  const deletePosts = async () => {
    const formData = { postId: activeDelete };
    const infoData = {};

    infoData.fetch = "/posts/deletePosts";
    infoData.path = "POST";

    const res = await dispatch(authThunk({ formData, infoData }));

    if (res.payload?.success === true) {
      window.location.reload();
    } else {
      const parse = res.payload;
      console.log(parse[0].msg);
    }
  };

  ObserverBorderBottom(customOptions, active);
  return (
    <NavContext.Provider value={{ activeDelete, setActiveDelete }}>
      <div className="navbar-channel">
        <div className="customize">
          <div>Conteúdo do canal</div>
        </div>
        <div ref={customOptions} className="customize-options">
          <div>
            <Link
              className={active === "videos" ? "active" : ""}
              to={`${path}/videos`}
            >
              Videos
            </Link>

            <Link
              className={active === "posts" ? "active" : ""}
              to={`${path}/posts`}
            >
              Postagens
            </Link>
          </div>
          <div
            className={`remove-option ${activeDelete.length !== 0 ? "active" : ""}`}
            onClick={() => {
              if (active === "videos") {
                deleteVideos();
              } else if (active === "posts") {
                deletePosts();
              }
            }}
          >
            <div>Remover</div>
          </div>
        </div>
        {route}
      </div>
    </NavContext.Provider>
  );
}
