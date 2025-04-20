import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "@/modules/admin/dashboard";
import { UsersPage } from "@/pages/users-page";
import Layout from "@/modules/user/layout";
// import TaskManagement from "@/modules/user/task-management";
import { TasksPage } from "@/pages/tasks-page";
import { TaskManagement } from "@/modules/user/task-management";

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
              { path: "tasks", element: <TasksPage role="admin" /> },
              { path: "management", element: <TaskManagement role="admin" /> },
            ],
          },
        ],
      },
    ],
  },
];
