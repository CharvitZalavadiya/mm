import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./globalicons.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const poppins = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mind Maps",
  description: "One stop website for multiple tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className="bg-primaryBackground text-slate-200"
      >
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
