import { createBrowserRouter } from "react-router-dom";
import Home from "../layout/HomePage";
import Login from "../../features/account/LoginPage";
import RegisterPage from "../../features/account/RegisterPage";
import App from "../layout/App";
import ErrorPage from "../error/Error";
import ProfileEditPage from "../../features/account/ProfileEditPage";
import About from "../../features/about/About";
import RequireAuth from "./RequireAuth";
import User from "../../features/user/User";
import CvPage from "../../features/cv/CvPage";
import JobsPage from "../../features/jobs/JobsPage";
import JobEditPage from "../../features/jobs/JobEditPage";
import RecruitPage from "../../features/jobs/RecruitPage";
import InvitesPage from "../../features/interviews/InvitesPage";
import SearchPage from "../../features/search/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "/profile/edit", element: <ProfileEditPage /> },
          { path: "/cv", element: <CvPage /> },
          { path: "/jobs", element: <JobsPage /> },
          { path: "/jobs/:id/edit", element: <JobEditPage /> },
          { path: "/jobs/:id/recruit", element: <RecruitPage /> },
          { path: "/invites", element: <InvitesPage /> },
          { path: "/users/:id", element: <User /> },
          { path: "/search", element: <SearchPage /> },
        ],
      },
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <RegisterPage /> },
      { path: "about", element: <About /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);
