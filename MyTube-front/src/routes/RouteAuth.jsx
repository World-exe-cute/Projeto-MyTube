//components
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

export default function RouteAuth() {
  return [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];
}
