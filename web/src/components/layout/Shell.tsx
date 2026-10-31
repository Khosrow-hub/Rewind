import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/decisions", label: "Decisions" },
  { to: "/patterns", label: "Patterns" },
  { to: "/library", label: "Library" },
  { to: "/settings", label: "Settings" }
];

export function Shell() {
  const { logout } = useAuth();

  function toggleTheme() {
    window.dispatchEvent(new Event("toggle-theme"));
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur pt-4 pb-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-gutter">
          
          <div className="flex items-center gap-6 overflow-hidden">
            <span className="text-lg font-bold tracking-tight shrink-0">Rewind</span>
            
            <nav className="hidden md:flex items-center gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `rounded-pill px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "shadow-neu-inset text-ink"
                        : "text-inkSoft hover:text-ink"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="text-xs font-medium text-inkSoft hover:text-ink transition-colors"
            >
              Theme
            </button>
            <button onClick={logout} className="btn-ghost px-4 py-1.5 text-xs">
              Sign out
            </button>
          </div>
        </div>

        {/* Mobile Nav - Scrollable Horizontal */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto no-scrollbar px-4 mt-4 pb-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-pill px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "shadow-neu-inset text-ink"
                    : "text-inkSoft"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-gutter py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}