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
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-gutter py-4">
          <div className="flex items-center gap-8">
            <span className="text-lg font-semibold tracking-tight">Rewind</span>
            <nav className="flex items-center gap-1">
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
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-sm text-inkSoft hover:text-ink transition-colors"
              title="Toggle theme"
            >
              Theme
            </button>
            <button onClick={logout} className="btn-ghost">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-gutter py-8">
        <Outlet />
      </main>
    </div>
  );
}