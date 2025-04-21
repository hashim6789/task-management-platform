import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib";
import { sampleTasks, sampleUsers } from "@/samples";
import { Task } from "@/types";
import React, { useState, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// Interfaces (based on previous artifacts)
interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  // const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(user, "user");

  // Redirect non-admins
  // useEffect(() => {
  //   if (!user || user.role !== "admin") {
  //     navigate("/user/dashboard");
  //   }
  // }, [user, navigate]);

  // Fetch users and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const [usersResponse, tasksResponse] = await Promise.all([
        //   axiosInstance.get<User[]>("/users"),
        //   axiosInstance.get<Task[]>("/tasks"),
        // ]);
        // setUsers(usersResponse.data);
        // setTasks(tasksResponse.data);
        setUsers(sampleUsers);
        setTasks(sampleTasks);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle block/unblock user
  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const action = isBlocked ? "unblock" : "block";
      await api.post(`/users/${userId}/${action}`);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isBlocked: !isBlocked } : u
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isBlocked ? "unblock" : "block"} user`
      );
    }
  };

  // Calculate task metrics
  const taskMetrics = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Active Tasks</h2>
          <p className="text-3xl font-bold text-blue-600">
            {taskMetrics.total - taskMetrics.completed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Completed Tasks
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {taskMetrics.completed}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User Management
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-gray-700">Username</th>
                <th className="p-3 text-gray-700">Email</th>
                <th className="p-3 text-gray-700">Role</th>
                <th className="p-3 text-gray-700">Status</th>
                <th className="p-3 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleUserBlock(user._id, user.isBlocked)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        user.isBlocked
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Tasks Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-blue-600">
              {taskMetrics.pending}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {taskMetrics.inProgress}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600">
              {taskMetrics.completed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
