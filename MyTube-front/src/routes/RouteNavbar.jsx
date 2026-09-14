import { useLocation } from "react-router-dom";

//utils
import PrivateRouter from "../utils/PrivateRouter";

//components
import UserProfile from "../pages/UserProfile/UserProfile";
import Logout from "../utils/Logout";
import Home from "../pages/Home/Home";
import CommentPost from "../components/Posts/SubPosts/CommentPost";

export default function RouteNavbar(globalOption, width) {
  return [
    {
      path: "/profile/videos/:user",
      element: (
        <Home route={<UserProfile />} global={globalOption} width={width} />
      ),
    },
    {
      path: "/profile/posts/:user",
      element: (
        <Home route={<UserProfile />} global={globalOption} width={width} />
      ),
    },
    {
      path: "/profile/posts/:user/:id",
      element: (
        <Home route={<CommentPost />} global={globalOption} width={width} />
      ),
    },
    {
      path: "/exit",
      element: <Logout />,
    },
  ];
}
