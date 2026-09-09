import type { Metadata } from "next";
import { Amiri, Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "A & L | Wedding Invitation",
  description: "You are cordially invited",
  icons: {
    icon: "/svg.webp",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${montserrat.variable} ${amiri.variable} lock-scroll h-full antialiased`}
    >
      <body className="lock-scroll min-h-full bg-black font-primary text-white">
        {children}
      </body>
    </html>
  );
}
