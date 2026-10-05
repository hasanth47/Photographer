import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/dal";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [content, session] = await Promise.all([getContent(), getSession()]);

  return (
    <>
      <Nav siteName={content.site.name} isAdmin={session !== null} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} />
    </>
  );
}
