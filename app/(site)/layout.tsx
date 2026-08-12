import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page-shell__main">{children}</main>
    </div>
  );
}
