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
  console.log("task", task);

  const renderStatus = () => {
    if (!isAdmin) {
      if (isManagement) {
        return (
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) =>
              onUpdateStatus?.(task._id, value)
            }
          >
            <SelectTrigger className="w-[140px] inline-flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  disabled={
                    !isAdmin &&
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
        );
      }
    }
    return <span>{task.status}</span>;
  };

  const renderAssignedUser = () => {
    if (isManagement) {
      return (
        <Select
          value={task.assignedTo?._id ?? "unassigned"}
          onValueChange={(userId: string) =>
            onAssignUser?.(task._id, userId === "unassigned" ? null : userId)
          }
        >
          <SelectTrigger className="w-[140px] inline-flex">
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
    } else {
      return <span>{task.assignedTo?.username || "Unassigned"}</span>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{task.title || "N/A"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600">{task.description || "N/A"}</p>
        <p className="text-sm">
          <span className="font-medium">Due:</span>{" "}
          {dueDate && isValid(dueDate) ? format(dueDate, "PPP") : "N/A"}
        </p>
        <div className="text-sm">
          <span className="font-medium">Status:</span> {renderStatus()}
        </div>
        {isAdmin && (
          <div className="text-sm">
            <span className="font-medium">Assigned To:</span>{" "}
            {renderAssignedUser()}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
