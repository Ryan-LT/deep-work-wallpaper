import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Silent Architect - Focused Workspace",
  description: "Focused workspace with rotating focus quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link
          rel="icon"
          href="/focus-favicon.svg"
          type="image/svg+xml"
          sizes="any"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background min-h-screen selection:bg-primary-container selection:text-primary flex items-center justify-center overflow-hidden">
        {children}
      </body>
    </html>
  );
}
