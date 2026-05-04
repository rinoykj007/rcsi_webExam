import { useLocation, useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface TabNavigationProps {
  tabs: Tab[];
}

const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTabActive = (tabPath: string) => {
    const currentPath = location.pathname;
    const normalizedTabPath = tabPath.replace(/\/$/, "");
    const normalizedCurrentPath = currentPath.replace(/\/$/, "");
    return normalizedCurrentPath === normalizedTabPath;
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-10 flex justify-center px-4">
      <div className="mx-auto max-w-lg bg-blue-50 rounded-full shadow-lg px-4 py-2.5 flex gap-1 overflow-x-auto justify-around border border-blue-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 sm:px-3 py-1.5 transition-all duration-300 ease-out relative group flex-shrink-0 ${
                isActive ? "text-rcsi-navy" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className={`text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive ? "font-bold text-rcsi-navy" : "text-gray-500"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
