import { memo } from "react";
import { Task, TaskStatus, STATUS_ORDER, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_COLORS } from "@/constants";

interface TaskCardProps {
  task: Task;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  onAssignUser?: (taskId: string, userId: string | null) => void;
  isAdmin: boolean;
  users?: User[];
  isManagement: boolean;
}

export const TaskCard = memo(function TaskCard({
  task,
  onUpdateStatus,
  onAssignUser,
  isManagement,
  isAdmin,
  users = [], // Default empty array to prevent errors
}: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const createdAt = task.createdAt ? new Date(task.createdAt) : null;
  const isOverdue =
    dueDate &&
    isValid(dueDate) &&
    dueDate < new Date() &&
    task.status !== "completed";

  const renderStatus = () => {
    if (!task) {
      return <div className="text-gray-500">N/A</div>;
    }

    const isUser = !isAdmin;

    if (isUser && isManagement) {
      return (
        <Select
          value={task.status}
          onValueChange={(value: TaskStatus) => {
            if (onUpdateStatus) {
              onUpdateStatus(task._id, value);
            }
          }}
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
                  isAdmin &&
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
      );
    }

    return (
      <div
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          STATUS_COLORS[task.status]
        }`}
      >
        {task.status.charAt(0).toUpperCase() +
          task.status.slice(1).replace("-", " ")}
      </div>
    );
  };

  const renderAssignedUser = () => {
    if (task && isAdmin && isManagement && (!task.assignedTo || isOverdue)) {
      return (
        <Select
          value={task.assignedTo?._id ?? "unassigned"}
          onValueChange={(userId: string) =>
            onAssignUser?.(task._id, userId === "unassigned" ? null : userId)
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
      );
    }
    return (
      <div className="text-gray-700">
        {task?.assignedTo?.username ?? "Unassigned"}
      </div>
    );
  };

  const renderDueDate = () => {
    return (
      <div
        className={`text-gray-600 ${
          isOverdue ? "text-red-600 font-medium" : ""
        }`}
      >
        {dueDate && isValid(dueDate) ? (
          <>
            {format(dueDate, "PP")}
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
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          {task.title ?? "N/A"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="truncate max-w-xs text-gray-600">
          {task.description ?? "N/A"}
        </div>
        <div className="text-sm">
          <span className="font-medium">Due:</span> {renderDueDate()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Status:</span> {renderStatus()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Assigned To:</span>{" "}
          {renderAssignedUser()}
        </div>
        <div className="text-sm">
          <span className="font-medium">Created:</span>{" "}
          {createdAt && isValid(createdAt) ? format(createdAt, "PP") : "N/A"}
        </div>
      </CardContent>
    </Card>
  );
});
