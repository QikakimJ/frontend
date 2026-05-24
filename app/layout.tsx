import "./globals.css";

export const metadata = {
  title: "JNE Mobile & Web",
  description: "Sistem pengiriman JNE untuk mobile dan web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className="bg-slate-50 text-slate-900 antialiased"
        style={{ backgroundColor: "#f4f7fb", color: "#0f172a" }}
      >
        {children}
      </body>
    </html>
  );
}