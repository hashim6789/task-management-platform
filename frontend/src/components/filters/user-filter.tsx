import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";

interface UserFiltersProps {
  search: string;
  statusFilter: "all" | "active" | "blocked";
  setSearch: (value: string) => void;
  setStatusFilter: (value: "all" | "active" | "blocked") => void;
}

export function UserFilters({
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
}: UserFiltersProps) {
  // Debounced version of setSearch
  const debouncedSetSearch = useMemo(() => {
    return debounce((value: string) => {
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
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search by username or email"
        defaultValue={search}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className="max-w-sm"
      />

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
