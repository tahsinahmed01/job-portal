import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CompanyLogo from '@/components/ui/CompanyLogo';
import JobDetailsClient from './JobDetailsClient';
import JobCard from '@/components/jobs/JobCard';

export async function generateMetadata({ params }) {
  const { jobId } = await params;
  const job = await prisma.job.findUnique({
    where: { id: parseInt(jobId) },
    include: { company: true },
  });
  
  if (!job) return { title: 'Job Not Found - Hired' };
  
  return {
    title: `${job.title} at ${job.company.name} - Hired`,
    description: job.description?.slice(0, 160) || 'View job details on Hired',
  };
}

export default async function JobDetails({ params }) {
  const { jobId } = await params;
  
  const job = await prisma.job.update({
    where: { id: parseInt(jobId) },
    data: { views: { increment: 1 } },
    include: { company: true }
  }).catch((err) => {
    console.error('Failed to update job views:', err);
    return null;
  });

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <Link href="/jobs" className="mt-4 inline-block text-indigo-600 transition-all hover:text-indigo-700">
          Back to Jobs
        </Link>
      </div>
    );
  }

  // Fetch relevant jobs
  const relevantJobs = await prisma.job.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: job.id },
      ...(job.category ? { category: job.category } : {})
    },
    include: { company: true },
    take: 3,
    orderBy: { postedAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-8">
          ← Back to all jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    <CompanyLogo logoUrl={job.company?.logoUrl} name={job.company?.name || 'J'} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{job.title}</h1>
                    <Link href={`/companies/${job.companyId}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-700 mt-1 inline-block">
                      {job.company?.name}
                    </Link>
                  </div>
                </div>
                <JobDetailsClient jobId={job.id} jobTitle={job.title} />
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {job.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    📍 {job.location}
                  </span>
                )}
                {job.workMode && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    💻 {job.workMode.replace('_', ' ')}
                  </span>
                )}
                {job.employmentType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    ⏱️ {job.employmentType.replace('_', ' ')}
                  </span>
                )}
                {job.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    📁 {job.category}
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                  👥 {job.vacancyCount} {job.vacancyCount === 1 ? 'Vacancy' : 'Vacancies'}
                </span>
                {job.deadline && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                    ⏳ Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Tabbed Content Area (Rendered sequentially for simplicity in server component) */}
            <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Job Description</h2>
              <div className="prose prose-indigo max-w-none text-slate-600 whitespace-pre-wrap mb-10">
                {job.description}
              </div>

              {job.requirements && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Requirements</h2>
                  <div className="prose prose-indigo max-w-none text-slate-600 whitespace-pre-wrap mb-10">
                    {job.requirements}
                  </div>
                </>
              )}

              {job.skills && job.skills.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <h2 className="text-xl font-bold text-slate-900 mb-6">Compensation & Benefits</h2>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 font-bold shadow-sm">
                    $
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Salary Range</p>
                    <p className="text-lg font-bold text-slate-900">
                      {job.salaryMin && job.salaryMax 
                        ? `$${job.salaryMin / 1000}k - $${job.salaryMax / 1000}k` 
                        : job.salaryMin 
                          ? `From $${job.salaryMin / 1000}k` 
                          : 'Not specified'}
                    </p>
                  </div>
                </div>
                {job.compensationNote && (
                  <p className="text-slate-600 text-sm mt-4">{job.compensationNote}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Relevant Jobs</h3>
              {relevantJobs.length > 0 ? (
                <div className="space-y-4">
                  {relevantJobs.map((relJob) => (
                    <Link key={relJob.id} href={`/jobs/${relJob.id}`} className="block group">
                      <div className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                            <CompanyLogo logoUrl={relJob.company?.logoUrl} name={relJob.company?.name || 'J'} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-1">{relJob.title}</h4>
                            <p className="text-xs text-slate-500">{relJob.company?.name}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span className="truncate">📍 {relJob.location}</span>
                          {relJob.salaryMin && <span>• ${relJob.salaryMin / 1000}k+</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No relevant jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
