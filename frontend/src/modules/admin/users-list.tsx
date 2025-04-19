import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

// User interface (from previous artifacts)
interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const UserList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<{
    search: string;
    role: "all" | "user" | "admin";
    status: "all" | "active" | "blocked";
  }>({ search: "", role: "all", status: "all" });
  const [sort, setSort] = useState<{
    field: keyof User;
    order: "asc" | "desc";
  }>({
    field: "username",
    order: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restrict to admins
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sort.field,
        order: sort.order,
        ...(filters.search && { search: filters.search }),
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.status !== "all" && { status: filters.status }),
      }).toString();

      const response = await axiosInstance.get<{
        users: User[];
        total: number;
      }>(`/users?${query}`);
      setUsers(response.data.users);
      setPagination((prev) => ({ ...prev, total: response.data.total }));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sort, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle block/unblock
  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const action = isBlocked ? "unblock" : "block";
      await axiosInstance.post(`/users/${userId}/${action}`);
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

  // Handle sorting
  const handleSort = (field: keyof User) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | "all" | "user" | "admin" | "active" | "blocked"
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
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
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
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
              placeholder="Search by username or email"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) =>
                handleFilterChange(
                  "role",
                  e.target.value as "all" | "user" | "admin"
                )
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                handleFilterChange(
                  "status",
                  e.target.value as "all" | "active" | "blocked"
                )
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="p-3 text-gray-700 cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username{" "}
                  {sort.field === "username" &&
                    (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-3 text-gray-700 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sort.field === "email" && (sort.order === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-3 text-gray-700">Role</th>
                <th className="p-3 text-gray-700">Status</th>
                <th
                  className="p-3 text-gray-700 cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created{" "}
                  {sort.field === "createdAt" &&
                    (sort.order === "asc" ? "↑" : "↓")}
                </th>
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
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex space-x-2">
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
                    <button
                      onClick={() => navigate(`/users/${user._id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
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

export default UserList;
