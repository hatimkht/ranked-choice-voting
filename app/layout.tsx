import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VoteStoreProvider } from "@/lib/voteStore";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Präferenzwahl-Simulation · Drei Stimmen, ehrlich gewählt",
  description:
    "Hypothetische Civic-Tech-Simulation eines Drei-Stimmen-Wahlmodells. Keine echte Wahl, keine offizielle Berechnung.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={sans.variable}>
      <body className="font-sans bg-canvas text-ink min-h-screen flex flex-col">
        <VoteStoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </VoteStoreProvider>
      </body>
    </html>
  );
}
