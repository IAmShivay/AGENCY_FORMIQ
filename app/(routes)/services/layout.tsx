export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-24 md:pt-28"> {/* Add padding to account for fixed header */}
      {children}
    </div>
  );
}
