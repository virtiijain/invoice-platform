import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InvoicePro — Bill smarter, get paid faster",
    template: "%s | InvoicePro",
  },
  description:
    "InvoicePro is a modern invoice & billing platform for freelancers and small businesses. Create professional invoices, track payments, and manage clients.",
  keywords: [
    "invoice",
    "billing",
    "freelancer",
    "invoice generator",
    "payment tracking",
    "GST invoice",
    "India invoice",
    "small business",
  ],
  authors: [{ name: "Virti Jain", url: "https://github.com/virtiijain" }],
  creator: "Virti Jain",
  metadataBase: new URL("https://invoice-platform.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://invoice-platform.vercel.app",
    title: "InvoicePro — Bill smarter, get paid faster",
    description:
      "Create professional invoices, track payments, and manage clients — all in one place.",
    siteName: "InvoicePro",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvoicePro — Bill smarter, get paid faster",
    description:
      "Create professional invoices, track payments, and manage clients — all in one place.",
    creator: "@virtiijain",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}