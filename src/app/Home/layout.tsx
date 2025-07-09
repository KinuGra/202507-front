import type { Metadata } from "next";
import HomeClientLayout from "./components/HomeClientLayout";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HomeClientLayout>{children}</HomeClientLayout>
    </ThemeProvider>
  );
}
