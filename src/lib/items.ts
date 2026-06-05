import { items as fallbackItems } from "@/data/items";
import { createSupabaseClient, rowToSaleItem, type ItemRow } from "./supabase";

export async function getItems() {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return fallbackItems;
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return fallbackItems;
  }

  return (data as ItemRow[]).map(rowToSaleItem);
}
