
// ```

// #### 3. Update User Management Slice
// Add an `addUser` action to prepend the new user to the `users` array and update `total`.

// <xaiArtifact artifact_id="530b2981-cff8-4767-bbda-460b84a01378" artifact_version_id="0b48795b-c209-40b6-bc6a-51b89d5ecffe" title="userManagementSlice.ts" contentType="text/typescript">
// ```typescript
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axiosInstance from '@/lib/axiosInstance';
// import { User, Role } from '@/types';

// interface UserManagementState {
//   users: User[];
//   total: number;
//   page: number;
//   limit: number;
//   search: string;
//   roleFilter: Role | 'all';
//   statusFilter: 'all' | 'active' | 'blocked';
//   sortBy: keyof User;
//   sortOrder: 'asc' | 'desc';
//   viewMode: 'list' | 'card';
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserManagementState = {
//   users: [],
//   total: 0,
//   page: 1,
//   limit: 10,
//   search: '',
//   roleFilter: 'all',
//   statusFilter: 'all',
//   sortBy: 'createdAt',
//   sortOrder: 'desc',
//   viewMode: 'list',
//   loading: false,
//   error: null,
// };

// export const fetchUsers = createAsyncThunk(
//   'userManagement/fetchUsers',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState() as RootState;
//     const { userManagement, auth } = state;
//     if (!auth.isAuthenticated || !auth.user || auth.user.role !== 'admin') {
//       return rejectWithValue('Unauthorized');
//     }

//     try {
//       const params = {
//         page: userManagement.page,
//         limit: userManagement.limit,
//         search: userManagement.search || undefined,
//         role: userManagement.roleFilter !== 'all' ? userManagement.roleFilter : undefined,
//         isBlocked:
//           userManagement.statusFilter === 'active'
//             ? false
//             : userManagement.statusFilter === 'blocked'
//             ? true
//             : undefined,
//         sortBy: userManagement.sortBy,
//         sortOrder: userManagement.sortOrder,
//       };
//       const response = await axiosInstance.get<{ data: User[]; total: number }>('/users', { params });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
//     }
//   }
// );

// export const toggleBlockUser = createAsyncThunk(
//   'userManagement/toggleBlockUser',
//   async ({ userId, isBlocked }: { userId: string; isBlocked: boolean }, { getState, rejectWithValue }) => {
//     const state = getState() as RootState;
//     const { auth } = state;
//     if (!auth.isAuthenticated || !auth.user || auth.user.role !== 'admin') {
//       return rejectWithValue('Unauthorized');
//     }

//     try {
//       const response = await axiosInstance.patch(`/users/${userId}`, { isBlocked: !isBlocked });
//       return { userId, isBlocked: !isBlocked, message: response.data.message };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
//     }
//   }
// );

// const userManagementSlice = createSlice({
//   name: 'userManagement',
//   initialState,
//   reducers: {
//     setSearch: (state, action: PayloadAction<string>) => {
//       state.search = action.payload;
//       state.page = 1;
//     },
//     setRoleFilter: (state, action: PayloadAction<Role | 'all'>) => {
//       state.roleFilter = action.payload;
//       state.page = 1;
//     },
//     setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'blocked'>) => {
//       state.statusFilter = action.payload;
//       state.page = 1;
//     },
//     setSort: (state, action: PayloadAction<{ sortBy: keyof User; sortOrder: 'asc' | 'desc' }>) => {
//       state.sortBy = action.payload.sortBy;
//       state.sortOrder = action.payload.sortOrder;
//     },
//     setPage: (state, action: PayloadAction<number>) => {
//       state.page = action.payload;
//     },
//     setLimit: (state, action: PayloadAction<number>) => {
//       state.limit = action.payload;
//       state.page = 1;
//     },
//     setViewMode: (state, action: PayloadAction<'list' | 'card'>) => {
//       state.viewMode = action.payload;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     addUser: (state, action: PayloadAction<User>) => {
//       state.users = [action.payload, ...state.users];
//       state.total += 1;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload.data;
//         state.total = action.payload.total;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(toggleBlockUser.fulfilled, (state, action) => {
//         state.users = state.users.map((user) =>
//           user._id === action.payload.userId ? { ...user, isBlocked: action.payload.isBlocked } : user
//         );
//       })
//       .addCase(toggleBlockUser.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const {
//   setSearch,
//   setRoleFilter,
//   setStatusFilter,
//   setSort,
//   setPage,
//   setLimit,
//   setViewMode,
//   clearError,
//   addUser,
// } = userManagementSlice.actions;
// export const userManagementReducer = userManagementSlice.reducer;



import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserTable } from '@/components/UserTable';
import { UserCard } from '@/components/UserCard';
import { UserFilters } from '@/components/UserFilters';
import { PaginationControls } from '@/components/PaginationControls';
import { CreateUserModal } from '@/components/CreateUserModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { fetchUsers } from '@/features/userManagementSlice';

