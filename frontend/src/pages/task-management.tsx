import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTaskManagement } from "@/hooks/use-task-management";
import { RootState } from "@/store";
import { setIsManagement } from "@/store/slices/taskSlice";
import { TaskFilters } from "@/components/filters/task-filter";
import { TaskTable } from "@/components/tables/task-table";
import { TaskCard } from "@/components/cards/task-card";
import { PaginationControls } from "@/components/common/pagination";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { useAppDispatch } from "@/store/hook";
import { fetchTasks } from "@/store/thunks/fetchTask";
import { fetchUsers } from "@/store/thunks";
import { Role } from "@/types";

interface TaskManagementProps {
  role: Role;
}

export function TaskManagement({ role }: TaskManagementProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
    user,
  } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.userManagement);
  const {
    tasks,
    total,
    page,
    limit,
    search,
    statusFilter,
    viewMode,
    loading,
    error,
    columns,
    assignTask,
    updateTaskStatus,
    setSearch,
    setStatusFilter,
    setPage,
    setLimit,
    setViewMode,
    clearError,
    isAdmin,
  } = useTaskManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize tasks to prevent unnecessary re-renders
  const stableTasks = useMemo(() => tasks.filter((task) => task._id), [tasks]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchTasks());
      dispatch(setIsManagement(true));

      if (isAdmin) {
        dispatch(fetchUsers());
      }
    }
  }, [dispatch, isAuthenticated, isAdmin, user]);

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
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Create Task
            </Button>
          )}
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
        <ErrorBoundary>
          <TaskTable tasks={stableTasks} columns={columns} />
        </ErrorBoundary>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stableTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdateStatus={updateTaskStatus}
              onAssignUser={assignTask}
              isAdmin={isAdmin}
              users={users}
              isManagement
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
