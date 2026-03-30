import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiConnect - Find Trusted Service Providers Near You",
  description:
    "Connect with verified local service providers. Book plumbing, cleaning, electrical, and more — with secure contracts, OTP verification, and seamless payments.",
  keywords: ["service marketplace", "local services", "book service provider", "home services"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
