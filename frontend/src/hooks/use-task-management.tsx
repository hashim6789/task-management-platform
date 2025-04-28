import { useSelector } from "react-redux";
import { format, isValid } from "date-fns";
import { Task, TaskStatus, STATUS_ORDER } from "@/types";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hook";
import { AxiosError } from "axios";
import {
  setSearch,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
} from "@/store/slices/taskSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/store/thunks/updateTaskStatus";
import { assignTask } from "@/store/thunks/assignTask";
import { fetchTasks } from "@/store/thunks/fetchTask";
import { confirmAction, showToast, ToastType } from "@/lib";
import { STATUS_COLORS, TaskMessages } from "@/constants";
import { JSX } from "react";
// import { useNavigate } from "react-router-dom";

interface TableColumn {
  key: string;
  header: string;
  render: (task?: Task) => JSX.Element;
}

export function useTaskManagement() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.userManagement);
  const taskManagement = useSelector(
    (state: RootState) => state.taskManagement
  );

  // const navigate = useNavigate();

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const confirmed = await confirmAction({
      title: "Update Task Status",
      text: `Are you sure you want to mark this task as "${status}"?`,
      confirmButtonText: "Update",
    });

    if (!confirmed) return;

    try {
      const userId = currentUser?._id as string;
      const result = await dispatch(
        updateTaskStatus({ taskId, status, userId })
      ).unwrap();

      showToast({
        message: result.message || TaskMessages.UPDATE_SUCCESS,
        type: ToastType.SUCCESS,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      showToast({
        message: err.response?.data?.message || TaskMessages.UPDATE_FAILED,
        type: ToastType.ERROR,
      });
    }
  };

  const handleAssignTask = async (taskId: string, userId: string | null) => {
    const confirmed = await confirmAction({
      title: "Assign Task",
      text: "Are you sure you want to assign this task to the selected user?",
      confirmButtonText: "Assign",
    });

    if (!confirmed) return;

    try {
      const result = await dispatch(
        assignTask({ taskId, userId: userId ?? null })
      ).unwrap();

      showToast({
        message: result.message || TaskMessages.ASSIGN_SUCCESS,
        type: ToastType.SUCCESS,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      showToast({
        message: err.response?.data?.message || TaskMessages.ASSIGN_FAILED,
        type: ToastType.ERROR,
      });
    }
  };

  const columns: TableColumn[] = [
    {
      key: "title",
      header: "Title",
      render: (task?: Task) => (
        <div className="font-medium text-gray-900">{task?.title ?? "N/A"}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (task?: Task) => (
        <div className="truncate max-w-xs text-gray-600">
          {task?.description ?? "N/A"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task?: Task) =>
        task ? (
          currentUser?.role === "user" && taskManagement.isManagement ? (
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) =>
                handleUpdateTaskStatus(task._id, value)
              }
            >
              <SelectTrigger className="w-[140px] border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ORDER.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    disabled={
                      currentUser?.role !== "user" &&
                      STATUS_ORDER.indexOf(status) <=
                        STATUS_ORDER.indexOf(task.status)
                    }
                  >
                    <span
                      className={`inline-block w-full ${STATUS_COLORS[status]} px-2 py-1 rounded`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                STATUS_COLORS[task.status]
              }`}
            >
              {task.status.charAt(0).toUpperCase() +
                task.status.slice(1).replace("-", " ")}
            </div>
          )
        ) : (
          <div className="text-gray-500">N/A</div>
        ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (task?: Task) => {
        const isOverdue = task?.dueDate
          ? new Date(task.dueDate) < new Date() && task.status !== "completed"
          : false;
        return task &&
          currentUser?.role === "admin" &&
          taskManagement.isManagement &&
          (!task.assignedTo || isOverdue) ? (
          <Select
            value={task.assignedTo?._id ?? "unassigned"}
            onValueChange={(userId: string) =>
              handleAssignTask(
                task._id,
                userId === "unassigned" ? null : userId
              )
            }
          >
            <SelectTrigger className="w-[140px] border-gray-300">
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
          <div className="text-gray-700">
            {task?.assignedTo?.username ?? "Unassigned"}
          </div>
        );
      },
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (task?: Task) => {
        const date = task?.dueDate ? new Date(task.dueDate) : null;
        const isOverdue =
          date &&
          isValid(date) &&
          date < new Date() &&
          task?.status !== "completed";
        return (
          <div
            className={`text-gray-600 ${
              isOverdue ? "text-red-600 font-medium" : ""
            }`}
          >
            {date && isValid(date) ? (
              <>
                {format(date, "PP")}
                {isOverdue && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Overdue
                  </span>
                )}
              </>
            ) : (
              "Not Set"
            )}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      render: (task?: Task) => {
        const date = task?.createdAt ? new Date(task.createdAt) : null;
        return (
          <div className="text-gray-600">
            {date && isValid(date) ? format(date, "PP") : "N/A"}
          </div>
        );
      },
    },
  ];

  return {
    ...taskManagement,
    tasks: taskManagement.tasks,
    columns,
    setSearch: (search: string) => {
      dispatch(setSearch(search));
      dispatch(fetchTasks());
    },
    setStatusFilter: (statusFilter: TaskStatus | "all") => {
      dispatch(setStatusFilter(statusFilter));
      dispatch(fetchTasks());
    },
    setSort: (sortBy: keyof Task, sortOrder: "asc" | "desc") => {
      dispatch(setSort({ sortBy, sortOrder }));
      dispatch(fetchTasks());
    },
    setPage: (page: number) => {
      dispatch(setPage(page));
      dispatch(fetchTasks());
    },
    setLimit: (limit: number) => {
      dispatch(setLimit(limit));
      dispatch(fetchTasks());
    },
    setViewMode: (viewMode: "list" | "card") => dispatch(setViewMode(viewMode)),
    updateTaskStatus: handleUpdateTaskStatus,
    assignTask: handleAssignTask,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === "admin",
  };
}
