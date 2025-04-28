import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTaskManagement } from "@/hooks/use-task-management";
import { useAppDispatch } from "@/store/hook";
import { RootState } from "@/store";
import { setIsManagement } from "@/store/slices/taskSlice";
import { TaskFilters } from "@/components/filters/task-filter";
import { TaskTable } from "@/components/tables/task-table";
import { TaskCard } from "@/components/cards/task-card";
import { PaginationControls } from "@/components/common/pagination";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { Role } from "@/types";
import { fetchTasks } from "@/store/thunks/fetchTask";

interface TasksPageProps {
  role: Role;
}

export function TasksPage({ role }: TasksPageProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const {
    tasks,
    total,
    page,
    limit,
    isManagement,
    search,
    statusFilter,
    viewMode,
    loading,
    error,
    columns,
    setSearch,
    setStatusFilter,
    setPage,
    setLimit,
    setViewMode,
    clearError,
    isAdmin,
  } = useTaskManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setIsManagement(false));
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (authError || !isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (role === "admin" && !isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={viewMode === "card"}
              onCheckedChange={() =>
                setViewMode(viewMode === "list" ? "card" : "list")
              }
            />
            <Label className="text-sm font-medium">
              {viewMode === "list" ? "List View" : "Card View"}
            </Label>
          </div>
        </div>
      </div>

      <TaskFilters
        search={search}
        statusFilter={statusFilter}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
      />

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {viewMode === "list" ? (
        <TaskTable tasks={tasks} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isAdmin={isAdmin}
              isManagement={isManagement}
            />
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        total={total}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
      />

      {isAdmin && (
        <CreateTaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </div>
  );
}
