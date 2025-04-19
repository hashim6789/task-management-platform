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
