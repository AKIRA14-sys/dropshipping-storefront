"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { setAuthPersistence } from "@/lib/supabase/client";

function safeReturnPath(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? path : "/account";
}

function ServiceNotReady() {
  return (
    <div className="auth-unavailable" role="status">
      <h2>Accounts are not connected yet</h2>
      <p>
        This store will enable sign-in after its Supabase project is configured. You can browse the shop
        without an account.
      </p>
    </div>
  );
}

export function SignInForm({ nextPath = "/account" }: { nextPath?: string }) {
  const { client, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    setAuthPersistence(remember);
    const { error: authError } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace(safeReturnPath(nextPath));
    router.refresh();
  }

  if (!configured) return <ServiceNotReady />;
  return (
    <form className="auth-form" onSubmit={submit}>
      <label className="form-field" htmlFor="signin-email">
        <span>Email address</span>
        <span className="input-with-icon">
          <Mail size={17} />
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </span>
      </label>
      <label className="form-field" htmlFor="signin-password">
        <span>Password</span>
        <span className="input-with-icon">
          <LockKeyhole size={17} />
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </span>
      </label>
      <div className="auth-form-row">
        <label className="remember-option">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{" "}
          Remember me
        </label>
        <Link href="/forgot-password" className="text-link">
          Forgot password?
        </Link>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-dark auth-submit" type="submit" disabled={busy}>
        {busy ? (
          "Signing in…"
        ) : (
          <>
            Sign in <ArrowRight size={16} />
          </>
        )}
      </button>
      <p className="auth-switch">
        New here?{" "}
        <Link href={`/signup?next=${encodeURIComponent(safeReturnPath(nextPath))}`}>Create an account</Link>
      </p>
    </form>
  );
}

export function SignUpForm({ nextPath = "/account" }: { nextPath?: string }) {
  const { client, configured } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"details" | "code" | "password">("details");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    setMessage("");
    setAuthPersistence(remember);
    const { error: authError } = await client.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, data: { full_name: fullName.trim() } },
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setStep("code");
    setMessage("A six-digit verification code has been requested for your email address.");
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    const { error: authError } = await client.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setStep("password");
    setMessage("Email verified. Choose a password to finish creating your account.");
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: authError } = await client.auth.updateUser({
      password,
      data: { full_name: fullName.trim() },
    });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace(safeReturnPath(nextPath));
    router.refresh();
  }

  if (!configured) return <ServiceNotReady />;
  return (
    <div className="auth-flow">
      <ol className="auth-steps" aria-label="Account registration steps">
        <li className={step === "details" ? "current" : "complete"}>Details</li>
        <li className={step === "code" ? "current" : step === "password" ? "complete" : ""}>Verify email</li>
        <li className={step === "password" ? "current" : ""}>Password</li>
      </ol>
      {step === "details" && (
        <form className="auth-form" onSubmit={requestCode}>
          <label className="form-field" htmlFor="signup-name">
            <span>Full name</span>
            <input
              id="signup-name"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </label>
          <label className="form-field" htmlFor="signup-email">
            <span>Email address</span>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="remember-option">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />{" "}
            Remember me on this device
          </label>
          <button className="button button-dark auth-submit" type="submit" disabled={busy}>
            {busy ? (
              "Requesting code…"
            ) : (
              <>
                Send verification code <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
      {step === "code" && (
        <form className="auth-form" onSubmit={verifyCode}>
          <p className="auth-instruction">
            Enter the six-digit code sent to <strong>{email}</strong>.
          </p>
          <label className="form-field" htmlFor="signup-code">
            <span>Verification code</span>
            <input
              id="signup-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </label>
          <button
            className="button button-dark auth-submit"
            type="submit"
            disabled={busy || code.length !== 6}
          >
            {busy ? (
              "Verifying…"
            ) : (
              <>
                Verify email <CheckCircle2 size={16} />
              </>
            )}
          </button>
          <button className="text-button" type="button" disabled={busy} onClick={() => setStep("details")}>
            Change name or email
          </button>
        </form>
      )}
      {step === "password" && (
        <form className="auth-form" onSubmit={savePassword}>
          <p className="auth-instruction">
            Email verified for <strong>{email}</strong>. Create your password.
          </p>
          <label className="form-field" htmlFor="signup-password">
            <span>Password</span>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="form-field" htmlFor="signup-confirm">
            <span>Confirm password</span>
            <input
              id="signup-confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          <button className="button button-dark auth-submit" type="submit" disabled={busy}>
            {busy ? (
              "Creating account…"
            ) : (
              <>
                Finish account setup <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
      {message && (
        <p className="form-success" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="auth-legal">
        Creating an account uses your email for sign-in and account security. It does not subscribe you to
        marketing.
      </p>
      <p className="auth-switch">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(safeReturnPath(nextPath))}`}>Sign in</Link>
      </p>
    </div>
  );
}

export function AccountGate({
  children,
  returnTo = "/account",
}: {
  children: React.ReactNode;
  returnTo?: string;
}) {
  const { user, loading, configured } = useAuth();
  if (loading)
    return (
      <div className="account-loading" role="status">
        Loading your account…
      </div>
    );
  if (!configured) return <ServiceNotReady />;
  if (!user) {
    return (
      <div className="auth-required">
        <h2>Sign in to continue</h2>
        <p>This section is private to your account.</p>
        <div className="auth-required-actions">
          <Link className="button button-dark" href={`/login?next=${encodeURIComponent(returnTo)}`}>
            Sign in <ArrowRight size={16} />
          </Link>
          <Link className="button button-outline" href={`/signup?next=${encodeURIComponent(returnTo)}`}>
            Create an account
          </Link>
        </div>
      </div>
    );
  }
  return children;
}
