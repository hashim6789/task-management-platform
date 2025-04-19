import React from "react";
import { useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
// import { ServerErrorPage } from "../modules/shared/Error";
// import LoginPage from "../modules/auth/pages/Login";
import { AdminRoutes } from "./AdminRoutes";
import { UserRoutes } from "./UserRoutes";
import { RootState } from "../store/store";
import { LoginForm } from "../components/auth/login-form";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hiook";
import { fetchMe } from "@/store/thunks";

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  //   const {} = useSelector((state: RootState) => state.theme);

  const routes = [
    ...AdminRoutes(isAuthenticated, user ? user.role : "user"),
    ...UserRoutes(isAuthenticated, user ? user.role : "user"),
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/",
      element: <LoginForm />,
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
