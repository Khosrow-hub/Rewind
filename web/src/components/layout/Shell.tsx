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
    <div className="min-h-full flex flex-col bg-cream">
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-accent shadow-neu-sm flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <span className="text-xl font-extrabold tracking-tight">Rewind</span>
          </div>

          {/* Desktop Nav Pill */}
          <nav className="hidden md:flex items-center gap-2 p-2 rounded-pill bg-cream shadow-neu-flat">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-pill px-5 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? "shadow-neu-pressed text-accentHover"
                      : "text-inkSoft hover:text-ink hover:shadow-neu-sm"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full bg-cream shadow-neu-sm flex items-center justify-center text-sm font-bold active:shadow-neu-sm-pressed"
              title="Toggle Theme"
            >
              {/* No emoji, just letters */}
              T
            </button>
            <button onClick={logout} className="btn-ghost px-4 py-2 text-xs">
              Sign out
            </button>
          </div>
        </div>

        {/* Mobile Nav - Horizontal Scroll */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar mt-4 pb-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-pill px-5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "shadow-neu-pressed text-accentHover"
                    : "bg-cream text-inkSoft shadow-neu-sm"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-gutter py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}