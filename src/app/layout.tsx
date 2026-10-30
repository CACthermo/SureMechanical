import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SURE Mechanical — Engineered to Move Air, Energy & Buildings",
  description:
    "From coordinated design and precision fabrication to installation, commissioning and long-term service, SURE Mechanical delivers complete commercial mechanical systems.",
  keywords: [
    "SURE Mechanical",
    "HVAC",
    "commercial mechanical",
    "sheet metal fabrication",
    "BIM coordination",
    "ductwork",
    "piping",
    "commissioning",
    "Cincinnati",
    "Tri-State",
  ],
  openGraph: {
    title: "SURE Mechanical — The Living Mechanical System",
    description: "Complete commercial mechanical systems from engineered concept to field execution.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-mech-navy text-blueprint-white`}
      >
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('sure-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})();` }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}