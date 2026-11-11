"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Heart, MapPin, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Profile {
  full_name: string;
  phone: string | null;
}
export function AccountOverview() {
  const { client, user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    full_name: String(user?.user_metadata?.full_name || ""),
    phone: "",
  });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client || !user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void client
      .from("profiles")
      .select("full_name,phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError)
          setError("Your profile could not be loaded. Confirm the account migration is applied.");
        else if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "" });
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, user?.id]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !user) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { data, error: updateError } = await client
      .from("profiles")
      .update({ full_name: profile.full_name.trim(), phone: profile.phone?.trim() || null })
      .eq("id", user.id)
      .select("id")
      .maybeSingle();
    if (updateError || !data)
      setError("Your profile could not be saved. Confirm the account migration is applied and try again.");
    else {
      await client.auth.updateUser({ data: { full_name: profile.full_name.trim() } });
      setMessage("Profile saved.");
    }
    setBusy(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    if (password.length < 8 || password !== confirm) {
      setError(password.length < 8 ? "Use at least 8 characters." : "The passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    const { error: updateError } = await client.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else {
      setPassword("");
      setConfirm("");
      setMessage("Password updated.");
    }
    setBusy(false);
  }

  return (
    <div className="account-panel-stack">
      <section className="account-panel">
        <div className="account-panel-heading">
          <h2>Profile details</h2>
          <p>These details belong to your account and are visible only to you.</p>
        </div>
        {loading ? (
          <p role="status">Loading profile…</p>
        ) : (
          <form className="auth-form" onSubmit={saveProfile}>
            <label className="form-field">
              <span>Full name</span>
              <input
                value={profile.full_name}
                onChange={(event) => setProfile((current) => ({ ...current, full_name: event.target.value }))}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <label className="form-field">
              <span>Email address</span>
              <input type="email" value={user?.email || ""} readOnly />
            </label>
            <label className="form-field">
              <span>Phone (optional)</span>
              <input
                type="tel"
                autoComplete="tel"
                value={profile.phone || ""}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                maxLength={30}
              />
            </label>
            <button className="button button-dark" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save profile"}
            </button>
          </form>
        )}
      </section>
      <section className="account-panel">
        <div className="account-panel-heading">
          <h2>Password & security</h2>
          <p>Choose a unique password with at least eight characters.</p>
        </div>
        <form className="auth-form" onSubmit={changePassword}>
          <label className="form-field">
            <span>New password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="form-field">
            <span>Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </label>
          <button className="button button-outline" type="submit" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
      {(message || error) && (
        <p className={error ? "form-error" : "form-success"} role={error ? "alert" : "status"}>
          {error || message}
        </p>
      )}
      <div className="account-shortcuts">
        <Link href="/account/orders">
          <Package size={18} /> Order history <ArrowRight size={15} />
        </Link>
        <Link href="/account/addresses">
          <MapPin size={18} /> Saved addresses <ArrowRight size={15} />
        </Link>
        <Link href="/cart?view=saved">
          <Heart size={18} /> Wishlist <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
