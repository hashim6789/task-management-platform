// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axiosInstance from '@/lib/axiosInstance';
// import { Role, User } from '@/types';

// interface AuthState {
//   user: User | null;
//   currentRole: Role;
//   isAuthenticated: boolean;
//   isBlocked: boolean;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   currentRole: 'user',
//   isAuthenticated: false,
//   isBlocked: false,
//   loading: false,
//   error: null,
// };

// // Thunk to fetch user data
// export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get<{ data: User }>('/auth/me');
//     return response.data.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       const user = action.payload;
//       state.user = user;
//       state.isAuthenticated = true;
//       state.isBlocked = user.isBlocked;
//       state.currentRole = user.role;
//       state.error = null;
//     },
//     clearUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.currentRole = 'user';
//       state.isBlocked = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//         state.isBlocked = action.payload.isBlocked;
//         state.currentRole = action.payload.role;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.user = null;
//         state.isAuthenticated = false;
//         state.isBlocked = false;
//         state.currentRole = 'user';
//       });
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export const authReducer = authSlice.reducer;
// ```

// **Changes**:
// - Added `loading` and `error` fields to `AuthState` to track async state.
// - Added `fetchUser` thunk to fetch user data via `axiosInstance`.
// - Removed `localStorage` usage, relying on cookies.
// - Updated `extraReducers` to handle `fetchUser` states.

// #### 2. Update Redux Store
// Include the `auth` slice and `toasts` reducer (from your custom toast implementation) in the store.

// <xaiArtifact artifact_id="d5cf3294-9d21-47e1-af24-1db38839e17d" artifact_version_id="15d19794-1563-4cf4-844e-4c81e571124a" title="store.ts" contentType="text/typescript">
// ```typescript
// import { configureStore } from '@reduxjs/toolkit';
// import { authReducer } from '@/features/authSlice';
// import { toastReducer } from '@/components/ui/toastReducer';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     toasts: toastReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// ```

// #### 3. Custom Toast Implementation
// Use the custom `toastReducer` and `useToast` to handle notifications, ensuring `actionTypes` is used to resolve the ESLint error.

// <xaiArtifact artifact_id="88a8bf0d-474d-4b8c-af59-56129c5745e0" artifact_version_id="ff41593f-5e26-4745-a0e9-751bdd2fcd86" title="toastReducer.ts" contentType="text/typescript">
// ```typescript
// import { generateId } from 'ai';

// const actionTypes = {
//   ADD_TOAST: 'ADD_TOAST',
//   UPDATE_TOAST: 'UPDATE_TOAST',
//   DISMISS_TOAST: 'DISMISS_TOAST',
//   REMOVE_TOAST: 'REMOVE_TOAST',
// } as const;

// type ActionType = typeof actionTypes[keyof typeof actionTypes];

// type Toast = {
//   id: string;
//   title?: string;
//   description?: string;
//   variant?: 'default' | 'destructive';
// };

// type ToastAction =
//   | { type: typeof actionTypes.ADD_TOAST; payload: Omit<Toast, 'id'> }
//   | { type: typeof actionTypes.UPDATE_TOAST; payload: Toast }
//   | { type: typeof actionTypes.DISMISS_TOAST; payload: { id: string } }
//   | { type: typeof actionTypes.REMOVE_TOAST; payload: { id: string } };

// type ToastState = {
//   toasts: Toast[];
// };

// const initialState: ToastState = {
//   toasts: [],
// };

// export function toastReducer(state: ToastState = initialState, action: ToastAction): ToastState {
//   switch (action.type) {
//     case actionTypes.ADD_TOAST: {
//       const id = generateId();
//       return {
//         ...state,
//         toasts: [...state.toasts, { id, ...action.payload }],
//       };
//     }
//     case actionTypes.UPDATE_TOAST: {
//       return {
//         ...state,
//         toasts: state.toasts.map((toast) =>
//           toast.id === action.payload.id ? { ...toast, ...action.payload } : toast
//         ),
//       };
//     }
//     case actionTypes.DISMISS_TOAST: {
//       return {
//         ...state,
//         toasts: state.toasts.map((toast) =>
//           toast.id === action.payload.id ? { ...toast, variant: 'default' } : toast
//         ),
//       };
//     }
//     case actionTypes.REMOVE_TOAST: {
//       return {
//         ...state,
//         toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
//       };
//     }
//     default:
//       return state;
//   }
// }

// export { actionTypes, type Toast, type ToastAction };
// ```

// <xaiArtifact artifact_id="88a8bf0d-474d-4b8c-af59-56129c5745e0" artifact_version_id="8b2538eb-feb1-4e56-81ae-2a9f55fc4565" title="useToast.ts" contentType="text/typescript">
// ```typescript
// import { useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import { actionTypes, Toast } from './toastReducer';
// import { generateId } from 'ai';

