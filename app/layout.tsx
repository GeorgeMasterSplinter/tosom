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
    <html lang="no" style={{ scrollBehavior: "smooth" }}>
      <body className="bg-gray-950 text-white antialiased" style={{ scrollBehavior: "smooth" }}>
        {children}
      </body>
    </html>
  );
}
