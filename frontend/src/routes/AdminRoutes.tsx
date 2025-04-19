import { Navigate } from "react-router-dom";
import { Role } from "../types";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "@/modules/admin/layout";
import AdminDashboard from "@/modules/admin/dashboard";

export const AdminRoutes = (isAuthenticated: boolean, currentRole: Role) => [
  {
    path: "/admin/login",
    element: isAuthenticated ? (
      <Navigate to={`/${currentRole}/dashboard`} />
    ) : (
      <Navigate to={`/login`} />
    ),
    children: [],
  },
  {
    path: "/admin",
    children: [
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          {
            element: <Layout />,
            children: [{ path: "dashboard", element: <AdminDashboard /> }],
          },
        ],
      },
    ],
  },
];
