// import { Navigate } from "react-router-dom";
// import { Role } from "../types";
// import LoginPage from "../modules/auth/pages/Login";
// import { UserRole } from "../types";
// import ProtectedRoute from "./ProtectedRoute";
// import AdminDashboard from "../modules/admin/pages/AdminDashboard";
// import AdminUserDetails from "../modules/admin/pages/users/AdminUserDetails";
// import AdminUserManagement from "../modules/admin/pages/users/AdminUserManagement";
// import AdminCourseManagement from "../modules/admin/pages/course/AdminCourseManagement";
// import AdminCategoryManagement from "../modules/admin/pages/category/AdminCategoryManagement";
// import CourseDetailsPage from "../modules/shared/pages/CourseDetails";
// import Layout from "../modules/layouts/Layout";
// import loginImage from "../assets/img/wall_paer_02.jpeg";
// import AdminRevenueManagement from "../modules/admin/pages/revenue/AdminReveneManagement";

export const UserRoutes = () => [
  //   {
  //     path: "/admin",
  //     children: [
  //       {
  //         element: <ProtectedRoute role="admin" />,
  //         children: [
  //           {
  //             element: <Layout role="admin" />,
  //             children: [
  //               { path: "dashboard", element: <AdminDashboard /> },
  //               {
  //                 path: "learners",
  //                 element: <AdminUserManagement role="learner" />,
  //               },
  //               {
  //                 path: "learners/:learnerId",
  //                 element: <AdminUserDetails role="learner" />,
  //               },
  //               {
  //                 path: "mentors",
  //                 element: <AdminUserManagement role="mentor" />,
  //               },
  //               {
  //                 path: "mentors/:mentorId",
  //                 element: <AdminUserDetails role="mentor" />,
  //               },
  //               {
  //                 path: "courses",
  //                 element: <AdminCourseManagement />,
  //               },
  //               {
  //                 path: "courses/:courseId",
  //                 element: <CourseDetailsPage role="admin" />,
  //               },
  //               {
  //                 path: "categories",
  //                 element: <AdminCategoryManagement />,
  //               },
  //               {
  //                 path: "revenue",
  //                 element: <AdminRevenueManagement />,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
];
