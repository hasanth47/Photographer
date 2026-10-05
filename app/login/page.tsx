import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const [content, params] = await Promise.all([getContent(), searchParams]);
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="font-display text-xl font-bold uppercase tracking-[0.26em] text-foreground"
      >
        {content.site.name}
      </Link>

      <section className="mt-14 w-full max-w-sm border border-line bg-surface p-10">
        <p className="label text-muted">Admin login</p>
        <div className="mt-8">
          <LoginForm next={next} />
        </div>
        <p className="mt-8 text-center font-mono text-xs text-muted">
          Forgot password? Update it in <span className="text-foreground/70">.env.local</span>.
        </p>
      </section>

      <p className="mt-8 font-mono text-xs text-muted">(Admin access only — editing tools unlock after sign in)</p>
    </main>
  );
}
