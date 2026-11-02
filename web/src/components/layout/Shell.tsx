import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { PageTransition } from "./PageTransition";
import { CommandPalette } from "./CommandPalette"; // NEW

const links = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/decisions", label: "Decisions" },
  { to: "/dashboard/patterns", label: "Patterns" },
  { to: "/dashboard/library", label: "Library" },
  { to: "/dashboard/settings", label: "Settings" }
];

export function Shell() {
  const { logout } = useAuth();

  function toggleTheme() {
    window.dispatchEvent(new Event("toggle-theme"));
  }

  return (
    <div className="min-h-full flex flex-col bg-cream">
      <CommandPalette /> {/* MOVED INSIDE THE ROUTER */}
      
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md px-4 pt-6 pb-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <Link to="/dashboard" className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-accent shadow-neu-sm flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <span className="text-xl font-extrabold tracking-tight">Rewind</span>
          </Link>

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

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-inkFaint px-3 py-1.5 rounded-lg bg-cream shadow-neu-sm mr-2">
              <span>Press</span>
              <kbd className="bg-cream shadow-neu-pressed px-1.5 py-0.5 rounded text-inkSoft font-mono">⌘</kbd>
              <kbd className="bg-cream shadow-neu-pressed px-1.5 py-0.5 rounded text-inkSoft font-mono">K</kbd>
            </div>

            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full bg-cream shadow-neu-sm flex items-center justify-center text-sm font-bold active:shadow-neu-sm-pressed"
            >
              T
            </button>
            <button onClick={logout} className="btn-ghost px-4 py-2 text-xs">
              Sign out
            </button>
          </div>
        </div>

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
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}