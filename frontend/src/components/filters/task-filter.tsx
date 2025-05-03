import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
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
}

export function TaskFilters({
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
}: TaskFiltersProps) {
  // Debounced version of setSearch
  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
      console.log("search", value);
      setSearch(value);
    }, 500);
  }, [setSearch]);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel(); // Cleanup on unmount
    };
  }, [debouncedSetSearch]);

  console.log("search", search);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search tasks..."
        defaultValue={search}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className="max-w-sm"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
