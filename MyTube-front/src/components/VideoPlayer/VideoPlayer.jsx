import { useRef, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { authThunk } from "../../slices/authSlice";
import { Channel } from "../../App";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";

function VideoPlayer({ options }) {
  const dispatch = useDispatch();
  const { viewMode } = useContext(Channel);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const blockRef = useRef(null);
  const theaterRef = useRef(viewMode.changeTheater);

  const userTheaterMode = async (value) => {
    const formData = {};
    const infoData = {};

    formData.value = `${value}`;
    infoData.fetch = `/users/setTheaterMode`;
    infoData.path = "PATCH";

    const res = await dispatch(authThunk({ formData, infoData }));
    if (res.payload?.success === true) {
      viewMode.setChangeTheater(res.payload.theaterValue);
      console.log(res.payload.theaterValue);
    } else {
      viewMode.setChangeTheater(value);
      const parse = res.payload;
      console.log(parse);
    }
  };

  useEffect(() => {
    if (!playerRef.current) return;
    if (viewMode.changeTheater === "active" && window.innerWidth > 880) {
      playerRef.current.el().style.setProperty("height", "760px", "important");
    } else {
      playerRef.current.el().style.setProperty("height", "600px", "important");
    }
  }, [viewMode.changeTheater]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!playerRef.current) {
        const video = videoRef.current;
        if (!video) return;
        const player = (playerRef.current = videojs(
          videoRef.current,
          options,
          () => {
            const player = playerRef.current;

            player.on("play", () => {
              player.addClass("active-play");
              player.removeClass("active-pause");

              setTimeout(() => {
                player.removeClass("active-play");
              }, 300);
            });

            player.on("pause", () => {
              player.addClass("active-pause");
              player.removeClass("active-play");

              setTimeout(() => {
                player.removeClass("active-pause");
              }, 300);
            });

            player.ready(() => {
              player.userActive(true);
            });
          },
        ));

        const TheaterButton = videojs.getComponent("Button");

        class NewButton extends TheaterButton {
          constructor(player, options) {
            super(player, options);
            this.controlText("Modo Teatro");
            this.addClass("vjs-theater");

            this.el().innerHTML = `
              <i class="fa-solid fa-window-maximize"></i>
            `;

            this.el().addEventListener("click", () => {
              if (window.innerWidth < 880) return;
              if (theaterRef.current === "active") {
                userTheaterMode("desactive");
                theaterRef.current = "desactive";
              } else {
                userTheaterMode("active");
                theaterRef.current = "active";
              }
            });
          }
        }

        videojs.registerComponent("NewButton", NewButton);

        player.getChild("controlBar").addChild("NewButton", {});
        playerRef.current = player;
      }
    }, 0);

    return () => {
      clearTimeout(delay);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={blockRef} data-vjs-player>
      <video
        ref={videoRef}
        className="video-js"
        style={{
          height: viewMode.changeTheater === "active" ? "760px" : "600px",
        }}
      ></video>
    </div>
  );
}

export default VideoPlayer;
