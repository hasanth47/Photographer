import type { Metadata } from "next";
import { AdminBar } from "@/components/admin-bar";
import { EditLink } from "@/components/edit-link";
import { GalleryGrid } from "@/components/gallery-grid";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/dal";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const [content, session] = await Promise.all([getContent(), getSession()]);
  const isAdmin = session !== null;

  return (
    <section className="px-6 pb-24 pt-32 md:px-14 md:pt-36">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <p className="label text-muted">Portfolio</p>
            {isAdmin && <EditLink href="/admin/photos" label="Manage photos" />}
          </div>
          <h1 className="mt-3 font-display text-5xl font-semibold text-foreground md:text-6xl">All Work</h1>
        </div>
      </div>

      <GalleryGrid photos={content.photos} isAdmin={isAdmin} />

      {isAdmin && <AdminBar editHref="/admin/photos" username={session.username} />}
    </section>
  );
}
