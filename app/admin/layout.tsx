import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <header className="p-4">Admin Panel</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
