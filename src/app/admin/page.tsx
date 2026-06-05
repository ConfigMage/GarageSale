import type { Metadata } from "next";
import { AdminPortal } from "@/components/AdminPortal";

export const metadata: Metadata = {
  title: "Admin Portal | Driveway Deal Network",
};

export default function AdminPage() {
  return <AdminPortal />;
}
