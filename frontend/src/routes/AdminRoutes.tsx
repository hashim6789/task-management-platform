import ProtectedRoute from "./ProtectedRoute";
import Layout from "@/modules/admin/layout";
import AdminDashboard from "@/modules/admin/dashboard";
import { UsersPage } from "@/pages/users-page";
import { TasksPage } from "@/pages/tasks-page";

export const AdminRoutes = () => [
  {
    path: "/admin",
    children: [
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "users", element: <UsersPage /> },
              { path: "tasks", element: <TasksPage /> },
            ],
          },
        ],
      },
    ],
  },
];
