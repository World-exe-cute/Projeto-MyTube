import "./ChannelCommunity.css";
import { Link } from "react-router-dom";
import { useRef, createContext, useState } from "react";

//scripts
import ObserverBorderBottom from "../../../scripts/ObserverBorderBottom";

export const CommunityContext = createContext();

export default function ChannelCommunity({ active, route }) {
  const customOptions = useRef(null);
  const [activeDelete, setActiveDelete] = useState([]);
  const path = "http://localhost:3000/myStudio/community";
  ObserverBorderBottom(customOptions, active);

  return (
    <CommunityContext.Provider value={{ activeDelete, setActiveDelete }}>
      <div className="side-community">
        <div className="customize">
          <div>Personalização do canal</div>
        </div>
        <div ref={customOptions} className="customize-options">
          <div>
            <Link
              className={active === "comments" ? "active" : ""}
              to={`${path}/comments`}
            >
              Comments
            </Link>
            <Link
              className={active === "mentions" ? "active" : ""}
              to={`${path}/mentions`}
            >
              Menções
            </Link>
          </div>
          <div></div>
        </div>
        {route}
      </div>
    </CommunityContext.Provider>
  );
}
