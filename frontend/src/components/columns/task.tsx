// interface TableColumn {
//   key: string;
//   header: string;
//   render: (task?: Task) => JSX.Element;
// }

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select";
// import { Task } from "@/types";
// import { JSX } from "react";

// const columns: TableColumn[] = [
//     {
//       key: "title",
//       header: "Title",
//       render: (task?: Task) => (
//         <div className="font-medium text-gray-900">{task?.title ?? "N/A"}</div>
//       ),
//     },
//     {
//       key: "description",
//       header: "Description",
//       render: (task?: Task) => (
//         <div className="truncate max-w-xs text-gray-600">
//           {task?.description ?? "N/A"}
//         </div>
//       ),
//     },
//     {
//       key: "status",
//       header: "Status",
//       render: (task?: Task) =>
//         task ? (
//           currentUser?.role === "user" && taskManagement.isManagement ? (
//             <Select
//               value={task.status}
//               onValueChange={(value: TaskStatus) =>
//                 handleUpdateTaskStatus(task._id, value)
//               }
//             >
//               <SelectTrigger className="w-[140px] border-gray-300">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {STATUS_ORDER.map((status) => (
//                   <SelectItem
//                     key={status}
//                     value={status}
//                     disabled={
//                       currentUser?.role !== "user" &&
//                       STATUS_ORDER.indexOf(status) <=
//                         STATUS_ORDER.indexOf(task.status)
//                     }
//                   >
//                     <span
//                       className={`inline-block w-full ${STATUS_COLORS[status]} px-2 py-1 rounded`}
//                     >
//                       {status.charAt(0).toUpperCase() +
//                         status.slice(1).replace("-", " ")}
//                     </span>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ) : (
//             <div
//               className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                 STATUS_COLORS[task.status]
//               }`}
//             >
//               {task.status.charAt(0).toUpperCase() +
//                 task.status.slice(1).replace("-", " ")}
//             </div>
//           )
//         ) : (
//           <div className="text-gray-500">N/A</div>
//         ),
//     },
//     {
//       key: "assignedTo",
//       header: "Assigned To",
//       render: (task?: Task) =>
//         task &&
//         currentUser?.role === "admin" &&
//         taskManagement.isManagement &&
//         !task.assignedTo ? (
//           <Select
//             value="unassigned"
//             onValueChange={(userId: string) =>
//               handleAssignTask(
//                 task._id,
//                 userId === "unassigned" ? null : userId
//               )
//             }
//           >
//             <SelectTrigger className="w-[140px] border-gray-300">
//               <SelectValue placeholder="Select user" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="unassigned">Unassigned</SelectItem>
//               {users.map((user) => (
//                 <SelectItem key={user._id} value={user._id}>
//                   {user.username}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         ) : (
//           <div className="text-gray-700">
//             {task?.assignedTo?.username ?? "Unassigned"}
//           </div>
//         ),
//     },
//     {
//       key: "dueDate",
//       header: "Due Date",
//       render: (task?: Task) => {
//         const date = task?.dueDate ? new Date(task.dueDate) : null;
//         return (
//           <div className="text-gray-600">
//             {date && isValid(date) ? format(date, "PP") : "N/A"}
//           </div>
//         );
//       },
//     },
//     {
//       key: "createdAt",
//       header: "Created",
//       render: (task?: Task) => {
//         const date = task?.createdAt ? new Date(task.createdAt) : null;
//         return (
//           <div className="text-gray-600">
//             {date && isValid(date) ? format(date, "PP") : "N/A"}
//           </div>
//         );
//       },
//     },

//     {
//       key: "actions",
//       header: "Actions",
//       render: (task?: Task) => (
//         <button
//           onClick={() => navigate(`/tasks/${task?._id}`)}
//           className="text-blue-600 hover:underline font-medium"
//         >
//           View
//         </button>
//       ),
//     },
//   ];
