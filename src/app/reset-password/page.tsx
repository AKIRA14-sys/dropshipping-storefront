"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ResetPasswordPage() {
  const { client, configured, user, loading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (password.length < 8 || password !== confirm) {
      setError(password.length < 8 ? "Use at least 8 characters." : "The passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: updateError } = await client.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message);
    else {
      setSaved(true);
      router.refresh();
    }
  }
  return (
    <section className="section-wrap auth-page">
      <div className="auth-heading">
        <span className="eyebrow">ACCOUNT SECURITY</span>
        <h1>Choose a new password.</h1>
        <p>Use at least eight characters. Your reset link must be opened in this browser.</p>
      </div>
      <div className="auth-card">
        {!configured ? (
          <p className="auth-unavailable">Account service is not connected.</p>
        ) : loading ? (
          <p role="status">Checking the secure reset link…</p>
        ) : saved ? (
          <div className="form-success">
            <p>Your password has been updated.</p>
            <Link href="/account">Go to your account</Link>
          </div>
        ) : !user ? (
          <div className="auth-unavailable">
            <h2>Reset link not active</h2>
            <p>Open the latest reset email in this browser, then try again.</p>
            <Link href="/forgot-password">Request a new link</Link>
          </div>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label className="form-field" htmlFor="new-password">
              <span>New password</span>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label className="form-field" htmlFor="new-password-confirm">
              <span>Confirm new password</span>
              <input
                id="new-password-confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                required
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-dark auth-submit" type="submit" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
