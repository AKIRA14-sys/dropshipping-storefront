import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
type SearchParams = Promise<{ next?: string }>;
export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { next = "/account" } = await searchParams;
  return (
    <section className="section-wrap auth-page">
      <div className="auth-heading">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to your account.</h1>
        <p>Your saved addresses, wishlist and order history stay private to you.</p>
      </div>
      <div className="auth-card">
        <SignInForm nextPath={next} />
      </div>
    </section>
  );
}
