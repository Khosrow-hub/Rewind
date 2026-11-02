import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useToast } from "../features/toast/ToastContext";
import { api } from "../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Added

const API_BASE = "";

type Session = {
  id: string;
  createdAt: string;
  expiresAt: string;
};

export function Settings() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Added
  const [isRevoking, setIsRevoking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Added

  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ sessions: Session[] }>("/api/auth/sessions"),
    staleTime: 0,
    refetchOnMount: "always"
  });

  async function revokeAll() {
    setIsRevoking(true);
    try {
      await api("/api/auth/sessions", { method: "DELETE" });
      queryClient.setQueryData(["sessions"], { sessions: [{ id: "current" }] });
      showToast("All other devices have been logged out.");
    } catch (err) {
      showToast("Failed to revoke sessions.", "error");
    } finally {
      setIsRevoking(false);
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you absolutely sure? This will permanently delete your account and every decision you have ever logged. This action cannot be undone."
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await api("/api/auth/account", { method: "DELETE" });
      showToast("Account deleted.");
      navigate("/");
    } catch (err) {
      showToast("Failed to delete account.", "error");
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-inkSoft">Manage your account and data.</p>
      </header>

      <div className="space-y-gutter">
        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Export data</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Download a complete copy of your data in JSON or CSV format.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`${API_BASE}/api/export/json`} download className="btn-primary">Download JSON</a>
            <a href={`${API_BASE}/api/export/csv`} download className="btn-ghost">Download CSV</a>
          </div>
        </div>

        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Active sessions</h2>
          
          {isLoading ? (
            <p className="mt-2 text-sm text-inkSoft mb-6">Loading sessions...</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-inkSoft mb-6">
                You are currently logged in on <strong>{data?.sessions.length || 1}</strong> device(s).
              </p>
              
              <button 
                onClick={revokeAll} 
                disabled={isRevoking || (data?.sessions.length || 1) <= 1}
                className="btn-primary w-full text-red-500 shadow-neu-flat hover:shadow-neu-pressed disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRevoking ? "Revoking..." : "Log out of all other devices"}
              </button>
            </>
          )}
        </div>

        <div className="bento">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
          <p className="mt-2 text-sm text-inkSoft">Sign out of this device.</p>
          <button onClick={logout} className="btn-ghost mt-6">Sign out</button>
        </div>

        {/* NEW: DANGER ZONE */}
        <div className="bento border-red-500/20 bg-red-500/5">
          <h2 className="text-xl font-bold tracking-tight text-red-500">Danger zone</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            onClick={deleteAccount} 
            disabled={isDeleting}
            className="btn-primary mt-6 bg-red-500 text-white shadow-none hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}