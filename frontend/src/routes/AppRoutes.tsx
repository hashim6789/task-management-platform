import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
// import { ServerErrorPage } from "../modules/shared/Error";
// import LoginPage from "../modules/auth/pages/Login";
import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";
import { RootState } from "../store";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { fetchMe } from "@/store/thunks";
import {
  LoginPage,
  NotFoundPage,
  ServerErrorPage,
  UserBlockedPage,
} from "@/pages";

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  const { user } = useSelector((state: RootState) => state.auth);

  const routes = [
    ...AdminRoutes(),
    ...UserRoutes(),
    {
      path: "/login",
      element: user ? (
        <Navigate to={`/${user.role}/dashboard`} />
      ) : (
        <LoginPage />
      ),
    },
    {
      path: "/",
      element: user ? (
        <Navigate to={`/${user.role}/dashboard`} />
      ) : (
        <LoginPage />
      ),
    },

    {
      path: "/blocked",
      element: <UserBlockedPage />,
    },
    {
      path: "/500",
      element: <ServerErrorPage />,
    },
    { path: "*", element: <NotFoundPage /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
