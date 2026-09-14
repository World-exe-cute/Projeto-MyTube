import { useRef } from "react";
import "./ChannelAnalytics.css";
import { Link } from "react-router-dom";

export default function ChannelAnalytics({ active, route }) {
  const customOptions = useRef(null);
  const path = "http://localhost:3000/myStudio/analytics";

  return (
    <div className="side-analytics">
      <div className="analytics">
        <div>Estatísticas do canal</div>
      </div>
      <div ref={customOptions} className="analytics-options">
        <div>
          <Link
            className={active === "overview" ? "active" : ""}
            to={`${path}/overview`}
          >
            Visao geral
          </Link>
        </div>
        <div></div>
      </div>
      {route}
    </div>
  );
}
