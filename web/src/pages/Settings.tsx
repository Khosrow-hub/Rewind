import { useAuth } from "../features/auth/AuthContext";

const API_BASE = "https://rewind-api-b0t5.onrender.com";

export function Settings() {
  const { logout } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-inkSoft">Manage your account and data.</p>
      </header>

      <div className="space-y-gutter">
        <div className="bento">
          <h2 className="text-lg font-semibold tracking-tight">Export data</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Your decisions are yours. Download a complete copy of your data in JSON or CSV format.
            This includes all reasoning, timelines, and autopsies.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={`${API_BASE}/api/export/json`}
              download
              className="btn-primary"
            >
              Download JSON
            </a>
            <a
              href={`${API_BASE}/api/export/csv`}
              download
              className="btn-ghost"
            >
              Download CSV
            </a>
          </div>
        </div>

        <div className="bento">
          <h2 className="text-lg font-semibold tracking-tight">Account</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Password reset, email verification, and account deletion will live here in v1.5.
          </p>
          <button onClick={logout} className="btn-ghost mt-6">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}