"use client";

import {
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { segmentNames, type SaleItem } from "@/data/items";
import { createSupabaseClient, type ItemRow } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";

type AdminItemForm = {
  databaseId?: string;
  slug: string;
  name: string;
  price: string;
  fakeOriginalPrice: string;
  category: string;
  condition: string;
  status: SaleItem["status"];
  badge: string;
  segment: string;
  featured: boolean;
  dealOfTheHour: boolean;
  hot: boolean;
  pitch: string;
  imageUrl: string;
  sortOrder: string;
};

const emptyForm: AdminItemForm = {
  slug: "",
  name: "",
  price: "5",
  fakeOriginalPrice: "29.99",
  category: "Mom's Picks",
  condition: "Excellent",
  status: "Available",
  badge: "Still Available",
  segment: "Mom's Picks",
  featured: false,
  dealOfTheHour: false,
  hot: false,
  pitch: "",
  imageUrl: "",
  sortOrder: "0",
};

const statuses: SaleItem["status"][] = [
  "Available",
  "Almost Gone",
  "Pending Pickup",
  "Sold-ish",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function rowToForm(row: ItemRow): AdminItemForm {
  return {
    databaseId: row.id,
    slug: row.slug,
    name: row.name,
    price: String(row.price),
    fakeOriginalPrice: String(row.fake_original_price),
    category: row.category,
    condition: row.condition,
    status: row.status,
    badge: row.badge,
    segment: row.segment,
    featured: row.featured,
    dealOfTheHour: row.deal_of_the_hour,
    hot: row.hot,
    pitch: row.pitch,
    imageUrl: row.image_url ?? "",
    sortOrder: String(row.sort_order),
  };
}

function formToRow(form: AdminItemForm) {
  return {
    slug: form.slug || slugify(form.name),
    name: form.name,
    price: Number(form.price || 0),
    fake_original_price: Number(form.fakeOriginalPrice || 0),
    category: form.category,
    condition: form.condition,
    status: form.status,
    badge: form.badge,
    segment: form.segment,
    featured: form.featured,
    deal_of_the_hour: form.dealOfTheHour,
    hot: form.hot,
    pitch: form.pitch,
    image_url: form.imageUrl || null,
    sort_order: Number(form.sortOrder || 0),
  };
}

export function AdminPortal() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<ItemRow[]>([]);
  const [form, setForm] = useState<AdminItemForm>(emptyForm);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      void loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadItems() {
    if (!supabase) {
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setNotice(`Could not load inventory: ${error.message}`);
    } else {
      setItems((data ?? []) as ItemRow[]);
    }

    setIsLoading(false);
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    setNotice(
      error
        ? `Magic link failed: ${error.message}`
        : "Check your email for the admin magic link.",
    );
    setIsSaving(false);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    setIsSaving(true);
    const row = formToRow(form);

    if (row.deal_of_the_hour) {
      await supabase
        .from("items")
        .update({ deal_of_the_hour: false })
        .neq("slug", row.slug);
    }

    const { error } = await supabase
      .from("items")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      setNotice(`Could not save item: ${error.message}`);
    } else {
      setNotice(`${row.name} is ready for its close-up.`);
      setForm(emptyForm);
      await loadItems();
    }

    setIsSaving(false);
  }

  async function deleteItem(item: ItemRow) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.from("items").delete().eq("id", item.id);

    if (error) {
      setNotice(`Could not delete item: ${error.message}`);
    } else {
      setNotice(`${item.name} left the broadcast.`);
      await loadItems();
    }
  }

  async function uploadPhoto(file: File | undefined) {
    if (!supabase || !file) {
      return;
    }

    const slug = form.slug || slugify(form.name) || "garage-sale-item";
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${slug}/${Date.now()}.${extension}`;

    setIsUploading(true);
    const { error } = await supabase.storage
      .from("item-photos")
      .upload(path, file, { upsert: true });

    if (error) {
      setNotice(`Photo upload failed: ${error.message}`);
    } else {
      const { data } = supabase.storage.from("item-photos").getPublicUrl(path);
      setForm((current) => ({ ...current, imageUrl: data.publicUrl }));
      setNotice("Photo uploaded. The item has entered its glamour era.");
    }

    setIsUploading(false);
  }

  function updateForm<K extends keyof AdminItemForm>(key: K, value: AdminItemForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (!supabase) {
    return (
      <main className="min-h-screen bg-broadcast-cream px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-lg border-2 border-broadcast-ink bg-white p-6 shadow-promo">
          <h1 className="font-display text-4xl font-black text-broadcast-ink">
            Admin Portal Setup
          </h1>
          <p className="mt-4 text-lg font-bold leading-8 text-neutral-700">
            Supabase is not configured yet. Add these values to `.env.local` and
            Vercel project settings:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md bg-broadcast-ink p-4 text-sm font-bold text-white">
            NEXT_PUBLIC_SUPABASE_URL=...{"\n"}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=...
          </pre>
        </section>
      </main>
    );
  }

  if (isLoading && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-broadcast-cream p-4">
        <Loader2 className="animate-spin text-broadcast-red" size={42} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-broadcast-blue px-4 py-10 text-white sm:px-6 lg:px-8">
        <section className="mx-auto max-w-md rounded-lg border-2 border-broadcast-ink bg-white p-6 text-broadcast-ink shadow-promo">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-broadcast-red px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
            <WandSparkles aria-hidden="true" size={16} />
            Backstage Access
          </div>
          <h1 className="font-display text-4xl font-black">
            Driveway Deal Control Room
          </h1>
          <p className="mt-3 font-bold leading-7 text-neutral-700">
            Sign in with an approved admin email to upload photos and manage the
            broadcast inventory.
          </p>
          <form onSubmit={sendMagicLink} className="mt-6 space-y-4">
            <label className="block text-sm font-black uppercase tracking-wide">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-md border-2 border-broadcast-ink px-3 py-3 text-base font-bold focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
              />
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-broadcast-red px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : null}
              Send Magic Link
            </button>
          </form>
          {notice ? (
            <p className="mt-4 rounded-md bg-broadcast-cream p-3 font-bold">
              {notice}
            </p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-broadcast-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-lg border-2 border-broadcast-ink bg-broadcast-blue p-5 text-white shadow-promo sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-broadcast-gold">
              Backstage inventory desk
            </p>
            <h1 className="font-display text-4xl font-black">
              Admin Portal
            </h1>
          </div>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black uppercase tracking-wide text-broadcast-blue"
          >
            <LogOut aria-hidden="true" size={18} />
            Sign Out
          </button>
        </header>

        {notice ? (
          <p className="mb-6 rounded-md border-2 border-broadcast-ink bg-white p-4 font-bold text-broadcast-ink">
            {notice}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-lg border-2 border-broadcast-ink bg-white p-5 shadow-promo">
            <h2 className="mb-4 text-2xl font-black text-broadcast-ink">
              {form.databaseId ? "Edit Item" : "Add Item"}
            </h2>
            <form onSubmit={saveItem} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" value={form.name} onChange={(value) => {
                  updateForm("name", value);
                  if (!form.slug) {
                    updateForm("slug", slugify(value));
                  }
                }} required />
                <TextField label="Slug" value={form.slug} onChange={(value) => updateForm("slug", slugify(value))} required />
                <TextField label="Garage sale price" value={form.price} onChange={(value) => updateForm("price", value)} type="number" step="0.01" required />
                <TextField label="Fake original price" value={form.fakeOriginalPrice} onChange={(value) => updateForm("fakeOriginalPrice", value)} type="number" step="0.01" required />
                <TextField label="Category" value={form.category} onChange={(value) => updateForm("category", value)} required />
                <TextField label="Condition" value={form.condition} onChange={(value) => updateForm("condition", value)} required />
                <SelectField label="Status" value={form.status} options={statuses} onChange={(value) => updateForm("status", value as SaleItem["status"])} />
                <TextField label="Badge" value={form.badge} onChange={(value) => updateForm("badge", value)} required />
                <SelectField label="Segment" value={form.segment} options={[...segmentNames]} onChange={(value) => updateForm("segment", value)} />
                <TextField label="Sort order" value={form.sortOrder} onChange={(value) => updateForm("sortOrder", value)} type="number" />
              </div>
              <label className="block text-sm font-black uppercase tracking-wide text-broadcast-ink">
                Funny pitch
                <textarea
                  value={form.pitch}
                  onChange={(event) => updateForm("pitch", event.target.value)}
                  required
                  rows={4}
                  className="mt-2 w-full rounded-md border-2 border-broadcast-ink px-3 py-3 text-base font-bold normal-case tracking-normal focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <CheckField label="Featured" checked={form.featured} onChange={(value) => updateForm("featured", value)} />
                <CheckField label="Deal of the Hour" checked={form.dealOfTheHour} onChange={(value) => updateForm("dealOfTheHour", value)} />
                <CheckField label="Hot Item" checked={form.hot} onChange={(value) => updateForm("hot", value)} />
              </div>
              <div className="rounded-lg border-2 border-dashed border-broadcast-teal bg-cyan-50 p-4">
                <label className="block text-sm font-black uppercase tracking-wide text-broadcast-ink">
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => uploadPhoto(event.target.files?.[0])}
                    className="mt-2 block w-full text-sm font-bold"
                  />
                </label>
                <TextField label="Image URL" value={form.imageUrl} onChange={(value) => updateForm("imageUrl", value)} />
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.imageUrl}
                    alt=""
                    className="mt-3 h-40 w-full rounded-md border-2 border-broadcast-ink object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-broadcast-red px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save aria-hidden="true" size={18} />}
                  Save Broadcast Item
                </button>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-broadcast-ink bg-white px-4 py-3 text-sm font-black uppercase tracking-wide"
                >
                  <Plus aria-hidden="true" size={18} />
                  New Item
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-lg border-2 border-broadcast-ink bg-white p-5 shadow-promo">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-broadcast-ink">
                Inventory
              </h2>
              <button
                type="button"
                onClick={loadItems}
                className="rounded-md bg-broadcast-gold px-3 py-2 text-xs font-black uppercase tracking-wide"
              >
                Refresh
              </button>
            </div>
            {isLoading ? (
              <Loader2 className="animate-spin text-broadcast-red" size={32} />
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-3 rounded-lg border-2 border-broadcast-ink bg-broadcast-cream p-4 sm:grid-cols-[88px_1fr] sm:items-center"
                  >
                    <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-md bg-white sm:w-20">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="text-broadcast-teal" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-black text-broadcast-ink">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-neutral-700">
                            {item.segment} / {item.status} / {formatPrice(Number(item.price))}
                          </p>
                          {item.deal_of_the_hour ? (
                            <p className="mt-1 text-xs font-black uppercase tracking-wide text-broadcast-red">
                              Deal of the Hour
                            </p>
                          ) : null}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setForm(rowToForm(item))}
                            className="rounded-md bg-broadcast-blue px-3 py-2 text-xs font-black uppercase tracking-wide text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItem(item)}
                            className="rounded-md bg-broadcast-red px-3 py-2 text-xs font-black uppercase tracking-wide text-white"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 aria-hidden="true" size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {!items.length ? (
                  <p className="rounded-md bg-broadcast-cream p-4 font-bold">
                    No items yet. The driveway awaits its television debut.
                  </p>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-black uppercase tracking-wide text-broadcast-ink">
      {label}
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 w-full rounded-md border-2 border-broadcast-ink px-3 py-3 text-base font-bold normal-case tracking-normal focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-black uppercase tracking-wide text-broadcast-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border-2 border-broadcast-ink px-3 py-3 text-base font-bold normal-case tracking-normal focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-md border-2 border-broadcast-ink bg-broadcast-cream p-3 text-sm font-black uppercase tracking-wide">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-broadcast-red"
      />
      {label}
    </label>
  );
}
