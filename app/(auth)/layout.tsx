import "../globals.css";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="custom-container h-screen items-center justify-center flex">
      {children}
    </div>
  );
}
