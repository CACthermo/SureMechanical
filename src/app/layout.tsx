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
  title: "SURE Mechanical | Commercial HVAC in Cincinnati",
  description:
    "Commercial heating, cooling, mechanical design, ductwork and piping in Cincinnati, Southern Ohio and Northern Kentucky. Contact SURE Mechanical about your project.",
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
    title: "SURE Mechanical | Commercial HVAC in Cincinnati",
    description: "Commercial heating, cooling, mechanical design, ductwork and piping in Cincinnati and the surrounding region.",
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