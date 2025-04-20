import { User } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JSX } from "react";
import { useUserManagement } from "@/hooks/use-user-management";

interface UserTableProps {
  users: User[];
  columns: Array<{
    key: string;
    header: string;
    render: (user: User) => JSX.Element;
  }>;
}

export function UserTable({ users, columns }: UserTableProps) {
  const { setSort, sortBy, sortOrder } = useUserManagement();

  const handleSort = (key: string) => {
    if (key === "actions") return; // Skip sorting for actions column
    const newSortOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSort(key as keyof User, newSortOrder);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.key !== "actions" ? "cursor-pointer" : ""}
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
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user._id}>
              {columns.map((column) => (
                <TableCell key={`${user._id}-${column.key}`}>
                  {column.render(user)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
