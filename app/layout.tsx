import "@/styles/globals.css";

export const metadata = {
  title: "ToSom",
  description: "Nordisk datingplattform",
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
