import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

type Mode = "login" | "signup" | "forgot" | "reset";

export function Auth() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  // Automatically set mode to "reset" if there is a token in the URL
  const [mode, setMode] = useState<Mode>(tokenFromUrl ? "reset" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState(tokenFromUrl || "");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  
  const { refresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setMode("reset");
    }
  }, [tokenFromUrl]);

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
        setMessage("Check your email for a reset link.");
        // We don't flip to reset mode anymore, we wait for them to click the email
      }
      else if (mode === "reset") {
        const res = await api<{ message: string }>("/api/auth/reset-password", {
          method: "POST",
          body: { token: resetToken, newPassword: password }
        });
        setMessage("Password updated! You can now log in.");
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
        {mode === "forgot" && "Enter your email to receive a reset link"}
        {mode === "reset" && "Enter your new password"}
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

        {/* Only show the token input if they are on the reset screen but the URL didn't have a token */}
        {mode === "reset" && !tokenFromUrl && (
          <input
            className="field"
            type="text"
            placeholder="Reset Token"
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
           mode === "forgot" ? "Send Reset Link" : "Update Password"}
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