export function UsersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const {
    users,
    total,
    page,
    limit,
    search,
    roleFilter,
    statusFilter,
    viewMode,
    loading,
    error,
    columns,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setPage,
    setLimit,
    setViewMode,
    toggleBlockUser,
    clearError,
    isAdmin,
  } = useUserManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (authError || !isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    navigate('/');
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
              checked={viewMode === 'card'}
              onCheckedChange={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
            />
            <Label>{viewMode === 'list' ? 'List View' : 'Card View'}</Label>
          </div>
        </div>
      </div>

      <UserFilters
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        setSearch={setSearch}
        setRoleFilter={setRoleFilter}
        setStatusFilter={setStatusFilter}
      />

      {loading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {viewMode === 'list' ? (
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
```

#### 5. Update User Management Hook
Ensure `useUserManagement` is compatible with the updated `userManagementSlice`.

<xaiArtifact artifact_id="dcfc027c-0b87-4a6a-abef-f672ca6aeac1" artifact_version_id="7f494f62-4c4a-4428-9b2f-c43e95aea1a2" title="useUserManagement.ts" contentType="text/typescript">
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { RootState } from '@/store';
import { User, Role } from '@/types';
import { format } from 'date-fns';
import {
  fetchUsers,
  toggleBlockUser,
  setSearch,
  setRoleFilter,
  setStatusFilter,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  clearError,
} from '@/features/userManagementSlice';
import { Button } from '@/components/ui/button';

export function useUserManagement() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userManagement = useSelector((state: RootState) => state.userManagement);

  const handleToggleBlockUser = async (userId: string, isBlocked: boolean) => {
    if (!currentUser || currentUser.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'Only admins can block/unblock users',
      });
      return;
    }

    try {
      const result = await dispatch(toggleBlockUser({ userId, isBlocked })).unwrap();
      toast({
        title: 'Success',
        description: result.message || `User ${isBlocked ? 'unblocked' : 'blocked'} successfully`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error || 'Failed to update user status',
      });
    }
  };

  const columns = [
    {
      key: 'username',
      header: 'Username',
      render: (user: User) => <div>{user.username}</div>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (user: User) => <div>{user.email}</div>,
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => <div>{user.role}</div>,
    },
    {
      key: 'isBlocked',
      header: 'Status',
      render: (user: User) => <div>{user.isBlocked ? 'Blocked' : 'Active'}</div>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (user: User) => <div>{format(new Date(user.createdAt), 'PP')}</div>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (user: User) => <div>{format(new Date(user.updatedAt), 'PP')}</div>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex space-x-2">
          <Button
            variant={user.isBlocked ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => handleToggleBlockUser(user._id, user.isBlocked)}
          >
            {user.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </div>
      ),
    },
  ];

  return {
    ...userManagement,
    columns,
    setSearch: (search: string) => dispatch(setSearch(search)),
    setRoleFilter: (roleFilter: Role | 'all') => dispatch(setRoleFilter(roleFilter)),
    setStatusFilter: (statusFilter: 'all' | 'active' | 'blocked') => dispatch(setStatusFilter(statusFilter)),
    setSort: (sortBy: keyof User, sortOrder: 'asc' | 'desc') => dispatch(setSort({ sortBy, sortOrder })),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setViewMode: (viewMode: 'list' | 'card') => dispatch(setViewMode(viewMode)),
    toggleBlockUser: handleToggleBlockUser,
    clearError: () => dispatch(clearError()),
    isAdmin: currentUser?.role === 'admin',
  };
}
```

#### 6. Ensure Existing Components
The `UserTable`, `UserCard`, `UserFilters`, `PaginationControls`, `authSlice`, `store`, `toastReducer`, `useToast`, `toaster`, and `App` components remain unchanged from your previous responses, as they are compatible. For reference, key components are included below to ensure a cohesive system.

<xaiArtifact artifact_id="6c4e7cbe-706c-4433-a224-d1f11e33e100" artifact_version_id="513a787a-c601-40e3-9579-0bba62c23062" title="UserTable.tsx" contentType="text/typescript">
```typescript
import { User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserManagement } from '@/hooks/useUserManagement';

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
    if (key === 'actions') return;
    const newSortOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSort(key as keyof User, newSortOrder);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.key !== 'actions' ? 'cursor-pointer' : ''}
              onClick={() => handleSort(column.key)}
            >
              {column.header}
              {sortBy === column.key && (
                <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
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
```

<xaiArtifact artifact_id="e9806e60-53ef-4d6d-adfb-c9f4606d8ade" artifact_version_id="fb8b36ec-771f-4c8b-9721-eaa839fbcbf5" title="UserCard.tsx" contentType="text/typescript">
```typescript
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface UserCardProps {
  user: User;
  onToggleBlock: (userId: string, isBlocked: boolean) => void;
  isAdmin: boolean;
}

export function UserCard({ user, onToggleBlock, isAdmin }: UserCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{user.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.isBlocked ? 'Blocked' : 'Active'}</p>
        <p><strong>Created:</strong> {format(new Date(user.createdAt), 'PP')}</p>
        <p><strong>Updated:</strong> {format(new Date(user.updatedAt), 'PP')}</p>
      </CardContent>
      {isAdmin && (
        <CardFooter>
          <Button
            variant={user.isBlocked ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => onToggleBlock(user._id, user.isBlocked)}
          >
            {user.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
```

<xaiArtifact artifact_id="d30b93f8-c7cd-43e4-abcd-475724171b02" artifact_version_id="3ed375f8-185e-4cae-8d98-627c0d910cd3" title="UserFilters.tsx" contentType="text/typescript">
```typescript
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Role } from '@/types';

interface UserFiltersProps {
  search: string;
  roleFilter: Role | 'all';
  statusFilter: 'all' | 'active' | 'blocked';
  setSearch: (value: string) => void;
  setRoleFilter: (value: Role | 'all') => void;
  setStatusFilter: (value: 'all' | 'active' | 'blocked') => void;
}

export function UserFilters({
  search,
  roleFilter,
  statusFilter,
  setSearch,
  setRoleFilter,
  setStatusFilter,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search by username or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
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
```

<xaiArtifact artifact_id="d864f0e2-9209-4be1-98dc-e61575881417" artifact_version_id="2b799365-7129-4db6-a808-72ecb091eed8" title="PaginationControls.tsx" contentType="text/typescript">
```typescript
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationControlsProps {
  page: number;
  total: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function PaginationControls({ page, total, limit, setPage, setLimit }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
      <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

#### 7. Backend Endpoint
Ensure the backend supports the `POST /users` endpoint (example in Node.js/Express):

```javascript
app.post('/users', (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: 'No access token' });
  }
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { username, email } = req.body;
    // Create user in database (mock response)
    const newUser = {
      _id: 'new-user-id',
      username,
      email,
      role: 'user',
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    res.json({ data: newUser });
  } catch (error) {
    res.status(401).json({ message: 'Invalid access token' });
  }
});
```

### UI/UX Features
- **Modal Design**: Uses `shadcn/ui` `Dialog` for a clean, centered popup with a dark overlay, ensuring focus on the form.
- **Form Layout**: Simple, vertical layout with clear labels, placeholders, and error messages for username and email.
- **Validation**: Immediate feedback via `zod` (e.g., "Username must be at least 3 characters", "Invalid email address").
- **Loading State**: "Creating..." button text during submission, with disabled state to prevent multiple submissions.
- **Feedback**: Success toast on creation, error toast on failure, auto-close modal on success.
- **Accessibility**: Proper ARIA attributes via `shadcn/ui`, keyboard-navigable form and buttons.
- **Responsiveness**: Modal scales to `sm:max-w-[425px]`, form fields adjust to screen size.

### Reusability
- **CreateUserModal**: Can be reused in other pages by passing `open` and `onOpenChange` props.
- **Form Logic**: Uses `react-hook-form` and `zod`, easily extensible for additional fields.
- **Redux Integration**: The `addUser` action is reusable for other user creation flows.
- **Styling**: Leverages `shadcn/ui` and Tailwind CSS for consistent, customizable design.

### Testing
1. **Run the App**:
   - Start Vite: `npm run dev`.
   - Navigate to `http://localhost:5173/users`.
2. **Test Modal**:
   - Click "Create User" to open the modal.
   - Verify modal appears with username and email fields.
   - Test validation:
     - Submit empty form (should show errors).
     - Enter invalid email (e.g., "test") (should show "Invalid email address").
     - Enter username < 3 chars (should show "Username must be at least 3 characters").
   - Submit valid data and check:
     - Modal closes.
     - Success toast appears.
     - New user appears at the top of the table.
3. **Test Table Update**:
   - Verify new user is added to the table without refetching (check `_id`, username, email, default `role: 'user'`, `isBlocked: false`).
   - Ensure table sorting and filtering still work.
4. **Test Error Handling**:
   - Simulate API failure (e.g., mock 400 response) and verify error toast.
   - Ensure modal remains open on error.
5. **Test Auth**:
   - Ensure non-admins can't access `UsersPage` (redirects to `/` or `/login`).
   - Verify `POST /users` is protected by admin auth.
6. **Test UI/UX**:
   - Check modal responsiveness on mobile (fields stack vertically).
   - Test keyboard navigation (Tab, Enter to submit).
   - Verify loading state during submission.

### Troubleshooting
- **Modal Not Opening**:
  - Log `isModalOpen`: `console.log(isModalOpen)` in `UsersPage`.
  - Ensure `CreateUserModal` is imported and rendered.
- **Form Not Submitting**:
  - Log form values: `console.log(form.watch())` in `CreateUserModal`.
  - Verify `/users` endpoint and `axiosInstance` configuration.
- **User Not Added to Table**:
  - Log Redux state: `console.log(useSelector((state: RootState) => state.userManagement.users))`.
  - Ensure `addUser` action is dispatched and `POST /users` returns `{ data: User }`.
- **Toasts Not Showing**:
  - Verify `Toaster` in `App.tsx` and `toastReducer` in store.
  - Check `useToast` dispatching `actionTypes.ADD_TOAST`.
- **Auth Issues**:
  - Log `auth` state: `console.log(useSelector((state: RootState) => state.auth))`.
  - Verify `/auth/me` response matches `User` type.

### Notes
- **Context**: Added a reusable `CreateUserModal` with a two-field form (username, email) that appears on `UsersPage` when clicking "Create User". Submits a POST request to `/users`, adds the new user to the top of the table via Redux, and provides a polished UI/UX with `shadcn/ui`.
- **Security**: Uses `httpOnly` cookies via `axiosInstance`, aligns with admin-only access.
- **ESLint**: Retains `actionTypes` usage in `toastReducer`, resolving the ESLint error.
- **Sources**:
  - `shadcn/ui` for `Dialog`, `Form`, `Input`, `Button`, `Toast`.
  - `react-hook-form` and `zod` for form handling.
  - Redux Toolkit for state management.
  - Previous artifacts for `userManagementSlice`, `useUserManagement`, `UserTable`, `UserCard`, `UserFilters`, `PaginationControls`.

If you need additional features (e.g., password field, role selection, edit user modal), or encounter issues (e.g., error messages, backend response format), please share details, and I’ll provide targeted assistance!



// app.get('/users', (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ message: 'No access token' });
//   }
//   try {
//     const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
//     if (payload.role !== 'admin') {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     const { page = 1, limit = 10, search, role, isBlocked, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
//     // Mock data (replace with database query)
//     const users = [
//       {
//         _id: '1',
//         username: 'user1',
//         email: 'user1@example.com',
//         role: 'user',
//         isBlocked: false,
//         createdAt: '2023-01-01T00:00:00Z',
//         updatedAt: '2023-01-01T00:00:00Z',
//       },
//       {
//         _id: '2',
//         username: 'admin1',
//         email: 'admin1@example.com',
//         role: 'admin',
//         isBlocked: true,
//         createdAt: '2023-02-01T00:00:00Z',
//         updatedAt: '2023-02-01T00:00:00Z',
//       },
//     ];
//     let filteredUsers = users;
//     if (search) {
//       filteredUsers = filteredUsers.filter(
//         (u) => u.username.includes(search) || u.email.includes(search)
//       );
//     }
//     if (role) {
//       filteredUsers = filteredUsers.filter((u) => u.role === role);
//     }
//     if (isBlocked !== undefined) {
//       filteredUsers = filteredUsers.filter((u) => u.isBlocked === (isBlocked === 'true'));
//     }
//     filteredUsers.sort((a, b) => {
//       const order = sortOrder === 'asc' ? 1 : -1;
//       return a[sortBy] > b[sortBy] ? order : -order;
//     });
//     const start = (page - 1) * limit;
//     const paginatedUsers = filteredUsers.slice(start, start + Number(limit));
//     res.json({ data: paginatedUsers, total: filteredUsers.length });
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid access token' });
//   }
// });

// app.patch('/users/:id', (req, res) => {
//   const accessToken = req.cookies.accessToken;
//   if (!accessToken) {
//     return res.status(401).json({ message: 'No access token' });
//   }
//   try {
//     const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
//     if (payload.role !== 'admin') {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
//     const { isBlocked } = req.body;
//     // Update user in database
//     res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid access token' });
//   }
// });
// ```

// ### Changes Made
// - **Removed `@tanstack/react-table`**:
//   - Replaced `useReactTable` and related logic in `UserTable` with a manual table rendering approach using Redux state.
//   - Defined columns as a simple array of objects with `key`, `header`, and `render` properties instead of `ColumnDef<User>[]`.
// - **Redux State Management**:
//   - Created `userManagementSlice` to manage all table-related state (`users`, `total`, `page`, etc.).
//   - Added thunks (`fetchUsers`, `toggleBlockUser`) to handle API calls.
//   - Defined actions for updating state (`setSearch`, `setSort`, etc.).
// - **Updated `useUserManagement`**:
//   - Uses Redux `useSelector` and `useDispatch` instead of local `useState`.
//   - Dispatches actions to update state and triggers API calls via thunks.
//   - Maintains the same interface for compatibility with `UsersPage`, `UserCard`, `UserFilters`, and `PaginationControls`.
// - **Updated `UserTable`**:
//   - Renders table headers and rows manually using the `columns` array from `useUserManagement`.
//   - Implements sorting by dispatching `setSort` action when headers are clicked.
//   - Displays a "No users found" message when the `users` array is empty.
// - **Integration**:
//   - Ensured `UsersPage` dispatches `fetchUsers` on mount and integrates with updated `useUserManagement`.
//   - Kept `UserCard`, `UserFilters`, and `PaginationControls` unchanged for consistency.

// ### Why This Works
// - **Redux-Centric**: All table state (sorting, pagination, filtering) is managed in the Redux store, replacing `react-table`'s internal state.
// - **Maintains Functionality**: Preserves search, filter, sort, pagination, and blocking features.
// - **Security**: Uses `httpOnly` cookies via `axiosInstance`, aligning with your auth setup.
// - **ESLint**: Retains `actionTypes` usage in `toastReducer`, resolving the ESLint error.
// - **Reusability**: The `useUserManagement` hook and components remain modular and reusable.

// ### Testing
// 1. **Run the App**:
//    - Start Vite: `npm run dev`.
//    - Navigate to `http://localhost:5173/users`.
// 2. **Test Table**:
//    - Verify table renders users with columns (username, email, role, status, created, updated, actions).
//    - Click headers to sort (e.g., username, email) and check sort indicators (↑/↓).
//    - Ensure "No users found" displays when no users match filters.
// 3. **Test Features**:
//    - **Search**: Search by username or email.
//    - **Filter**: Filter by role (`user`/`admin`) and status (`active`/`blocked`).
//    - **Pagination**: Change pages and page sizes.
//    - **Blocking**: Toggle block status and verify toasts.
//    - **View Toggle**: Switch between list and card views.
// 4. **Test Auth**:
//    - Refresh the browser and check `/auth/me` and `/users` requests.
//    - Ensure non-admins are redirected to `/` or `/login`.
//    - Test with expired `accessToken` to verify token refresh.
// 5. **Test Toasts**:
//    - Verify success/error toasts for API calls (e.g., fetch users, toggle block).
//    - Check Redux state: `console.log(useSelector((state: RootState) => state.toasts))`.
// 6. **TypeScript/ESLint**:
//    - Run `tsc --noEmit` to confirm no TypeScript errors.
//    - Run `npm run lint` to verify `actionTypes` error is resolved.

// ### Troubleshooting
// - **Table Not Rendering**:
//   - Log `users` and `columns`: `console.log(users, columns)` in `UserTable`.
//   - Verify `/users` endpoint returns `{ data: User[], total: number }`.
//   - Check `fetchUsers` is dispatched in `UsersPage` `useEffect`.
// - **Sorting Not Working**:
//   - Log `sortBy` and `sortOrder`: `console.log(useSelector((state: RootState) => state.userManagement))`.
//   - Ensure `setSort` dispatches correctly in `UserTable`.
// - **Toasts Not Showing**:
//   - Verify `Toaster` in `App.tsx` and `toastReducer` in store.
//   - Check `useToast` dispatching `actionTypes.ADD_TOAST`.
// - **Auth Issues**:
//   - Log `auth` state: `console.log(useSelector((state: RootState) => state.auth))`.
//   - Verify `/auth/me` response matches `User` type.
// - **ESLint Error**:
//   - Ensure `actionTypes` is used in `toastReducer`.
//   - Suppress if unused: `// eslint-disable-next-line @typescript-eslint/no-unused-vars`.

// ### Notes
// - **Context**: Replaced `react-table` with Redux-based state management for the user management table, maintaining all features (search, filter, sort, pagination, blocking) in your React + Vite project.
// - **Security**: Uses `httpOnly` cookies, avoids `localStorage`.
// - **ESLint**: `actionTypes` used in `toastReducer`, resolving error.
// - **Sources**:
//   - Redux Toolkit for state management.
//   - `shadcn/ui` for UI components.
//   - Previous artifacts for `UserCard`, `UserFilters`, `PaginationControls`, `authSlice`.

// If you need additional features (e.g., edit/delete actions, more filters, or a login page), or encounter issues (e.g., error messages, backend response format), please share details, and I’ll provide targeted assistance!
