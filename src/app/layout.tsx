import type { Metadata } from "next";
import "@/app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { ServiceWorker } from "@/components/layout/ServiceWorker";

export const metadata: Metadata = {
  title: "WIAL Global Chapter Hub",
  description:
    "A WIAL chapter platform prototype with governed chapter sites, coach discovery, dues workflows, and AI-assisted public content."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only sr-only-focusable fixed left-4 top-4 z-[60] rounded-md bg-white text-black shadow-md"
        >
          Skip to content
        </a>
        <Loader />
        <ServiceWorker />
        <div className="min-h-screen">
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