// export function useToast() {
//   const dispatch = useDispatch();

//   const toast = useCallback(
//     ({ title, description, variant }: Omit<Toast, 'id'>) => {
//       const id = generateId();
//       dispatch({
//         type: actionTypes.ADD_TOAST,
//         payload: { title, description, variant },
//       });
//       return {
//         id,
//         dismiss: () => dispatch({ type: actionTypes.DISMISS_TOAST, payload: { id } }),
//         remove: () => dispatch({ type: actionTypes.REMOVE_TOAST, payload: { id } }),
//       };
//     },
//     [dispatch]
//   );

//   return { toast };
// }
// ```

// #### 4. Update Toaster Component
// Render toasts from the Redux store:

// <xaiArtifact artifact_id="88a8bf0d-474d-4b8c-af59-56129c5745e0" artifact_version_id="6e4116d9-e94f-49fd-bdd3-54aff5fb0ea2" title="toaster.tsx" contentType="text/typescript">
// ```typescript
// import { useSelector } from 'react-redux';
// import { Toast } from '@/components/ui/toast';
// import { RootState } from '@/store';

// export function Toaster() {
//   const toasts = useSelector((state: RootState) => state.toasts.toasts);

//   return (
//     <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
//       {toasts.map((toast) => (
//         <Toast key={toast.id} {...toast} />
//       ))}
//     </div>
//   );
// }
// ```

// #### 5. Update App.tsx
// Dispatch the `fetchUser` thunk on app mount to handle browser refreshes:

// <xaiArtifact artifact_id="e3d60b62-537e-4d1d-9ff7-ddbe119e7ddf" artifact_version_id="e19bd33c-c798-45d2-af53-eea2607bcf4f" title="App.tsx" contentType="text/typescript">
// ```typescript
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from '@/components/ui/toaster';
// import CreateUserForm from '@/components/CreateUserForm';
// import UsersPage from '@/components/UsersPage';
// import { store } from '@/store';
// import { fetchUser } from '@/features/authSlice';
// import './App.css';

// function AppContent() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUser());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <Routes>
//         <Route path="/users" element={<UsersPage />} />
//         <Route path="/users/create" element={<CreateUserForm />} />
//         <Route path="/" element={<UsersPage />} />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <AppContent />
//       </Router>
//     </Provider>
//   );
// }
// ```

// #### 6. Update CreateUserForm
// Use Redux to access `auth` state, check user authorization, and display toasts for errors:

// <xaiArtifact artifact_id="ae456966-4d8d-4780-95a2-e2ac166e7459" artifact_version_id="74cdd7cf-f05c-4976-9488-1866abb33aa5" title="CreateUserForm.tsx" contentType="text/typescript">
// ```typescript
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useToast } from '@/components/ui/use-toast';
// import axiosInstance from '@/lib/axiosInstance';

// // Define the form schema with Zod
// const formSchema = z.object({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   role: z.enum(['user', 'admin'], {
//     required_error: 'Please select a role',
//   }),
//   isBlocked: z.boolean().default(false),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function CreateUserForm() {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       username: '',
//       email: '',
//       password: '',
//       role: 'user',
//       isBlocked: false,
//     },
//   });

//   const onSubmit = async (values: FormValues) => {
//     try {
//       const response = await axiosInstance.post('/users', values);
//       toast({
//         title: 'Success',
//         description: response.data.message || 'User created successfully',
//       });
//       navigate('/users');
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: error.response?.data?.message || 'Failed to create user',
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error || !isAuthenticated) {
//     toast({
//       variant: 'destructive',
//       title: 'Error',
//       description: error || 'You are not authenticated',
//     });
//     navigate('/login'); // Redirect to login if not authenticated
//     return null;
//   }

//   if (!user || user.role !== 'admin') {
//     toast({
//       variant: 'destructive',
//       title: 'Unauthorized',
//       description: 'You are not authorized to create users',
//     });
//     navigate('/users');
//     return null;
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter username" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input type="email" placeholder="Enter email" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="Enter password" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="role"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Role</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="user">User</SelectItem>
//                   <SelectItem value="admin">Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="isBlocked"
//           render={({ field }) => (
//             <FormItem className="flex items-center space-x-2">
//               <FormControl>
//                 <Checkbox
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//               <FormLabel className="text-sm font-medium">Block user</FormLabel>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex space-x-4">
//           <Button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700"
//             disabled={form.formState.isSubmitting}
//           >
//             {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full"
//             onClick={() => navigate('/users')}
//           >
//             Cancel
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
// ```

// #### 7. Backend Endpoints
// Ensure your backend supports:
// - **`/auth/me`**: Returns the current user's data based on `accessToken`.
// - **`/users`**: Creates a new user, restricted to admins.

// Example `/auth/me`:

// ```javascript
app.get('/auth/me', (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: 'No access token' });
  }
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    // Fetch user from database
    const user = {
      id: payload.userId,
      username: 'test',
      email: 'test@example.com',
      role: payload.role || 'user',
      isBlocked: false,
    };
    res.json({ data: user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid access token' });
  }
});
```

Example `/users`:

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
    const { username, email, password, role, isBlocked } = req.body;
    // Create user in database
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid access token' });
  }
});
```

