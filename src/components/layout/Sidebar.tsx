import { NavLink } from "react-router-dom";
import { Home, BarChart3, CalendarDays, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
];

export const Sidebar = () => {
  const { signOut, profile, user } = useAuthStore();
  const avatarUrl = (user?.user_metadata as Record<string, any> | undefined)?.avatar_url
    ?? (user?.user_metadata as Record<string, any> | undefined)?.picture;
  const name = profile?.name ?? user?.email?.split("@")[0] ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 w-16 flex-col items-center border-r border-sidebar-border bg-sidebar h-screen z-20 py-5 gap-2">
      {/* Logo */}
      <div className="h-9 w-9 rounded-xl bg-rcsi-purple text-white grid place-items-center font-display font-bold text-sm mb-4">
        R
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `h-10 w-10 rounded-xl grid place-items-center transition ${
                isActive
                  ? "bg-rcsi-navy text-white shadow-soft"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`
            }
          >
            <Icon size={19} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={signOut}
          title="Sign out"
          className="h-10 w-10 rounded-xl grid place-items-center text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition"
        >
          <LogOut size={18} />
        </button>
        <div className="h-9 w-9 rounded-xl overflow-hidden bg-rcsi-purple-soft grid place-items-center font-display font-bold text-rcsi-navy text-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
      </div>
    </aside>
  );
};

export const MobileBottomNav = () => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border h-16 flex">
    {navItems.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
            isActive ? "text-rcsi-navy dark:text-white" : "text-muted-foreground"
          }`
        }
      >
        <Icon size={20} />
        {label}
      </NavLink>
    ))}
  </nav>
);
