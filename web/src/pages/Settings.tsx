import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { api } from "../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE = "";

type Session = {
  id: string;
  createdAt: string;
  expiresAt: string;
};

export function Settings() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isRevoking, setIsRevoking] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ sessions: Session[] }>("/api/auth/sessions")
  });

  async function revokeAll() {
    setIsRevoking(true);
    try {
      await api("/api/auth/sessions", { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      alert("All other devices have been logged out.");
    } catch (err) {
      alert("Failed to revoke sessions.");
    } finally {
      setIsRevoking(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-inkSoft">Manage your account and data.</p>
      </header>

      <div className="space-y-gutter">
        {/* EXPORT */}
        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Export data</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Download a complete copy of your data in JSON or CSV format.
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

        {/* SESSIONS */}
        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Active sessions</h2>
          <p className="mt-2 text-sm text-inkSoft mb-6">
            You are currently logged in on {data?.sessions.length || 0} device(s).
          </p>
          
          <button 
            onClick={revokeAll} 
            disabled={isRevoking || data?.sessions.length === 1}
            className="btn-primary w-full text-red-500 shadow-neu-flat hover:shadow-neu-pressed disabled:opacity-50"
          >
            {isRevoking ? "Revoking..." : "Log out of all other devices"}
          </button>
        </div>

        {/* ACCOUNT */}
        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Sign out of this device.
          </p>
          <button onClick={logout} className="btn-ghost mt-6">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}