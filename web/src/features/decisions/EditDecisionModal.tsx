import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useToast } from "../toast/ToastContext";

type Props = {
  decisionId: string;
  initialTitle: string;
  initialReviewAt: string;
  onClose: () => void;
};

export function EditDecisionModal({ decisionId, initialTitle, initialReviewAt, onClose }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [reviewAt, setReviewAt] = useState(initialReviewAt.split("T")[0]);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: { title: string; reviewAt: string }) =>
      api(`/api/decisions/${decisionId}`, { method: "PATCH", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decision", decisionId] });
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      showToast("Decision updated successfully.");
      onClose();
    },
    onError: (err: any) => {
      showToast(err.message || "Failed to update decision.", "error");
    }
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Convert the date string back to an ISO string for the backend
    const isoString = new Date(reviewAt).toISOString();
    mutation.mutate({ title, reviewAt: isoString });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bento w-full max-w-md shadow-neu-flat bg-cream">
        <h2 className="text-xl font-bold tracking-tight mb-4">Edit decision</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label mb-1 block">Title</label>
            <input
              required
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label mb-1 block">Review date</label>
            <input
              type="date"
              required
              className="field"
              value={reviewAt}
              onChange={(e) => setReviewAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}