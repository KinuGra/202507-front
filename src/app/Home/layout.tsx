import type { Metadata } from "next";
import HomeClientLayout from "./components/HomeClientLayout";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeClientLayout>{children}</HomeClientLayout>;
}
