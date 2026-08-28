'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

function MapPinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

export default function JobTicker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');

  useEffect(() => {
    fetch('/api/jobs?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const q = keyword.trim().toLowerCase();
    const matchesKeyword =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.name?.toLowerCase().includes(q);
    const matchesLocation =
      location === 'All Locations' ||
      job.location?.toLowerCase().includes(location.toLowerCase());
    return matchesKeyword && matchesLocation;
  });

  return (
    <section id="latest-jobs" className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Latest Openings</h2>
            <p className="mt-1 text-slate-600">Fresh roles from our hiring partners.</p>
          </div>
          <div className="flex items-center gap-4">
            {(keyword || location !== 'All Locations') && (
              <p className="text-sm text-slate-500">
                Showing {filteredJobs.length} result{filteredJobs.length === 1 ? '' : 's'}
              </p>
            )}
            <Link
              href="/jobs"
              className="group flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-blue-600 hover:text-blue-600"
            >
              See All Jobs
              <ChevronRight className="h-4 w-4 transition-colors duration-200 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">No jobs match your search</p>
            <p className="mt-2 text-slate-500">Try a different keyword or location.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {filteredJobs.slice(0, 8).map((job) => (
              <article
                key={job.id}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-sm font-bold text-indigo-700">
                    {(job.company?.name || 'J').slice(0, 2).toUpperCase()}
                  </div>
                  {(job.salaryMin || job.salaryMax) && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {job.salaryMin && job.salaryMax
                        ? `$${Math.round(job.salaryMin / 1000)}k - $${Math.round(job.salaryMax / 1000)}k`
                        : job.salaryMin
                        ? `$${Math.round(job.salaryMin / 1000)}k+`
                        : `Up to $${Math.round(job.salaryMax / 1000)}k`}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{job.title}</h3>
                <p className="mt-1 text-sm font-medium text-indigo-600">{job.company?.name}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPinIcon className="h-4 w-4" />
                  {job.location}
                </p>
                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-5 inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
