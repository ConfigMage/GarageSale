# Supabase Setup

Driveway Deal Network works without Supabase by falling back to `src/data/items.ts`.
When Supabase is configured, the public site reads items from the `items` table
and the `/admin` portal can manage inventory and upload photos.

## 1. Create Supabase Project

Create a Supabase project directly in Supabase or through the Vercel Marketplace
integration.

## 2. Add Environment Variables

Copy `.env.example` to `.env.local` for local development:

```txt
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add the same variables to the Vercel project settings.

## 3. Run The Schema

Open the Supabase SQL editor and run:

```txt
supabase/schema.sql
```

Then add the admin email you want to allow:

```sql
insert into public.admin_users (email)
values ('you@example.com');
```

Only emails listed in `admin_users` can insert, update, delete, or upload.

## 4. Configure Auth

In Supabase Auth settings:

- Enable email magic links.
- Add your local URL to allowed redirect URLs: `http://localhost:3000/admin`
- Add your Vercel URL to allowed redirect URLs: `https://your-site.vercel.app/admin`

## 5. Use The Admin Portal

Run the app and visit:

```txt
http://localhost:3000/admin
```

Sign in with the approved admin email. From there you can add items, edit prices,
change status, mark Deal of the Hour, and upload photos to the `item-photos`
storage bucket.

## Notes

- The public page revalidates every 30 seconds, so admin edits may take a short
  moment to appear.
- If Supabase is not configured, the app still builds and displays sample items.
- There is no checkout, payment, customer login, or reservation system.
