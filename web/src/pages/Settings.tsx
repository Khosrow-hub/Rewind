import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useToast } from "../features/toast/ToastContext";
import { api } from "../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [isRevoking, setIsRevoking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // NEW

  const { data, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ sessions: Session[] }>(`/api/auth/sessions?t=${Date.now()}`),
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

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await api("/api/auth/account", { method: "DELETE" });
      showToast("Account deleted.");
      navigate("/");
    } catch (err) {
      showToast("Failed to delete account.", "error");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
          <div className="bento w-full max-w-md shadow-neu-flat bg-cream text-center p-8">
            <h2 className="text-2xl font-bold tracking-tight text-red-500">Delete account?</h2>
            <p className="mt-3 text-sm text-inkSoft leading-relaxed">
              This will permanently delete your account and every decision you have ever logged. 
              This action cannot be undone.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting}
                className="btn-primary bg-red-500 text-white shadow-none hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, delete everything"}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

        <div className="bento border-red-500/20 bg-red-500/5">
          <h2 className="text-xl font-bold tracking-tight text-red-500">Danger zone</h2>
          <p className="mt-2 text-sm text-inkSoft">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="btn-primary mt-6 bg-red-500 text-white shadow-none hover:bg-red-600"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}