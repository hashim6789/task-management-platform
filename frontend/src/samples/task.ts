import { Task } from "@/types";

export const sampleTasks: Task[] = [
  {
    _id: "607f1f77bcf86cd799439021",
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage design.",
    status: "in-progress",
    assignedTo: "507f1f77bcf86cd799439011",
    createdAt: "2025-04-18T09:00:00Z",
    updatedAt: "2025-04-18T14:30:00Z",
  },
  {
    _id: "607f1f77bcf86cd799439022",
    title: "Fix Login Bug",
    description:
      "Resolve issue with user authentication failing on edge cases.",
    status: "pending",
    assignedTo: "507f1f77bcf86cd799439012",
    createdAt: "2025-04-17T11:15:00Z",
    updatedAt: "2025-04-17T11:15:00Z",
  },
  {
    _id: "607f1f77bcf86cd799439023",
    title: "Update Database Schema",
    description: "Add new fields to user table for profile enhancements.",
    status: "completed",
    assignedTo: "507f1f77bcf86cd799439014",
    createdAt: "2025-04-16T13:20:00Z",
    updatedAt: "2025-04-17T10:00:00Z",
  },
  {
    _id: "607f1f77bcf86cd799439024",
    title: "Write API Documentation",
    description: "Document endpoints for the new REST API.",
    status: "in-progress",
    assignedTo: "507f1f77bcf86cd799439015",
    createdAt: "2025-04-15T16:40:00Z",
    updatedAt: "2025-04-18T08:50:00Z",
  },
  {
    _id: "607f1f77bcf86cd799439025",
    title: "Test Payment Integration",
    description: "Perform end-to-end testing for Stripe payment gateway.",
    status: "pending",
    assignedTo: "507f1f77bcf86cd799439011",
    createdAt: "2025-04-14T10:30:00Z",
    updatedAt: "2025-04-14T10:30:00Z",
  },
];
