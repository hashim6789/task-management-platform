import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

// Interfaces (from previous artifacts)
interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string; // User ID
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]); // For admin reassign
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<{
    search: string;
    status: "all" | "pending" | "in-progress" | "completed";
    assignedTo: "all" | string; // User ID
  }>({ search: "", status: "all", assignedTo: "all" });
  const [sort, setSort] = useState<{
    field: keyof Task;
    order: "asc" | "desc";
  }>({
    field: "title",
    order: "asc",
  });
  const [view, setView] = useState<"card" | "list">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks and users (for admins)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sort.field,
        order: sort.order,
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.assignedTo !== "all" && { assignedTo: filters.assignedTo }),
      }).toString();

      const requests = [
        axiosInstance.get<{ tasks: Task[]; total: number }>(`/tasks?${query}`),
      ];
      if (user?.role === "admin") {
        requests.push(axiosInstance.get<User[]>("/users"));
      }

      const [tasksResponse, usersResponse] = await Promise.all(requests);
      setTasks(tasksResponse.tasks);
      setPagination((prev) => ({ ...prev, total: tasksResponse.total }));
      if (usersResponse) {
        setUsers(usersResponse);
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sort, filters, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle status update
  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status } : t)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update task status"
      );
    }
  };

  // Handle reassign (admin only)
  const reassignTask = async (taskId: string, assignedTo: string) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}`, { assignedTo });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, assignedTo } : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reassign task");
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Task) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | "all" | "pending" | "in-progress" | "completed"
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  // Get username from user ID
  const getUsername = (userId: string) => {
    const foundUser = users.find((u) => u._id === userId);
    return foundUser ? foundUser.username : "Unknown";
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
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView("card")}
            className={`px-3 py-1 rounded-md ${
              view === "card"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 rounded-md ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            List View
          </button>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by title or description"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                handleFilterChange(
                  "status",
                  e.target.value as
                    | "all"
                    | "pending"
                    | "in-progress"
                    | "completed"
                )
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {user?.role === "admin" && (
            <div>
              <label className="block text-gray-700 mb-1">Assigned To</label>
              <select
                value={filters.assignedTo}
                onChange={(e) =>
                  handleFilterChange("assignedTo", e.target.value)
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Users</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Card View */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      task.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">
                    Assigned To:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {getUsername(task.assignedTo)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Due Date:</span>
                  <span className="ml-2 text-gray-600">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTaskStatus(task._id, e.target.value as Task["status"])
                  }
                  className="p-2 border rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {user?.role === "admin" && (
                  <select
                    value={task.assignedTo}
                    onChange={(e) => reassignTask(task._id, e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="p-3 text-gray-700 cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    Title{" "}
                    {sort.field === "title" &&
                      (sort.order === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-3 text-gray-700">Description</th>
                  <th
                    className="p-3 text-gray-700 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    {sort.field === "status" &&
                      (sort.order === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-3 text-gray-700">Assigned To</th>
                  <th
                    className="p-3 text-gray-700 cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    Due Date{" "}
                    {sort.field === "dueDate" &&
                      (sort.order === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-3 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b">
                    <td className="p-3">{task.title}</td>
                    <td className="p-3 line-clamp-1">{task.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3">{getUsername(task.assignedTo)}</td>
                    <td className="p-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3 flex space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(
                            task._id,
                            e.target.value as Task["status"]
                          )
                        }
                        className="p-1 border rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {user?.role === "admin" && (
                        <select
                          value={task.assignedTo}
                          onChange={(e) =>
                            reassignTask(task._id, e.target.value)
                          }
                          className="p-1 border rounded-md"
                        >
                          {users.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.username}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Show</span>
          <select
            value={pagination.limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="p-2 border rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-700">per page</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="p-2 text-gray-700">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            className="px-3 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
