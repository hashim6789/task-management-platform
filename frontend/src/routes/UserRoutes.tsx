import ProtectedRoute from "./ProtectedRoute";
import { AnalyticsDashboard, Layout, TaskManagement, TasksPage } from "@/pages";

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
              { path: "dashboard", element: <AnalyticsDashboard /> },
              { path: "tasks", element: <TasksPage role="user" /> },
              { path: "management", element: <TaskManagement role="user" /> },
            ],
          },
        ],
      },
    ],
  },
];
