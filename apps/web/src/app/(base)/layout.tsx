

import "@/app/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "../providers";


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Booking system",
  description: "Booking system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth()

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Providers>

          <header className="container mx-auto flex items-center justify-between py-4">
          </header>
          <main className='container min-h-screen flex flex-col items-center text-start'>
            {children}
          </main>
          {/* <Toaster /> */}
        </Providers>
      </body>
    </html>
  );
}
