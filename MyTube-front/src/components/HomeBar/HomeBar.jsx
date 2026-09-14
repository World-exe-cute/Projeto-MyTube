import { OptionsLinks } from "../Navbar/NavbarComponents/subComponents/OptionsComponents";
import Options from "../Navbar/NavbarComponents/Options";
import { Channel } from "../../App";
import { useContext } from "react";

export default function HomeBar({ global, width }) {
  const { tokenInfo } = useContext(Channel);
  return (
    <>
      {width.winWidth <= 1180 && (
        <>
          <OptionsLinks
            text="Início"
            viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
            css="fa-solid fa-house"
            link={`/`}
          />
          <OptionsLinks
            text="Inscrições"
            viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
            css="fa-brands fa-square-youtube"
            link={`/user/inscriptions`}
          />
          <OptionsLinks
            text="Você"
            viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
            css="fa-solid fa-user"
            link={
              tokenInfo.idTag ? `/profile/videos/${tokenInfo.idTag}` : "/login"
            }
          />
        </>
      )}
      {width.winWidth >= 1179 && (
        <>
          {global === false && (
            <>
              <Options />
            </>
          )}
          {global === true && (
            <>
              <OptionsLinks
                text="Início"
                viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
                css="fa-solid fa-house"
                link={`/`}
              />
              <OptionsLinks
                text="Inscrições"
                viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
                css="fa-brands fa-square-youtube"
                link={`/user/inscriptions`}
              />
              <OptionsLinks
                text="Você"
                viewCss={tokenInfo.viewMode === "dark" ? "dark" : "white"}
                css="fa-solid fa-user"
                link={`/profile/videos/${tokenInfo.idTag}`}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
