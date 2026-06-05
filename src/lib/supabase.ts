import { createClient } from "@supabase/supabase-js";
import type { SaleItem } from "@/data/items";

export type ItemRow = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  fake_original_price: number | string;
  category: string;
  condition: string;
  status: SaleItem["status"];
  badge: string;
  segment: string;
  featured: boolean;
  deal_of_the_hour: boolean;
  hot: boolean;
  pitch: string;
  image_url: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function rowToSaleItem(row: ItemRow): SaleItem {
  return {
    id: row.slug,
    name: row.name,
    price: Number(row.price),
    fakeOriginalPrice: Number(row.fake_original_price),
    category: row.category,
    condition: row.condition,
    status: row.status,
    badge: row.badge,
    segment: row.segment,
    featured: row.featured,
    dealOfTheHour: row.deal_of_the_hour,
    hot: row.hot,
    pitch: row.pitch,
    image: row.image_url ?? undefined,
  };
}
