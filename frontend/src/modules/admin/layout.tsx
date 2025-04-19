import { Footer, Navbar, Sidebar } from "@/components/layout";
import { Outlet } from "react-router-dom";

// Main Layout Component
const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 p-6 ml-16 md:ml-64 bg-gray-100 min-h-[calc(100vh-8rem)]">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
