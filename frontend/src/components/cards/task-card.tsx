import { Task, TaskStatus } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  isAdmin: boolean;
}

export function TaskCard({ task, onUpdateStatus, isAdmin }: TaskCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Description:</strong> {task.description}
        </p>
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Assigned To:</strong> {task.assignedTo}
        </p>
        <p>
          <strong>Created:</strong> {format(new Date(task.createdAt), "PP")}
        </p>
        <p>
          <strong>Updated:</strong> {format(new Date(task.updatedAt), "PP")}
        </p>
      </CardContent>
      {isAdmin && (
        <CardFooter>
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) =>
              onUpdateStatus(task._id, value)
            }
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
        </CardFooter>
      )}
    </Card>
  );
}
