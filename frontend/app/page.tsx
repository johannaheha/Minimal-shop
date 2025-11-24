import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Minimal Shop Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Willkommen in meinem kleinen Fullstack-Shop-Projekt. Verwalte
            Produkte, Kunden und Bestellungen über eine einfache Oberfläche.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/products"
            className="block rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-5 space-y-2"
          >
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>
            <p className="text-sm text-slate-600">
              Liste deiner Produkte ansehen, neue Produkte anlegen und Preise &
              Beschreibungen verwalten.
            </p>
          </Link>

          <Link
            href="/customers"
            className="block rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-5 space-y-2"
          >
            <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
            <p className="text-sm text-slate-600">
              Kundenliste ansehen, neue Kunden hinzufügen und ihre zugehörigen
              Bestellungen im Blick behalten.
            </p>
          </Link>

          <Link
            href="/orders"
            className="block rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition p-5 space-y-2"
          >
            <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
            <p className="text-sm text-slate-600">
              Bestellungen anlegen, zugehörige Produkte und KundenIDs verwalten
              und den Gesamtpreis im Blick behalten.
            </p>
          </Link>
        </section>

        <footer className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Backend: <span className="font-mono">http://localhost:3000</span> ·
            Frontend: <span className="font-mono">http://localhost:3001</span>
          </p>
          <p className="text-xs text-slate-500">
            Built with{" "}
            <span className="font-semibold">NestJS &amp; Next.js</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
