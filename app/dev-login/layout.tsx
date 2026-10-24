import type { Metadata } from "next";

// TC-11: dev-verktøy — skal ikke indexeres.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
