import { Outlet } from "react-router-dom";
import { Sidebar, MobileBottomNav } from "./Sidebar";

export const DashboardLayout = () => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <main className="lg:ml-16 min-h-screen pb-20 lg:pb-0">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Outlet />
      </div>
    </main>
    <MobileBottomNav />
  </div>
);
