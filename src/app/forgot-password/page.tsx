"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Metadata } from "next";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { client, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setBusy(true);
    setError("");
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });
    setBusy(false);
    if (resetError) setError(resetError.message);
    else setSent(true);
  }
  return (
    <section className="section-wrap auth-page">
      <div className="auth-heading">
        <span className="eyebrow">ACCOUNT SECURITY</span>
        <h1>Reset your password.</h1>
        <p>We’ll send a password-reset link to the email on your account.</p>
      </div>
      <div className="auth-card">
        {!configured ? (
          <div className="auth-unavailable">
            <h2>Accounts are not connected yet</h2>
            <p>Password recovery will be available when this store’s account service is configured.</p>
          </div>
        ) : sent ? (
          <p className="form-success" role="status">
            If an account exists for that address, a reset link has been requested. Check your inbox and spam
            folder.
          </p>
        ) : (
          <form className="auth-form" onSubmit={submit}>
            <label className="form-field" htmlFor="reset-email">
              <span>Email address</span>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-dark auth-submit" type="submit" disabled={busy}>
              {busy ? "Requesting link…" : "Send reset link"}
            </button>
          </form>
        )}
        <p className="auth-switch">
          <Link href="/login">Back to sign in</Link>
        </p>
      </div>
    </section>
  );
}
