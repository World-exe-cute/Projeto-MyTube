//utils
import PrivateRouter from "../utils/PrivateRouter";

//components

import VideoView from "../pages/View/VideoView";
import VideoHistory from "../pages/View/VideoHistory";
import Home from "../pages/Home/Home";
import VideoLike from "../pages/View/VideoLike";
import VideoInscriptions from "../pages/View/VideoInscriptions";
import VideoChannels from "../pages/View/VideoChannels";
import VideoSearch from "../pages/View/VideoSearch";
import Feedback from "../pages/View/Feedback";

export default function RouterView(globalOption, width) {
  return [
    {
      path: "/videoView/:id",
      element: <VideoView />,
    },
    {
      path: "/user/history",
      element: (
        <PrivateRouter
          child={
            <Home
              route={<VideoHistory />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/user/likes",
      element: (
        <PrivateRouter
          child={
            <Home route={<VideoLike />} global={globalOption} width={width} />
          }
        />
      ),
    },
    {
      path: "/user/inscriptions",
      element: (
        <PrivateRouter
          child={
            <Home
              route={<VideoInscriptions />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/user/channels",
      element: (
        <PrivateRouter
          child={
            <Home
              route={<VideoChannels />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/search/:id",
      element: (
        <Home route={<VideoSearch />} global={globalOption} width={width} />
      ),
    },
    {
      path: "/feedback",
      element: (
        <Home route={<Feedback />} global={globalOption} width={width} />
      ),
    },
  ];
}
