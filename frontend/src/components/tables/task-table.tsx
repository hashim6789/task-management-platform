import { Task } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JSX } from "react";

interface TaskTableProps {
  tasks: Task[];
  columns: Array<{
    key: string;
    header: string;
    render: (task?: Task) => JSX.Element;
  }>;
}

export function TaskTable({ tasks, columns }: TaskTableProps) {
  // Filter out undefined or null tasks
  const validTasks = tasks.filter(
    (task): task is Task =>
      task !== undefined &&
      task !== null &&
      typeof task._id === "string" &&
      typeof task.title === "string"
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {validTasks.length > 0 ? (
          validTasks.map((task) => (
            <TableRow key={task._id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(task)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No tasks available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
