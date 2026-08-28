import type { Metadata, Viewport } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Providers } from "@shared/providers";
import "@shared/styles/globals.css";

const playfairDisplay = Playfair_Display({
 variable: "--font-playfair-display",
 subsets: ["latin", "vietnamese"],
 display: "swap",
});

const sourceSans3 = Source_Sans_3({
 variable: "--font-source-sans-3",
 subsets: ["latin", "vietnamese"],
 display: "swap",
});

export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
};

export const metadata: Metadata = {
 title: {
 default: "MindNova AI",
 template: "%s | MindNova AI",
 },
 description:
 "MindNova AI - Nền tảng trí tuệ nhân tạo tiên tiến giúp bạn học tập dễ dàng và hiệu quả.",
 keywords: ["AI", "learning", "education", "personalized", "study plan"],
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="vi" suppressHydrationWarning>
 <body className={`${playfairDisplay.variable} ${sourceSans3.variable}`} suppressHydrationWarning>
 <Providers>{children}</Providers>
 </body>
 </html>
 );
}
