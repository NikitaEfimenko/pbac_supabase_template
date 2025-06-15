import "@/app/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "../../providers";
import { createSupabaseClient } from "@booking/infra/server/supabase"
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Calendar, Home, Settings } from "lucide-react";
import { signOut } from "@/app/(base)/auth/_actions/logout";
import { Toaster } from "@/shared/ui/sonner";
import { getServerSession } from "@booking/infra/server/get-session";
import { Badge } from "@/shared/ui/badge";
import { RoleGuard } from "@/entities/user/server/guards/permission.server";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistVF.woff",
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

  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const session = await getServerSession()
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

          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  BookingSystem
                </Link>
                <div className="flex items-center gap-4">
                  <RoleGuard role="user">
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard">
                        <Home className="w-4 h-4 mr-2" />
                        Explore
                      </Link>
                    </Button>
                  </RoleGuard>
                  <RoleGuard role="user">
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard/bookings">
                        <Calendar className="w-4 h-4 mr-2" />
                        My bookings
                      </Link>
                    </Button>
                  </RoleGuard>
                  <RoleGuard role="admin">
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard/admin">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin panel
                      </Link>
                    </Button>
                  </RoleGuard>
                </div>
                <div>
                  {user && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                      <Badge>{session?.role}</Badge>
                      <form action={signOut}>
                        <Button size="sm" variant="secondary" type="submit">Exit</Button>
                      </form>
                    </div>
                  )}
                </div>
              </nav>
            </div>

          </header>
          <main className='container min-h-screen flex flex-col items-center text-start'>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>

  );
}
