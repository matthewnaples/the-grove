import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Grove - Component Registry",
  description: "A component registry for The Grove",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
