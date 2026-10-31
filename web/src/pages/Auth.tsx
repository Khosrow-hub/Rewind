import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

type Mode = "login" | "signup";

export function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/api/auth/${mode}`, {
        method: "POST",
        body: { email, password }
      });
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-gutter">
      <h1 className="text-3xl font-semibold tracking-tight">Rewind</h1>
      <p className="mt-1 text-sm text-inkSoft">
        {mode === "login" ? "Sign in to your account" : "Create an account"}
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <input
          className="field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <p className="text-sm text-ink">{error}</p>}
        <button className="btn-primary mt-2" disabled={busy} type="submit">
          {busy ? "Working" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-inkSoft underline-offset-4 hover:underline"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login"
          ? "Need an account, create one"
          : "Already have an account, sign in"}
      </button>
    </div>
  );
}