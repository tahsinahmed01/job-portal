import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';

import { getJobs } from '@/lib/getJobs';

export const metadata = {
  title: 'Browse Jobs - Hired',
};

export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  
  const urlParams = new URLSearchParams(params);
  urlParams.set('paginate', 'true');
  
  const data = await getJobs(urlParams);
  
  const { jobs, totalCount, page, totalPages } = data;

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Find Your Next Role</h1>
          <p className="mt-2 text-slate-500">Showing {totalCount} open positions across all companies.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <JobFilters />
          </aside>

          <section className="lg:col-span-3">
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
                <p className="mt-1 text-slate-500">Try adjusting your filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Reuse searchParams to keep filters intact
                  const newParams = new URLSearchParams(params);
                  newParams.set('page', pageNum.toString());
                  const href = `/jobs?${newParams.toString()}`;
                  
                  return (
                    <a
                      key={pageNum}
                      href={href}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
