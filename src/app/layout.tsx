import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Cs_ThemeProvider from "@/components/providers/ThemeProvider";
import Cs_Navbar from "@/components/layout/Navbar";
import Cs_Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

// font
const cs_archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Book creative studios by the hour",
    template: "%s | StudioSpace",
  },
  description:
    "Find and book photo studios, film stages, podcast lounges, music suites and art workshops by the hour, or list your own creative space.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cs_archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Cs_ThemeProvider>
          <Cs_Navbar />
          <main className="flex-1">{children}</main>
          <Cs_Footer />
          <Toaster position="top-center" />
        </Cs_ThemeProvider>
      </body>
    </html>
  );
}
