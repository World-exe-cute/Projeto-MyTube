import "./Home.css";

//Components
import { Channel } from "../../App";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import ContainerMove from "../../components/ArrowList/ContainerMove";
import HomeBar from "../../components/HomeBar/HomeBar";

const Home = ({ route, global, width }) => {
  const location = useLocation();
  const { viewMode } = useContext(Channel);

  return (
    <nav>
      <main className={viewMode.darkMode === "dark" ? "dark" : "white"}>
        <div
          id="options-start"
          className={location.pathname === "/user/likes" ? "transparent" : ""}
        >
          <HomeBar global={global} width={width} />
        </div>
        <div className={`main-feed ${global ? "active" : ""}`}>
          <div className={`${route.type.name !== "HomeNav" ? "none" : ""}`}>
            {route.type.name === "HomeNav" && <ContainerMove num={-2} />}
          </div>
          {route}
        </div>
      </main>
    </nav>
  );
};

export default Home;
