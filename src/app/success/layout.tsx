import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Status",
  alternates: {},
  openGraph: null,
  twitter: null,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
