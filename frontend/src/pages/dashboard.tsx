import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend as PieLegend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store";
import { fetchTasks, fetchUsers } from "@/store/thunks";
import { useAppDispatch } from "@/store/hook";

export type TaskStatus = "todo" | "in-progress" | "completed";

export const AnalyticsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const taskState = useSelector((state: RootState) => state.taskManagement);
  const userState = useSelector((state: RootState) => state.userManagement);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
    if (currentUser && currentUser.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [currentUser, currentUser?.role, dispatch]);

  // Task status distribution for Bar Chart
  const taskStatusData = [
    {
      name: "Todo",
      count: taskState.tasks.filter((t) => t.status === "todo").length,
    },
    {
      name: "In Progress",
      count: taskState.tasks.filter((t) => t.status === "in-progress").length,
    },
    {
      name: "Completed",
      count: taskState.tasks.filter((t) => t.status === "completed").length,
    },
  ];

  // Task status distribution for Pie Chart
  const pieChartData = taskStatusData.map((item) => ({
    name: item.name,
    value: item.count,
  }));

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1"];

  // Tasks per user (for admin view)
  const tasksPerUser = userState.users.map((user) => ({
    name: user.username,
    tasks: taskState.tasks.filter((task) => task.assignedTo?._id === user._id)
      .length,
  }));

  // User status distribution for Pie Chart (Blocked vs Active)
  const userStatusData = [
    {
      name: "Active",
      value: userState.users.filter((u) => u.isBlocked === false).length,
    },
    {
      name: "Blocked",
      value: userState.users.filter((u) => u.isBlocked === true).length,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Task Analytics Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {currentUser && currentUser.role === "admin" && (
            <TabsTrigger value="user-analytics">User Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {pieChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <PieLegend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {currentUser && currentUser.role === "admin" && (
          <TabsContent value="user-analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks Per User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tasksPerUser}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tasks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {userStatusData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <PieLegend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
