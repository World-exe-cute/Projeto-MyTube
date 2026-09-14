import { useRef } from "react";
import "./ChannelCopyright.css";
import { Link } from "react-router-dom";

//scripts
import ObserverBorderBottom from "../../../scripts/ObserverBorderBottom";

export default function ({ active, route }) {
  const customOptions = useRef(null);
  const path = "http://localhost:3000/myStudio/community";
  ObserverBorderBottom(customOptions, active);
  return (
    <div className="side-community">
      <div className="customize">
        <div>Mençoes aos conteudos utilizados</div>
      </div>
      <div ref={customOptions} className="customize-options">
        <div>
          <Link
            className={active === "comments" ? "active" : ""}
            to={`${path}/comments`}
          >
            Menções
          </Link>
        </div>
        <div></div>
      </div>
      {route}
    </div>
  );
}
