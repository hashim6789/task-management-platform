import {
  AnalyticsDashboard,
  Layout,
  TaskManagement,
  TasksPage,
  UsersPage,
} from "@/pages";
import ProtectedRoute from "./ProtectedRoute";

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
              { path: "dashboard", element: <AnalyticsDashboard /> },
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
