import Layout from "@/modules/user/layout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/modules/user/dashboard";
import TasksPage from "@/modules/user/task-page";

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
              { path: "management", element: <TasksPage role="user" /> },
            ],
          },
        ],
      },
    ],
  },
];
