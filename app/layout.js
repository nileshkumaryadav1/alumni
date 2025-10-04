import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./client-wrapper";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alumni Management System | Connecting Graduates & Building Futures",
  description:
    "A centralized alumni management platform for networking, mentorship, events, and career opportunities.",
  keywords: "alumni, networking, directory, mentorship, jobs, events",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Alumni Management System | Connecting Graduates & Building Futures",
    description:
      "A centralized alumni management platform for networking, mentorship, events, and career opportunities.",
    url: "https://alumni-manage-system.vercel.app",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Alumni Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Management System | Connecting Graduates & Building Futures",
    description:
      "A centralized alumni management platform for networking, mentorship, events, and career opportunities.",
    image: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <SessionProviderWrapper>
          {/* Only wrap interactive components in ClientWrapper */}
          <ClientWrapper>{children}</ClientWrapper>
        </SessionProviderWrapper>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
