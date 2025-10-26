import type { Metadata } from "next";

import { CopilotKit } from "@copilotkit/react-core";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

export const metadata: Metadata = {
  title: "AI Meme Generator - I Totally Understand Human Humor",
  description: "Watch AI hilariously fail at making memes while being super confident about it!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="meme_agent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
