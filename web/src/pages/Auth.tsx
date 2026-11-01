import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

type Mode = "login" | "signup" | "forgot" | "reset";

export function Auth() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); // For testing
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  
  const { refresh } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login" || mode === "signup") {
        await api(`/api/auth/${mode}`, {
          method: "POST",
          body: { email, password }
        });
        await refresh();
        navigate("/");
      } 
      else if (mode === "forgot") {
        const res = await api<{ message: string }>("/api/auth/forgot-password", {
          method: "POST",
          body: { email }
        });
        setMessage(res.message);
        setMode("reset"); // Flip to reset mode
      }
      else if (mode === "reset") {
        const res = await api<{ message: string }>("/api/auth/reset-password", {
          method: "POST",
          body: { token: resetToken, newPassword: password }
        });
        setMessage(res.message);
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-bold tracking-tight">Rewind</h1>
      
      <p className="mt-2 text-sm text-inkSoft">
        {mode === "login" && "Sign in to your account"}
        {mode === "signup" && "Create a new account"}
        {mode === "forgot" && "Enter your email to reset your password"}
        {mode === "reset" && "Enter the reset token and your new password"}
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
        {(mode === "login" || mode === "signup" || mode === "forgot") && (
          <input
            className="field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        {(mode === "login" || mode === "signup" || mode === "reset") && (
          <input
            className="field"
            type="password"
            placeholder={mode === "reset" ? "New Password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        )}

        {mode === "reset" && (
          <input
            className="field"
            type="text"
            placeholder="Reset Token (from Render logs)"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            required
          />
        )}

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}
        {message && <p className="text-sm font-bold text-green-600">{message}</p>}

        <button className="btn-primary mt-2" disabled={busy} type="submit">
          {busy ? "Working..." : 
           mode === "login" ? "Sign in" : 
           mode === "signup" ? "Create account" : 
           mode === "forgot" ? "Send Reset Link" : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-sm text-inkSoft">
        {mode === "login" && (
          <>
            <button onClick={() => setMode("forgot")} className="hover:text-ink">Forgot password?</button>
            <button onClick={() => setMode("signup")} className="hover:text-ink">Need an account? Create one</button>
          </>
        )}
        {mode === "signup" && (
          <button onClick={() => setMode("login")} className="hover:text-ink">Already have an account? Sign in</button>
        )}
        {(mode === "forgot" || mode === "reset") && (
          <button onClick={() => setMode("login")} className="hover:text-ink">Back to login</button>
        )}
      </div>
    </div>
  );
}