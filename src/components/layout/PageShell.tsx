"use client";

interface PageShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function PageShell({ children, sidebar }: PageShellProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <main>{children}</main>
        {sidebar && <div className="hidden lg:block">{sidebar}</div>}
      </div>
    </div>
  );
}
