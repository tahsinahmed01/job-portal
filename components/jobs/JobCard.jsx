import Link from 'next/link';
import CompanyLogo from '@/components/ui/CompanyLogo';
export default function JobCard({ job }) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
            <CompanyLogo logoUrl={job.company?.logoUrl} name={job.company?.name || 'J'} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              <Link href={`/jobs/${job.id}`}>
                <span className="absolute inset-0" />
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-slate-500">{job.company?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="rounded-full bg-slate-100 px-2.5 py-1">{job.location}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1">
          {job.employmentType.replace('_', ' ')}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1">{job.experienceLevel}</span>
        {(job.salaryMin || job.salaryMax) && (
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">
            ${Math.round(job.salaryMin / 1000)}k - ${Math.round(job.salaryMax / 1000)}k
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
      </div>
    </article>
  );
}
