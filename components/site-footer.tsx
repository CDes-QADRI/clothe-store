export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-background dark:border-zinc-800">
      <div className="container-shell flex flex-col gap-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
        <p>© {new Date().getFullYear()} AURALEEN . All rights reserved.</p>
        <p>Made for Business · Cash on Delivery only.</p>
      </div>
    </footer>
  );
}
