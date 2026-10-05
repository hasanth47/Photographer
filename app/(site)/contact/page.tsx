import type { Metadata } from "next";
import { AdminBar } from "@/components/admin-bar";
import { ContactForm } from "@/components/contact-form";
import { EditLink } from "@/components/edit-link";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/dal";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [content, session] = await Promise.all([getContent(), getSession()]);
  const isAdmin = session !== null;
  const { site } = content;

  return (
    <section className="px-6 pb-24 pt-32 md:px-12 md:pt-36">
      <div className="flex items-center gap-4">
        <p className="label text-muted">Contact</p>
        {isAdmin && <EditLink href="/admin#site" />}
      </div>
      <h1 className="mt-3 font-display text-5xl font-semibold text-foreground md:text-6xl">Get in touch</h1>

      <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        <ContactForm />

        <aside className="space-y-10">
          <div>
            <p className="label text-muted">Contact info</p>
            <p className="mt-4 text-foreground/80">{site.email}</p>
            <p className="text-foreground/80">{site.location}</p>
          </div>

          <div>
            <p className="label text-muted">Social</p>
            <ul className="mt-4 space-y-1 text-foreground/90">
              {site.instagram && <li>Instagram: {site.instagram}</li>}
              {site.twitter && <li>Twitter: {site.twitter}</li>}
              {site.behance && <li>Behance: {site.behance}</li>}
            </ul>
          </div>

          {site.bookingNote && (
            <div className="max-w-md border border-line bg-surface p-6">
              <p className="label text-muted">Booking</p>
              <p className="mt-4 leading-relaxed text-foreground/80">{site.bookingNote}</p>
            </div>
          )}
        </aside>
      </div>

      {isAdmin && <AdminBar editHref="/admin#site" username={session.username} />}
    </section>
  );
}
