import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";

// Sidebar Component
export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Collapsible on mobile

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
      roles: ["user", "admin"],
    },
    { name: "Tasks", path: "/tasks", icon: "📋", roles: ["user", "admin"] },
    {
      name: "Create Task",
      path: "/tasks/create",
      icon: "➕",
      roles: ["user", "admin"],
    },
    { name: "Users", path: "/users", icon: "👥", roles: ["admin"] },
  ];

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-8rem)] bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } md:w-64 z-10`}
    >
      <button
        className="md:hidden p-4 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="mt-4">
          {navItems
            .filter((item) => item.roles.includes(user?.role || "user"))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-4 hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl mr-4">{item.icon}</span>
                  <span className={`${isOpen ? "block" : "hidden"} md:block`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
