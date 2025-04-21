import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/pages/dashboardA";
import { Layout, TaskManagement, TasksPage } from "@/pages";

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
