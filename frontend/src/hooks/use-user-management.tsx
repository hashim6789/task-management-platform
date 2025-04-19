import { useSelector } from "react-redux";

import { User } from "@/types";
import { format } from "date-fns";
import {
  // fetchUsers,
  toggleBlockUser,
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
} from "@/store/slices/userManagentSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "./use-toast";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hiook";
import { AxiosError } from "axios";
import { TOAST_MESSAGES, USER_MESSAGE } from "@/constants";

export function useUserManagement() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const userManagement = useSelector(
    (state: RootState) => state.userManagement
  );

  const handleToggleBlockUser = async (userId: string, isBlocked: boolean) => {
    if (!currentUser || currentUser.role !== "admin") {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.unauthorizedTitle,
        description: USER_MESSAGE.unauthorizedDesc,
      });
      return;
    }

    try {
      const result = await dispatch(
        toggleBlockUser({ userId, isBlocked })
      ).unwrap();
      toast({
        title: TOAST_MESSAGES.successTitle,
        description:
          result.message ||
          `User ${isBlocked ? "unblocked" : "blocked"} successfully`,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.errorTitle,
        description: err.response?.data?.message || USER_MESSAGE.updateFailed,
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
    setSearch: (search: string) => dispatch(setSearch(search)),

    setStatusFilter: (statusFilter: "all" | "active" | "blocked") =>
      dispatch(setStatusFilter(statusFilter)),
    setSort: (sortBy: keyof User, sortOrder: "asc" | "desc") =>
      dispatch(setSort({ sortBy, sortOrder })),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setViewMode: (viewMode: "list" | "card") => dispatch(setViewMode(viewMode)),
    toggleBlockUser: handleToggleBlockUser,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === "admin",
  };
}
