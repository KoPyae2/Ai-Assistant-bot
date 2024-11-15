import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Ai Assistant",
  description: "The AI customer service bot allows users to create multiple bots tailored to their specific needs, each capable of handling unique inquiries. Users can input relevant data for each bot, ensuring that responses are generated solely based on the provided information, enhancing accuracy and context for customer interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      <html lang="en">
        <body
          className='min-h-screen flex bg-[#181C14]'
        >
          {children}
          {/* Toast  */}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
