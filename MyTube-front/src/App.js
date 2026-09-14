import "./App.css";

//Router
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { useEffect, useState, createContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "./slices/authSlice";

//Components
import Navbar from "./components/Navbar/Navbar";

//Pages
import Home from "./pages/Home/Home";

import HomeNav from "./pages/HomeNav/HomeNav";
import RouterView from "./routes/RouterView";
import RouteNavbar from "./routes/RouteNavbar";
import RouteStudio from "./routes/RouteStudio";
import RouteAuth from "./routes/RouteAuth";
import ProvidersSendVideo from "./providers/ProvidersSendVideo";

export const Channel = createContext({});

function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const HideNavbar = ["/login", "/register"];
  const ChannelConfig = location.pathname;

  const [globalOption, setGlobalOption] = useState(false);
  const [width, setWidth] = useState({
    winWidth: window.innerWidth,
  });
  const hiddenContainer = useRef(null);
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState(false);
  const [videoInfo, setVideoInfo] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const [tagInfo, setTagInfo] = useState([
    "mundo",
    "animais",
    "oceano",
    "arvores",
    "adult",
    "gato",
    "cachorro",
    "passaros",
    "comida",
    "esportes",
    "montanhas",
    "rios",
    "flores",
    "deserto",
    "estradas",
    "pessoas",
    "cachoeira",
  ]);
  const [load, setLoad] = useState(100);
  const [darkMode, setDarkMode] = useState(
    sessionStorage.getItem("theme") || "white",
  );
  const [changeTheater, setChangeTheater] = useState(
    sessionStorage.getItem("viewTheater") || false,
  );
  const urlRef = useRef(location.pathname.split("/")[3]);

  useEffect(() => {
    if (
      location.pathname.split("/")[1] === "myStudio" ||
      location.pathname.split("/")[1] === "login" ||
      location.pathname.split("/")[1] === "register"
    ) {
      document.documentElement.style.setProperty("--view-mode", "#282828");
      document.documentElement.style.setProperty(
        "--view-mode-shadow",
        "#272727",
      );
      document.documentElement.style.setProperty("--view-mode-color", "white");
    } else if (darkMode === "dark" || tokenInfo.viewMode === "dark") {
      document.documentElement.style.setProperty("--view-mode", "#0f0f0f");
      document.documentElement.style.setProperty(
        "--view-mode-shadow",
        "#272727",
      );
      document.documentElement.style.setProperty("--view-mode-color", "white");
    } else {
      document.documentElement.style.setProperty("--view-mode", "#e9e9e9");
      document.documentElement.style.setProperty(
        "--view-mode-shadow",
        "#dadada",
      );
      document.documentElement.style.setProperty("--view-mode-color", "black");
    }
  }, [darkMode, location]);

  useEffect(() => {
    sessionStorage.setItem("theme", darkMode);
  }, [darkMode]);

  useEffect(() => {
    sessionStorage.setItem("viewTheater", changeTheater);
  }, [changeTheater]);

  useEffect(() => {
    urlRef.current = location.pathname.split("/")[3];
    setMoreOption(false);
    setFocus(false);
  }, [location.pathname]);

  useEffect(() => {
    if (tokenInfo) {
      setDarkMode(tokenInfo.viewMode);
      setChangeTheater(tokenInfo.theater);
      setTagInfo(tokenInfo.tags);
    }
  }, [tokenInfo]);

  useEffect(() => {
    if (location.pathname.split("/")[1] === "videoView") {
      document.documentElement.style.setProperty("--option-width", "215px");
    } else if (width.winWidth >= 1180) {
      document.documentElement.style.setProperty(
        "--option-width",
        `${globalOption ? "0px" : "215px"}`,
      );
    }
    return;
  }, [globalOption, location]);

  useEffect(() => {
    checkLogged();
    const resizeWindow = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
      document.documentElement.style.setProperty(
        "--vw",
        `${window.innerWidth * 0.01}px`,
      );
    };

    function widthAtt() {
      setWidth({ winWidth: window.innerWidth });
    }

    resizeWindow();

    window.addEventListener("resize", resizeWindow);

    window.addEventListener("resize", widthAtt);

    return () => {
      window.removeEventListener("resize", resizeWindow);
      window.removeEventListener("resize", widthAtt);
    };
  }, []);

  const showOption = (click) => {
    setTimeout(() => {
      if (urlRef.current !== "posts") {
        if (click === "show") {
          hiddenContainer.current.classList.add("show");
          setFocus(true);
          hiddenContainer.current.focus();
        } else {
          hiddenContainer.current.classList.remove("show");
          setFocus(false);
          hiddenContainer.current.blur();
          setStep(1);
        }
      }
    }, 5);
  };

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Home
          route={<HomeNav global={global} />}
          global={globalOption}
          width={width}
        />
      ),
    },
    ...RouteAuth(),
    ...RouteNavbar(globalOption, width),
    ...RouterView(globalOption, width),
    ...RouteStudio(globalOption, width),
  ]);

  const checkLogged = async () => {
    const formData = {};
    const infoData = {};
    infoData.path = "GET";
    infoData.fetch = "/users/check-token";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      setIsLogged(true);
      setTokenInfo(res.payload.userInfo);
    } else if (res.payload?.success === false) {
      setIsLogged(false);
    } else {
      const parse = res.payload;
      console.log(parse);
    }
  };

  return (
    <div
      id="blocker"
      className={ChannelConfig.includes("myStudio") ? "channel" : ""}
    >
      <Channel.Provider
        value={{
          hiddenContainer,
          showOption,
          widthInfo: width,
          stepOption: { step, setStep },
          focusOption: { focus, setFocus },
          clickOption: { moreOption, setMoreOption },
          setVideoInfo: setVideoInfo,
          userLogged: isLogged,
          tokenInfo: tokenInfo,
          tagInfo: { tagInfo, setTagInfo },
          load: { load, setLoad },
          viewMode: { darkMode, setDarkMode, changeTheater, setChangeTheater },
        }}
      >
        {!HideNavbar.includes(ChannelConfig) && (
          <>
            {!ChannelConfig.includes("myStudio") ? (
              <Navbar global={[globalOption, setGlobalOption]} width={width} />
            ) : (
              <Navbar
                global={[globalOption, setGlobalOption]}
                width={width}
                channel={true}
              />
            )}
          </>
        )}

        <ProvidersSendVideo videoInfo={videoInfo} />

        {routes}
      </Channel.Provider>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/MyTube">
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
