import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {GoogleAnalytics} from '@next/third-parties/google'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import "./globals.css";

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
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // 1. 修正网页语言为中文
        <html lang="zh-CN">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. 增加无障碍支持和新标签页打开 */}
        <a
            href="https://github.com/ymslucky/holiday"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-4 right-4 w-8 h-8"
            aria-label="访问GitHub仓库（新标签页打开）"
        >
            <FontAwesomeIcon
                icon={faGithub}
                className="text-gray-500 hover:text-gray-700"
                size="lg"  // 明确图标尺寸
            />
        </a>

        {children}

        {/* 3. 将Google Analytics移到body内部 */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''}/>
        </body>
        </html>
    );
}