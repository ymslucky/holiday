import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {GoogleAnalytics} from '@next/third-parties/google'
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "假期日历",
    description: "本网站提供直观的假期日历，清晰展示放假与调休，助您轻松掌握假期安排，提前规划节日活动。",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        <GoogleAnalytics gaId="G-6WP6EJJ055"/>
        </html>
    );
}
