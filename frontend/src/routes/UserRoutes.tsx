import Layout from "@/modules/user/layout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/modules/user/dashboard";
import { TasksPage } from "@/pages/tasks-page";
import { TaskManagement } from "@/modules/user/task-management";

export const UserRoutes = () => [
  {
    path: "/user",
    children: [
      {
        element: <ProtectedRoute role="user" />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "tasks", element: <TasksPage role="user" /> },
              { path: "management", element: <TaskManagement role="user" /> },
            ],
          },
        ],
      },
    ],
  },
];
