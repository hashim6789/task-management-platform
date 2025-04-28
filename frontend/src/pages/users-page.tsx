import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUserManagement } from "@/hooks/use-user-management";
import { UserFilters } from "@/components/filters/user-filter";
import { UserTable } from "@/components/tables/user-table";
import { UserCard } from "@/components/cards/user-card";
import { PaginationControls } from "@/components/common/pagination";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hook";
import { CreateUserModal } from "@/components/modals/create-user.modal";
import { fetchUsers } from "@/store/thunks";

export function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const {
    users,
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
    toggleBlockUser,
    clearError,
    isAdmin,
  } = useUserManagement();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      dispatch(fetchUsers());
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

  if (authError || !isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsModalOpen(true)}>Create User</Button>
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

      <UserFilters
        search={search}
        statusFilter={statusFilter}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
      />

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {viewMode === "list" ? (
        <UserTable users={users} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onToggleBlock={toggleBlockUser}
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

      <CreateUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
