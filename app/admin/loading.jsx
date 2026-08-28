export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-md mb-8" />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200 p-6 flex gap-8">
            <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md" />
            <div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md" />
          </div>
          
          <div className="p-0">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[1, 2, 3, 4].map(i => (
                    <th key={i} className="px-6 py-4">
                      <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    {[1, 2, 3, 4].map(j => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
