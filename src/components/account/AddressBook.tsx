"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { AddressInput } from "@/types/cart";

interface Address extends AddressInput {
  id: string;
  user_id: string;
}
const emptyAddress: AddressInput = {
  label: "Home",
  recipient_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_region: "",
  postal_code: "",
  country_code: "NG",
  is_default: false,
};

export function AddressBook() {
  const { client, user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<AddressInput>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!client || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: queryError } = await client
      .from("customer_addresses")
      .select(
        "id,user_id,label,recipient_name,phone,address_line_1,address_line_2,city,state_region,postal_code,country_code,is_default",
      )
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (queryError) {
      setError("Addresses could not be loaded. Confirm the account migration is applied.");
      setAddresses([]);
    } else {
      setError("");
      setAddresses((data ?? []) as Address[]);
    }
    setLoading(false);
  }, [client, user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof AddressInput>(key: K, value: AddressInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function startEdit(address: Address) {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      city: address.city,
      state_region: address.state_region,
      postal_code: address.postal_code,
      country_code: address.country_code,
      is_default: address.is_default,
    });
    setMessage("");
  }
  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyAddress });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || !user) return;
    if (!/^[A-Z]{2}$/.test(form.country_code.trim().toUpperCase())) {
      setError("Country/region code must contain two letters, such as NG or GB.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    const payload = {
      ...form,
      country_code: form.country_code.trim().toUpperCase(),
      label: form.label.trim() || "Address",
      recipient_name: form.recipient_name.trim(),
      phone: form.phone.trim(),
      address_line_1: form.address_line_1.trim(),
      address_line_2: form.address_line_2.trim(),
      city: form.city.trim(),
      state_region: form.state_region.trim(),
      postal_code: form.postal_code.trim(),
      is_default: false,
    };
    const result = editingId
      ? await client
          .from("customer_addresses")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select("id")
          .maybeSingle()
      : await client
          .from("customer_addresses")
          .insert({ ...payload, user_id: user.id })
          .select("id")
          .single();
    if (result.error || !result.data) {
      setError("We could not save this address. Check the fields and account database setup.");
      setBusy(false);
      return;
    }
    const addressId = result.data.id as string;
    if (form.is_default) {
      const { error: defaultError } = await client.rpc("set_default_customer_address", {
        p_address_id: addressId,
      });
      if (defaultError) {
        setError(
          "Address saved, but the default address could not be changed. Apply the latest database migration and try again.",
        );
        setBusy(false);
        await load();
        return;
      }
    }
    resetForm();
    setMessage(editingId ? "Address updated." : "Address saved.");
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!client || !user) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { error: deleteError } = await client
      .from("customer_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (deleteError) setError("We could not remove this address.");
    else {
      setMessage("Address removed.");
      await load();
    }
    setBusy(false);
  }

  async function makeDefault(id: string) {
    if (!client) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { error: defaultError } = await client.rpc("set_default_customer_address", { p_address_id: id });
    if (defaultError)
      setError("We could not update the default address. Confirm the latest migration is applied.");
    else {
      setMessage("Default address updated.");
      await load();
    }
    setBusy(false);
  }

  return (
    <div className="address-book">
      {loading ? (
        <p role="status">Loading saved addresses…</p>
      ) : addresses.length === 0 && !editingId ? (
        <div className="account-empty">
          <MapPin size={24} />
          <h2>No saved addresses</h2>
          <p>Add an address to keep it ready for when checkout is available.</p>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((address) => (
            <article className="address-card" key={address.id}>
              <div className="address-card-top">
                <span className="address-label">{address.label}</span>
                {address.is_default && (
                  <span className="default-pill">
                    <Check size={13} /> Default
                  </span>
                )}
              </div>
              <strong>{address.recipient_name}</strong>
              <span>{address.phone}</span>
              <address>
                {address.address_line_1}
                {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                <br />
                {address.city}, {address.state_region} {address.postal_code}
                <br />
                {address.country_code}
              </address>
              <div className="address-actions">
                <button type="button" onClick={() => startEdit(address)} disabled={busy}>
                  <Pencil size={14} /> Edit
                </button>
                {!address.is_default && (
                  <button type="button" onClick={() => void makeDefault(address.id)} disabled={busy}>
                    Make default
                  </button>
                )}
                <button type="button" onClick={() => void remove(address.id)} disabled={busy}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <section className="account-panel address-form-panel">
        <div className="account-panel-heading">
          <h2>{editingId ? "Edit address" : "Add an address"}</h2>
          <p>Saved securely to your account. Only you can access it.</p>
        </div>
        <form className="auth-form address-form" onSubmit={submit}>
          <label className="form-field">
            <span>Address label</span>
            <input
              value={form.label}
              onChange={(event) => update("label", event.target.value)}
              maxLength={40}
              required
            />
          </label>
          <label className="form-field">
            <span>Recipient name</span>
            <input
              autoComplete="name"
              value={form.recipient_name}
              onChange={(event) => update("recipient_name", event.target.value)}
              maxLength={100}
              required
            />
          </label>
          <label className="form-field">
            <span>Phone</span>
            <input
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              maxLength={30}
              required
            />
          </label>
          <label className="form-field address-wide">
            <span>Address line 1</span>
            <input
              autoComplete="address-line1"
              value={form.address_line_1}
              onChange={(event) => update("address_line_1", event.target.value)}
              maxLength={250}
              required
            />
          </label>
          <label className="form-field address-wide">
            <span>Address line 2 (optional)</span>
            <input
              autoComplete="address-line2"
              value={form.address_line_2}
              onChange={(event) => update("address_line_2", event.target.value)}
              maxLength={250}
            />
          </label>
          <label className="form-field">
            <span>City</span>
            <input
              autoComplete="address-level2"
              value={form.city}
              onChange={(event) => update("city", event.target.value)}
              maxLength={100}
              required
            />
          </label>
          <label className="form-field">
            <span>State / region</span>
            <input
              autoComplete="address-level1"
              value={form.state_region}
              onChange={(event) => update("state_region", event.target.value)}
              maxLength={100}
              required
            />
          </label>
          <label className="form-field">
            <span>Postal code (optional)</span>
            <input
              autoComplete="postal-code"
              value={form.postal_code}
              onChange={(event) => update("postal_code", event.target.value)}
              maxLength={20}
            />
          </label>
          <label className="form-field">
            <span>Country / region code</span>
            <input
              autoComplete="country"
              value={form.country_code}
              onChange={(event) => update("country_code", event.target.value.toUpperCase().slice(0, 2))}
              pattern="[A-Z]{2}"
              maxLength={2}
              required
            />
          </label>
          <label className="remember-option address-wide">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(event) => update("is_default", event.target.checked)}
            />{" "}
            Set as my default address
          </label>
          <div className="address-form-actions address-wide">
            <button className="button button-dark" type="submit" disabled={busy}>
              <Plus size={16} /> {busy ? "Saving…" : editingId ? "Save changes" : "Save address"}
            </button>
            {editingId && (
              <button type="button" className="button button-outline" onClick={resetForm} disabled={busy}>
                <X size={15} /> Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>
      {(message || error) && (
        <p className={error ? "form-error" : "form-success"} role={error ? "alert" : "status"}>
          {error || message}
        </p>
      )}
    </div>
  );
}
