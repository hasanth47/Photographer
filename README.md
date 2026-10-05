# Elara Voss — photography portfolio

A dark, editorial portfolio site built with Next.js 16 (App Router), React 19 and Tailwind CSS 4.
Public pages: Home, Gallery, About, Contact. An admin-only area edits all site content.

## Run it

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev
```

Open http://localhost:3000.

## Admin login

Only the username/password pair in `.env.local` can sign in at `/login`:

```
ADMIN_USERNAME=elara
ADMIN_PASSWORD=choose-a-strong-password
SESSION_SECRET=a-long-random-string
```

Sessions are signed JWT cookies (`jose`), HTTP-only, valid for 7 days. `proxy.ts` redirects
anonymous visitors away from `/admin`, the admin layout re-checks the session, and every Server
Action calls `requireAdminAction()` before touching data.

After signing in, editing tools appear only for the admin:

- a floating **Admin** bar on public pages with “Edit this page”, “Dashboard” and “Log out”
- **Edit** links next to each editable section and on every photo card
- `/admin` — hero text, biography, contact/social details and booking note
- `/admin/photos` — upload or link photos, set title/category, choose hero slides and
  “Selected work”, reorder, delete
- `/admin/messages` — contact form submissions
- `/admin/editor` — the photo editor, with “Add to gallery”

## Where data lives

- `data/content.json` — all editable content (created on first save; seeded from `lib/default-content.ts`)
- `data/messages.json` — contact form messages
- `public/uploads/` — uploaded photos (git-ignored)
