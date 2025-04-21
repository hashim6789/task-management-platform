import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
// import { ServerErrorPage } from "../modules/shared/Error";
// import LoginPage from "../modules/auth/pages/Login";
import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";
import { RootState } from "../store";
import { LoginForm } from "../components/auth/login-form";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hiook";
import { fetchMe } from "@/store/thunks";

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
        <LoginForm />
      ),
    },
    {
      path: "/",
      element: user ? (
        <Navigate to={`/${user.role}/dashboard`} />
      ) : (
        <LoginForm />
      ),
    },

    // {
    //   path: "/500",
    //   element: <ServerErrorPage role="admin" theme={"light"} />,
    // },
    // { path: "*", element: <NotFoundPage role={user} theme={"light"} /> },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
