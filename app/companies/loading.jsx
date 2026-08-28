export default function CompaniesLoading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-md mx-auto mb-4" />
          <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-md mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-6 w-32 bg-slate-100 animate-pulse rounded-md" />
                  <div className="h-4 w-24 bg-slate-50 animate-pulse rounded-md" />
                </div>
              </div>
              <div className="space-y-2 mb-8 flex-grow">
                <div className="h-4 w-full bg-slate-50 animate-pulse rounded-md" />
                <div className="h-4 w-5/6 bg-slate-50 animate-pulse rounded-md" />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="h-5 w-24 bg-slate-100 animate-pulse rounded-full" />
                <div className="h-5 w-16 bg-slate-100 animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
