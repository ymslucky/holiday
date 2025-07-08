import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {GoogleAnalytics} from '@next/third-parties/google'
import {Github} from 'lucide-react';
import "./globals.css";
import {Analytics} from "@vercel/analytics/next";

// 字体配置保持不变，next/font 会自动优化预加载
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
    icons: {
        icon: "/images/favicon.svg",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 增加无障碍支持和新标签页打开 */}
        <a
            href="https://github.com/ymslucky/holiday"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-4 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-50"
            aria-label="访问GitHub仓库（新标签页打开）"
        >
            <Github size={24} className="text-gray-700 hover:text-gray-900"/>
        </a>

        {children}

        {/* Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''}/>
        <Analytics/>
        </body>
        </html>
    );
}