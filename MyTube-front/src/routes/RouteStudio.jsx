//pages
import ChannelRoute from "../pages/Channel/ChannelRoute";
import ChannelNav from "../pages/Channel/SubChannel/ChannelNav";
import ChannelPanel from "../pages/Channel/SubChannel/ChannelPanel";
import ChannelAnalytics from "../pages/Channel/SubChannel/ChannelAnalytics";
import ChannelCommunity from "../pages/Channel/SubChannel/ChannelCommunity";
import ChannelCopyright from "../pages/Channel/SubChannel/ChannelCopyright";
import ChannelCustomize from "../pages/Channel/SubChannel/ChannelCustomize";
import CustomizeProfile from "../pages/Channel/SubChannel/SubChannelRoute/CustomizeProfile";
import PrivateRouter from "../utils/PrivateRouter";
import AnalyticsOverview from "../pages/Channel/SubChannel/SubChannelRoute/AnalyticsOverview";
import ChannelVideos from "../pages/Channel/SubChannel/SubChannelRoute/ChannelVideos";
import CommunityComments from "../pages/Channel/SubChannel/SubChannelRoute/CommunityComments";
import ChannelPosts from "../pages/Channel/SubChannel/SubChannelRoute/ChannelPosts";
import CommunityMentions from "../pages/Channel/SubChannel/SubChannelRoute/CommunityMentions";
import CopyrightHistory from "../pages/Channel/SubChannel/SubChannelRoute/CopyrightHistory";
import ChannelPostEdit from "../pages/Channel/SubChannel/SubChannelRoute/ChannelPostEdit";

export default function RouteStudio(globalOption, width) {
  return [
    {
      path: "/myStudio/panel",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelPanel />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/channel/videos",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelNav active="videos" route={<ChannelVideos />} />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/channel/posts",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelNav active="posts" route={<ChannelPosts />} />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/channel/posts/:id",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelNav active="posts" route={<ChannelPostEdit />} />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/analytics/overview",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={
                <ChannelAnalytics
                  active="overview"
                  route={<AnalyticsOverview channelView={28} />}
                />
              }
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/community/comments",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={
                <ChannelCommunity
                  active="comments"
                  route={<CommunityComments />}
                />
              }
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/community/mentions",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={
                <ChannelCommunity
                  active="mentions"
                  route={<CommunityMentions />}
                />
              }
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/copyright/history",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={
                <ChannelCopyright
                  active="history"
                  route={<CopyrightHistory />}
                />
              }
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/customize/profile",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={
                <ChannelCustomize
                  active="profile"
                  route={<CustomizeProfile />}
                />
              }
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/channel/videos/search/:id",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelNav active="videos" route={<ChannelVideos />} />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
    {
      path: "/myStudio/channel/posts/search/:id",
      element: (
        <PrivateRouter
          child={
            <ChannelRoute
              route={<ChannelNav active="posts" route={<ChannelPosts />} />}
              global={globalOption}
              width={width}
            />
          }
        />
      ),
    },
  ];
}
