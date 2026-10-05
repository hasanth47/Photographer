import type { Metadata } from "next";
import Image from "next/image";
import { AdminBar } from "@/components/admin-bar";
import { EditLink } from "@/components/edit-link";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/dal";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [content, session] = await Promise.all([getContent(), getSession()]);
  const isAdmin = session !== null;
  const { about } = content;

  return (
    <section className="grid min-h-[100svh] grid-cols-1 pt-[72px] lg:grid-cols-2">
      <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-[calc(100svh-72px)]">
        <Image
          src={about.portrait}
          alt={`Portrait of ${about.heading}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center px-6 py-16 md:px-16 lg:py-24">
        <div className="max-w-xl">
          <div className="flex items-center gap-4">
            <p className="label text-muted">About</p>
            {isAdmin && <EditLink href="/admin#about" />}
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold text-foreground md:text-6xl">{about.heading}</h1>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-foreground/80">
            {about.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      {isAdmin && <AdminBar editHref="/admin#about" username={session.username} />}
    </section>
  );
}
