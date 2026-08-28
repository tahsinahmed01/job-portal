export default function JobsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-md mb-4" />
          <div className="h-4 w-48 bg-slate-200 animate-pulse rounded-md" />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="h-6 w-32 bg-slate-100 animate-pulse rounded-md" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-xl" />
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-xl" />
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-xl" />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-[280px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-slate-100 animate-pulse rounded-md" />
                      <div className="h-4 w-24 bg-slate-100 animate-pulse rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="h-4 w-full bg-slate-50 animate-pulse rounded-md" />
                    <div className="h-4 w-5/6 bg-slate-50 animate-pulse rounded-md" />
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-full" />
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded-full" />
                  </div>
                  <div className="h-10 w-full bg-slate-100 animate-pulse rounded-xl" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
