import { useSelector } from "react-redux";

import { User } from "@/types";
import { format } from "date-fns";
import {
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
} from "@/store/slices/userManagementSlice";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hook";
import { AxiosError } from "axios";
import { UserMessages } from "@/constants";
import { fetchUsers, toggleBlockUser } from "@/store/thunks";
import { confirmAction, showToast, ToastType } from "@/lib";

export function useUserManagement() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const userManagement = useSelector(
    (state: RootState) => state.userManagement
  );

  const handleToggleBlockUser = async (userId: string, isBlocked: boolean) => {
    if (!currentUser || currentUser.role !== "admin") {
      showToast({ message: UserMessages.ADMIN_ONLY });
      return;
    }

    const confirmed = await confirmAction({
      title: isBlocked ? "Unblock User" : "Block User",
      text: `Are you sure you want to ${
        isBlocked ? "unblock" : "block"
      } this user?`,
      confirmButtonText: isBlocked ? "Unblock" : "Block",
    });

    if (!confirmed) return;

    try {
      const result = await dispatch(
        toggleBlockUser({ userId, isBlocked })
      ).unwrap();

      showToast({
        message:
          result.message || isBlocked
            ? UserMessages.USER_BLOCKED
            : UserMessages.USER_UNBLOCKED,
        type: ToastType.SUCCESS,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      showToast({
        message: err.response?.data?.message || UserMessages.UPDATE_FAILED,
        type: ToastType.ERROR,
      });
    }
  };

  // Table columns for list view
  const columns = [
    {
      key: "username",
      header: "Username",
      render: (user: User) => <div>{user.username}</div>,
    },
    {
      key: "email",
      header: "Email",
      render: (user: User) => <div>{user.email}</div>,
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => <div>{user.role}</div>,
    },
    {
      key: "isBlocked",
      header: "Status",
      render: (user: User) => (
        <div>{user.isBlocked ? "Blocked" : "Active"}</div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (user: User) => (
        <div>{format(new Date(user.createdAt), "PP")}</div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (user: User) => (
        <div>{format(new Date(user.updatedAt), "PP")}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="flex space-x-2">
          <Button
            variant={user.isBlocked ? "outline" : "destructive"}
            size="sm"
            onClick={() => handleToggleBlockUser(user._id, user.isBlocked)}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      ),
    },
  ];

  return {
    ...userManagement,
    columns,
    setSearch: (search: string) => {
      dispatch(setSearch(search));
      dispatch(fetchUsers());
    },

    setStatusFilter: (statusFilter: "all" | "active" | "blocked") => {
      dispatch(setStatusFilter(statusFilter));
      dispatch(fetchUsers());
    },
    setSort: (sortBy: keyof User, sortOrder: "asc" | "desc") => {
      dispatch(setSort({ sortBy, sortOrder }));
      dispatch(fetchUsers());
    },
    setPage: (page: number) => {
      dispatch(setPage(page));
      dispatch(fetchUsers());
    },
    setLimit: (limit: number) => {
      dispatch(setLimit(limit));
      dispatch(fetchUsers());
    },
    setViewMode: (viewMode: "list" | "card") => dispatch(setViewMode(viewMode)),
    toggleBlockUser: handleToggleBlockUser,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === "admin",
  };
}
