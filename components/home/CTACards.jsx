import Link from 'next/link';

export default function CTACards() {
  return (
    <section id="post-job" className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:gap-8 lg:px-8">
        <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-10">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 transition-transform duration-500 group-hover:scale-125" />
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">For Job Seekers</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Looking for a Job?</h2>
          <p className="mt-3 max-w-md text-slate-600">
            Explore curated openings matched to your skills and land your next role faster.
          </p>
          <Link
            href="/#latest-jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
          >
            Browse Openings
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </article>

        <article className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-10">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/20 transition-transform duration-500 group-hover:scale-125" />
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">For Recruiters</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Hiring Top Talent?</h2>
          <p className="mt-3 max-w-md text-slate-300">
            Reach qualified candidates quickly and fill roles with confidence.
          </p>
          <Link
            href="/post-job"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-lg"
          >
            Post a Job
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </article>
      </div>
    </section>
  );
}
