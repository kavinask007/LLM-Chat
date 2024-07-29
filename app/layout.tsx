// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/component/ThemeProvider";
const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      {/* <script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script> */}
      </head>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >

        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
