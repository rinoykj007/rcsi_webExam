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
    <div className="sticky top-0 z-10 bg-gradient-to-b from-white via-white to-gray-50/50 border-b border-gray-200/80 shadow-md overflow-x-auto backdrop-blur-sm">
      <div className="flex gap-0 min-w-min md:min-w-0 justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-around gap-2 md:gap-2.5 px-4 sm:px-5 md:px-8 py-4 md:py-6 transition-all duration-300 ease-out relative group flex-shrink-0 ${
                isActive
                  ? "text-[#4a47a3]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {/* Animated bottom border indicator */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-400 ease-out ${
                  isActive
                    ? "bg-gradient-to-r from-[#4a47a3] to-[#6b67d3] shadow-lg shadow-[#4a47a3]/30"
                    : "bg-transparent group-hover:bg-gray-300/60"
                }`}
              />

              {/* Background glow effect for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-[#4a47a3]/8 rounded-lg pointer-events-none" />
              )}

              {/* Content wrapper */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 md:gap-2">
                <div
                  className={`transition-all duration-300 ease-out ${
                    isActive ? "scale-120" : "scale-100 group-hover:scale-110"
                  }`}
                >
                  <Icon
                    size={22}
                    className="md:w-7 md:h-7"
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                </div>
                <span
                  className={`text-[10px] md:text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-all duration-300 ${
                    isActive ? "font-bold text-[#4a47a3]" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