#### 8. Types (if not already defined)
Ensure `types/index.ts` includes `User` and `Role`:

<xaiArtifact artifact_id="2fc07b3b-22cd-4474-96e8-a49720a81fe7" artifact_version_id="03c85873-2c7d-4f17-bfa6-9af2a3109881" title="types/index.ts" contentType="text/typescript">
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isBlocked: boolean;
}

export type Role = 'user' | 'admin';
```

### Why This Works
- **Handles Browser Refresh**: The `fetchUser` thunk is dispatched in `App.tsx` via `useEffect`, triggering a `/auth/me` request on app mount (including refreshes).
- **Redux State Restoration**: The `auth` slice updates with user data from the backend response, restoring `user`, `isAuthenticated`, `currentRole`, and `isBlocked`.
- **Security**: Uses `httpOnly` cookies via `axiosInstance`, avoiding `localStorage` for better security (prevents XSS).
- **ESLint Fix**: The `actionTypes` object is used in `toastReducer` and `useToast`, resolving the ESLint error (`'actionTypes' is assigned a value but only used as a type`).
- **Integration**: Seamlessly works with `CreateUserForm`, `useToast`, `react-router-dom`, and `axiosInstance` (with token refresh for 401 errors).

### Testing
1. **Run the App**:
   - Start Vite: `npm run dev`.
   - Navigate to `http://localhost:5173/users/create`.
2. **Test Browser Refresh**:
   - Refresh the browser and check the **Network** tab for a `/auth/me` request.
   - Verify `auth` state updates (e.g., `console.log(useSelector((state: RootState) => state.auth))`).
   - Ensure toasts show for errors (e.g., invalid token).
3. **Test Form Submission**:
   - Submit the form and verify toasts:
     - Success: "User created successfully".
     - Error: "Failed to create user".
   - Check validation (e.g., username < 3 characters).
   - Ensure only admins can access the form.
4. **Test Token Refresh**:
   - Set an expired `accessToken` cookie to trigger a 401.
   - Submit the form and check for `/auth/refresh` and retried `/users` requests.
5. **Test Toasts**:
   - Verify toasts render via `Toaster` in `App.tsx`.
   - Check Redux state: `console.log(useSelector((state: RootState) => state.toasts))`.
6. **TypeScript/ESLint**:
   - Run `tsc --noEmit` to confirm no TypeScript errors.
   - Run `npm run lint` to verify the `actionTypes` error is resolved.

### Troubleshooting
- **No Request on Refresh**:
  - Verify `fetchUser` is dispatched in `App.tsx` `useEffect`.
  - Check `axiosInstance` configuration (e.g., `withCredentials: true`, token refresh interceptor).
  - Log dispatch: `console.log('Dispatching fetchUser')` in `useEffect`.
- **Auth State Not Updating**:
  - Log state: `console.log(useSelector((state: RootState) => state.auth))`.
  - Verify `/auth/me` response matches `User` type (e.g., `{ data: { id, username, email, role, isBlocked } }`).
- **Toasts Not Showing**:
  - Ensure `Toaster` is in `App.tsx` and `toastReducer` is in the store.
  - Verify `useToast` dispatches `actionTypes.ADD_TOAST`.
  - Check `toast.tsx` for rendering issues (e.g., CSS conflicts).
- **ESLint Error Persists**:
  - Confirm `actionTypes` is used in `toastReducer`.
  - If not needed, remove or suppress:
    ```typescript
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const actionTypes = { ... };
    ```
- **Form Issues**:
  - Verify `zod` schema and `react-hook-form` types.
  - Log errors: `console.log(form.formState.errors)`.

### Notes
- **Context**: Replaces `localStorage` with a `/auth/me` request to restore Redux `auth` state on browser refresh, using `httpOnly` cookies via `axiosInstance`. Integrates with `CreateUserForm`, custom `useToast`, and `react-router-dom`.
- **ESLint Fix**: `actionTypes` is used in `toastReducer`, resolving the error.
- **Security**: Avoids `localStorage` to prevent XSS, aligning with your cookie-based auth.
- **Sources**:
  - Redux Toolkit documentation for `createSlice` and `createAsyncThunk`.
  - `shadcn/ui` documentation for `Toast`.
  - `react-hook-form` and `zod` documentation.

If you need additional features (e.g., `UsersPage` component, login page, or specific error handling), or if you encounter errors, please share details (e.g., error messages, `axiosInstance` code, or backend response format), and I’ll provide targeted assistance!