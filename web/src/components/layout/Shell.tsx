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
      <header className="sticky top-0 z-10 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-gutter py-3 md:py-4">
          
          <div className="flex items-center gap-6 overflow-hidden">
            <span className="text-lg font-semibold tracking-tight shrink-0">Rewind</span>
            
            {/* Horizontal scroll on mobile, normal row on desktop */}
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `rounded-pill px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-ink text-cream"
                        : "text-inkSoft hover:bg-ink/5 hover:text-ink"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0 pl-2">
            <button
              onClick={toggleTheme}
              className="text-xs md:text-sm text-inkSoft hover:text-ink transition-colors"
            >
              Theme
            </button>
            <button onClick={logout} className="btn-ghost px-3 py-1.5 text-xs md:text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-gutter py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}