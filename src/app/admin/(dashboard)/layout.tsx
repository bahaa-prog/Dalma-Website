import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="admin-topbar">
        <span className="admin-topbar-brand">لوحة تحكم الأخبار</span>
        <nav>
          <Link href="/admin/articles">المقالات</Link>
          <Link href="/admin/articles/new">مقال جديد</Link>
          <LogoutButton />
        </nav>
      </div>
      <div className="admin-main">{children}</div>
    </>
  );
}
