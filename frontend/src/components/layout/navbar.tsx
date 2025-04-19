import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";

// Navbar Component
export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  console.log(user, "navbar");

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 flex justify-between items-center z-20">
      <div className="text-xl font-bold">Task Manager</div>
      <div className="relative">
        <button
          className="px-4 py-2 rounded-md font-medium bg-blue-700 hover:bg-blue-800 text-white transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {user?.email}
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
