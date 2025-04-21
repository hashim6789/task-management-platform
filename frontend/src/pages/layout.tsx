import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { useState } from "react";
import { Footer, Navbar, Sidebar } from "@/components";

export const Layout: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        theme === "dark" ? "dark" : ""
      )}
    >
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-8 bg-background overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
