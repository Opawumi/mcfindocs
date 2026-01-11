import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider, ThemeProvider, ToastProvider, AuthProvider } from "@/providers";

export const metadata: Metadata = {
  title: "McFin Docs - Enterprise Document Management System",
  description: "Streamline your document organization and improve collaboration with McFin Docs EDMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'Figtree, sans-serif' }} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <ToastProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
