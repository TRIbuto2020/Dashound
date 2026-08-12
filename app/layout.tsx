import type { Metadata } from "next";
import "@/src/styles.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dashound.com.br";
const shouldIndex = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dashound",
    template: "%s | Dashound",
  },
  description:
    "Projetos, histórias e experiências reais sobre triathlon, esporte e tecnologia.",
  icons: {
    icon: "/images/dhIcon.svg",
  },
  robots: shouldIndex ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
