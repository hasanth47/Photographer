import Link from "next/link";
import { AdminBar } from "@/components/admin-bar";
import { EditLink } from "@/components/edit-link";
import { Hero } from "@/components/hero";
import { PhotoCard } from "@/components/photo-card";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/dal";

export default async function HomePage() {
  const [content, session] = await Promise.all([getContent(), getSession()]);
  const isAdmin = session !== null;

  const heroSlides = content.photos.filter((photo) => photo.hero);
  const slides = heroSlides.length > 0 ? heroSlides : content.photos.slice(0, 1);
  const selected = content.photos.filter((photo) => photo.featured);

  return (
    <>
      <Hero hero={content.hero} slides={slides} />

      <section className="px-6 py-20 md:px-14 md:py-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <p className="label text-muted">About</p>
            {isAdmin && <EditLink href="/admin#about" />}
          </div>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">{content.about.teaser}</p>
          <Link href="/about" className="label mt-10 inline-flex items-center gap-3 text-accent hover:text-foreground">
            Full biography <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-14 md:pb-32">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="label text-muted">Selected work</p>
            {isAdmin && <EditLink href="/admin/photos" label="Edit photos" />}
          </div>
          <Link href="/gallery" className="label inline-flex items-center gap-3 text-accent hover:text-foreground">
            Full gallery <span aria-hidden>→</span>
          </Link>
        </div>

        {selected.length === 0 ? (
          <p className="text-muted">No featured photos yet.</p>
        ) : (
          <div className="masonry">
            {selected.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </section>

      {isAdmin && <AdminBar editHref="/admin" username={session.username} />}
    </>
  );
}
