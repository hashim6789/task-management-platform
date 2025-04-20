import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "@/modules/admin/dashboard";
import { UsersPage } from "@/pages/users-page";
import { TasksPage } from "@/pages/tasks-page";
import Layout from "@/modules/user/layout";

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
