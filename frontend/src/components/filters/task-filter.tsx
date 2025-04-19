import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/types";

interface TaskFiltersProps {
  search: string;
  statusFilter: TaskStatus | "all";
  setSearch: (value: string) => void;
  setStatusFilter: (value: TaskStatus | "all") => void;
  // users: Array<{ _id: string; username: string }>;
}

export function TaskFilters({
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
}: // users,
TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      {/* <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by assigned to" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
    </div>
  );
}
