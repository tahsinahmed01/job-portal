import Link from 'next/link';
import CompanyLogo from '@/components/ui/CompanyLogo';

export const metadata = {
  title: 'Companies - Hired',
};

async function getCompanies() {
  const res = await fetch('http://localhost:3000/api/companies', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Top Companies Hiring Now</h1>
          <p className="mt-4 text-lg text-slate-500">Discover great places to work and browse their open positions.</p>
        </div>

        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No companies found</h3>
            <p className="mt-1 text-slate-500">There are currently no companies listed on the platform.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.id}`} className="group block">
                <article className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                      <CompanyLogo logoUrl={company.logoUrl} name={company.name || 'C'} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                      <p className="text-sm font-medium text-slate-500">{company.industry}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 line-clamp-3 mb-6 flex-grow">{company.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                      {company._count?.jobs || 0} Open Positions
                    </span>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">
                      View profile &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
