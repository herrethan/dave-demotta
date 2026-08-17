import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} David DeMotta. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <p>Photography by Chris Drukker</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
