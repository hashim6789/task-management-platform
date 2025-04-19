import { useSelector } from "react-redux";

import { Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import {
  updateTaskStatus,
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
} from "@/store/slices/taskSlice";
// import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "./use-toast";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hiook";
import { TASK_MESSAGE, TOAST_MESSAGES } from "@/constants";
import { AxiosError } from "axios";

export function useTaskManagement() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const taskManagement = useSelector(
    (state: RootState) => state.taskManagement
  );

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!currentUser || currentUser.role !== "admin") {
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.unauthorizedTitle,
        description: TASK_MESSAGE.unauthorizedDesc,
      });
      return;
    }

    try {
      const result = await dispatch(
        updateTaskStatus({ taskId, status })
      ).unwrap();
      toast({
        title: TOAST_MESSAGES.successTitle,
        description: result.message || TASK_MESSAGE.updateSuccess,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.errorTitle,
        description: err.response?.data?.message || TASK_MESSAGE.updateFailed,
      });
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (task: Task) => <div>{task.title}</div>,
    },
    {
      key: "description",
      header: "Description",
      render: (task: Task) => (
        <div className="truncate max-w-xs">{task.description}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task: Task) => (
        <Select
          value={task.status}
          onValueChange={(value: TaskStatus) =>
            handleUpdateTaskStatus(task._id, value)
          }
          disabled={!currentUser || currentUser.role !== "admin"}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (task: Task) => <div>{task.assignedTo}</div>,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (task: Task) => (
        <div>{format(new Date(task.createdAt), "PP")}</div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (task: Task) => (
        <div>{format(new Date(task.updatedAt), "PP")}</div>
      ),
    },
  ];

  return {
    ...taskManagement,
    columns,
    setSearch: (search: string) => dispatch(setSearch(search)),
    setStatusFilter: (statusFilter: TaskStatus | "all") =>
      dispatch(setStatusFilter(statusFilter)),

    setSort: (sortBy: keyof Task, sortOrder: "asc" | "desc") =>
      dispatch(setSort({ sortBy, sortOrder })),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setViewMode: (viewMode: "list" | "card") => dispatch(setViewMode(viewMode)),
    updateTaskStatus: handleUpdateTaskStatus,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === "admin",
  };
}
