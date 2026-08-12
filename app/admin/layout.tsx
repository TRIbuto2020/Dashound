import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <Link className="admin-shell__brand" href="/admin">
          Dashound Admin
        </Link>
        <Link className="ui-button ui-button--nav" href="/">
          Ver site
        </Link>
      </header>
      <main className="admin-shell__main">{children}</main>
    </div>
  );
}
