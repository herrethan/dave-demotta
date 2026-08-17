import type { Metadata } from "next";
import { Geist, Libertinus_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const libertinusSans = Libertinus_Sans({
  variable: "--font-libertinus",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dave DeMotta",
    template: "%s | Dave DeMotta",
  },
  description:
    "David DeMotta is a jazz pianist, educator, and music scholar based in the New York City area.",
};

// Default to dark; an inline script flips to light before paint if the
// visitor previously chose it, so there's no flash of the wrong theme.
const themeInit = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${libertinusSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
