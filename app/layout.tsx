import type { Metadata } from "next";
import { Merriweather, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/providers/tanstack-query";
import { ThemeProvider } from "next-themes"; // Certifique-se de instalar com pnpm add next-themes

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "BarberMaps", // Já mudei para o novo nome!
  description: "Os melhores agendamentos na palma da sua mão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // O suppressHydrationWarning deve ficar aqui na tag <html>
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${merriweather.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* O ThemeProvider envolve tudo que está DENTRO do body */}
        <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dark", "panther"]}>
          <TanstackQueryProvider>
            {children}
            <Toaster />
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}