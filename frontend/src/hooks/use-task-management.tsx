import { useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { Task, TaskStatus, STATUS_ORDER, isValidTask } from "@/types";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hiook";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
  updateTaskStatus,
  assignTask,
} from "@/store/slices/taskSlice";
import { TOAST_MESSAGES, TASK_MESSAGE } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function useTaskManagement() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.userManagement);
  const taskManagement = useSelector(
    (state: RootState) => state.taskManagement
  );

  // Filter valid tasks
  const validTasks = taskManagement.tasks.filter(isValidTask);
  console.log("Valid Tasks in useTaskManagement:", validTasks);

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
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

  const handleAssignTask = async (taskId: string, userId: string | null) => {
    try {
      const result = await dispatch(
        assignTask({ taskId, userId: userId ?? "" })
      ).unwrap();
      toast({
        title: TOAST_MESSAGES.successTitle,
        description: result.message || TASK_MESSAGE.assignSuccess,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast({
        variant: "destructive",
        title: TOAST_MESSAGES.errorTitle,
        description: err.response?.data?.message || TASK_MESSAGE.assignFailed,
      });
    }
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (task?: Task) => (
        <div className="font-medium">{task?.title ?? "N/A"}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (task?: Task) => (
        <div className="truncate max-w-xs">{task?.description ?? "N/A"}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task?: Task) =>
        task ? (
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) =>
              handleUpdateTaskStatus(task._id, value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  disabled={
                    currentUser?.role !== "admin" &&
                    STATUS_ORDER.indexOf(status) <=
                      STATUS_ORDER.indexOf(task.status)
                  }
                >
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div>N/A</div>
        ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (task?: Task) =>
        task && currentUser?.role === "admin" ? (
          <Select
            value={task.assignedTo?._id ?? "unassigned"}
            onValueChange={(userId: string) =>
              handleAssignTask(
                task._id,
                userId === "unassigned" ? null : userId
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div>{task?.assignedTo?.username ?? "Unassigned"}</div>
        ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (task?: Task) => {
        const date = task?.dueDate ? new Date(task.dueDate) : null;
        return <div>{date && isValid(date) ? format(date, "PP") : "N/A"}</div>;
      },
    },
    {
      key: "createdAt",
      header: "Created",
      render: (task?: Task) => {
        const date = task?.createdAt ? new Date(task.createdAt) : null;
        return <div>{date && isValid(date) ? format(date, "PP") : "N/A"}</div>;
      },
    },
  ];

  return {
    ...taskManagement,
    tasks: validTasks,
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
    assignTask: handleAssignTask,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === "admin",
  };
}
