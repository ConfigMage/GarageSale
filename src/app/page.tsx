import { HomePageClient } from "@/components/HomePageClient";
import { saleDate } from "@/data/sale";
import { getItems } from "@/lib/items";

export const revalidate = 30;

export default async function Home() {
  const items = await getItems();

  return <HomePageClient items={items} saleDate={saleDate} />;
}
