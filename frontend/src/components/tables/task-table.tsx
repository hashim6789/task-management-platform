import { Task } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTaskManagement } from "@/hooks/use-task-management";
import { JSX } from "react";

interface TaskTableProps {
  tasks: Task[];
  columns: Array<{
    key: string;
    header: string;
    render: (task: Task) => JSX.Element;
  }>;
}

export function TaskTable({ tasks, columns }: TaskTableProps) {
  const { setSort, sortBy, sortOrder } = useTaskManagement();

  const handleSort = (key: string) => {
    if (key === "status" || key === "assignedTo") return; // Skip sorting for status and assignedTo
    const newSortOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSort(key as keyof Task, newSortOrder);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={
                column.key === "title" ||
                column.key === "createdAt" ||
                column.key === "updatedAt"
                  ? "cursor-pointer"
                  : ""
              }
              onClick={() => handleSort(column.key)}
            >
              {column.header}
              {sortBy === column.key && (
                <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No tasks found
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task) => (
            <TableRow key={task._id}>
              {columns.map((column) => (
                <TableCell key={`${task._id}-${column.key}`}>
                  {column.render(task)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
