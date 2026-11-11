import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };
type SearchParams = Promise<{ next?: string }>;
export default async function SignupPage({ searchParams }: { searchParams: SearchParams }) {
  const { next = "/account" } = await searchParams;
  return (
    <section className="section-wrap auth-page">
      <div className="auth-heading">
        <span className="eyebrow">A FEW DETAILS TO GET STARTED</span>
        <h1>Create your account.</h1>
        <p>Save your favourites, keep your addresses handy and see your orders in one place.</p>
      </div>
      <div className="auth-card">
        <SignUpForm nextPath={next} />
      </div>
    </section>
  );
}
