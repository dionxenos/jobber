import { createBrowserRouter } from "react-router-dom";
import Home from "../layout/HomePage";
import Login from "../../features/account/LoginPage";
import App from "../layout/App";
import ErrorPage from "../error/Error";
import AccountPage from "../../features/account/AccountPage";
import About from "../../features/about/About";
import RequireAuth from "./RequireAuth";
import User from "../../features/user/User";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "/account", element: <AccountPage /> },
          {
            path: "/users",
            element: <User />,
            children: [{ path: ":id", element: <User /> }],
          },
        ],
      },
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);
