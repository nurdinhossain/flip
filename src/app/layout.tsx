import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto"
})

export const metadata: Metadata = {
  title: "Flip",
  description: "The better way to dispose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${roboto.className} antialiased`} lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
