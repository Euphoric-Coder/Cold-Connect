import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import SyncUser from "@/components/SyncUser";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Cold Connect - Cold Mailing Got Easier",
  description: "Cold Connect is a new way to send cold emails to job seekers.",
};

export default function RootLayout({ children }) {
  return (
    <ConvexClientProvider>
      <ClerkProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SyncUser />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </ConvexClientProvider>
  );
}
