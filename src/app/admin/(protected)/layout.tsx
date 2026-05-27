import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session");
  if (!session?.value) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-8">{children}</div>
      </div>
    </div>
  );
}
