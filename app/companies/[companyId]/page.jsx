import Link from 'next/link';
import JobCard from '@/components/jobs/JobCard';
import CompanyLogo from '@/components/ui/CompanyLogo';

async function getCompany(id) {
  const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch company');
  }
  return res.json();
}

export async function generateMetadata({ params }) {
  const { companyId } = await params;
  const company = await getCompany(companyId).catch(() => null);
  
  if (!company) return { title: 'Company Not Found - Hired' };
  
  return {
    title: `${company.name} Careers and Jobs - Hired`,
    description: company.description?.slice(0, 160) || `View open positions and careers at ${company.name}`,
  };
}

export default async function CompanyDetails({ params }) {
  const { companyId } = await params;
  const company = await getCompany(companyId);

  if (!company) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Company Not Found</h2>
        <Link href="/companies" className="mt-4 inline-block text-indigo-600 transition-all hover:text-indigo-700">
          Back to Companies
        </Link>
      </div>
    );
  }

  const publishedJobs = company.jobs?.filter(j => j.status === 'APPROVED') || [];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-8">
          ← Back to directory
        </Link>

        {/* Company Header */}
        <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm">
              <CompanyLogo logoUrl={company.logoUrl} name={company.name || 'C'} />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{company.name}</h1>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
                    Visit Website
                  </a>
                )}
              </div>
              <p className="text-lg font-medium text-indigo-600 mt-2">{company.industry}</p>
              
              <div className="mt-6 prose prose-slate max-w-none text-slate-600">
                <p>{company.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions ({publishedJobs.length})</h2>
          
          {publishedJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              No open positions at this time. Check back later!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {publishedJobs.map(job => (
                <JobCard key={job.id} job={{ ...job, company }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
