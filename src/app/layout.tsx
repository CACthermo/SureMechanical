import type { Metadata } from "next";
import { Michroma, Outfit } from "next/font/google";
import "./globals.css";

const brandDisplay = Michroma({
  variable: "--font-brand-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const brandBody = Outfit({
  variable: "--font-brand-body",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={`${brandDisplay.variable} ${brandBody.variable}`} suppressHydrationWarning>
      <body
        className="antialiased bg-mech-navy text-blueprint-white"
      >
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('sure-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})();` }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}