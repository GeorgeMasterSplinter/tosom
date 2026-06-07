import "@/styles/globals.css";

export const metadata = {
  title: "ToSom",
  description: "Nordic-inspired dating platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="bg-background text-dark antialiased">
        {children}
      </body>
    </html>
  );
}
