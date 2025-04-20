import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useTaskManagement } from "@/hooks/use-task-management";
import { useAppDispatch } from "@/store/hiook";
import { RootState } from "@/store/store";
import { TaskFilters } from "@/components/filters/task-filter";
import { TaskTable } from "@/components/tables/task-table";
import { TaskCard } from "@/components/cards/task-card";
import { PaginationControls } from "@/components/common/pagination";
import { Role } from "@/types";
import { fetchTasks } from "@/store/slices/taskSlice";

interface TasksPageProps {
  role: Role;
}

const TasksPage: React.FC<TasksPageProps> = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
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
    setSearch,
    setStatusFilter,
    setPage,
    setLimit,
    setViewMode,
    updateTaskStatus,
    clearError,
    isAdmin,
  } = useTaskManagement();
  //   const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // if (isAuthenticated && isAdmin) {
    //   dispatch(fetchTasks());
    //   dispatch(fetchUsers());
    // }
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (error) {
      setTimeout(() => clearError(), 5000); // Clear error after 5 seconds
    }
  }, [error, clearError]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  //   if (authError || !isAuthenticated) {
  //     navigate("/login");
  //     return null;
  //   }

  //   if (!isAdmin) {
  //     navigate("/");
  //     return null;
  //   }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex items-center gap-4">
          {/* <Button onClick={() => setIsModalOpen(true)}>Create Task</Button> */}
          <div className="flex items-center gap-2">
            <Switch
              checked={viewMode === "card"}
              onCheckedChange={() =>
                setViewMode(viewMode === "list" ? "card" : "list")
              }
            />
            <Label>{viewMode === "list" ? "List View" : "Card View"}</Label>
          </div>
        </div>
      </div>

      <TaskFilters
        search={search}
        statusFilter={statusFilter}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        // users={users.map((user) => ({
        //   _id: user._id,
        //   username: user.username,
        // }))}
      />

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {viewMode === "list" ? (
        <TaskTable tasks={tasks} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdateStatus={updateTaskStatus}
              isAdmin={isAdmin}
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

      {/* <CreateTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        users={users.map((user) => ({
          _id: user._id,
          username: user.username,
        }))}
      /> */}
    </div>
  );
};

export default TasksPage;
