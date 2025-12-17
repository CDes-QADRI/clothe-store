export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="container-shell flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} AURALEEN . All rights reserved.</p>
        <p>Made for Business · Cash on Delivery only.</p>
      </div>
    </footer>
  );
}
