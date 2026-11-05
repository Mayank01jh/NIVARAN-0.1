import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIVARAN (निवारण) — Citizen Emergency Lifeline",
  description: "One-second SOS emergency dispatch and ambient location medical response platform.",
  manifest: "/manifest.json",
  keywords: ["emergency", "ambulance", "SOS", "medical", "help", "Nivaran", "Golden Hour"],
  authors: [{ name: "NIVARAN Emergency Response Network" }],
  icons: {
    icon: "/nivaran-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#14213D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#FFF9EE] text-[#1E1B14] antialiased">{children}</body>
    </html>
  );
}
