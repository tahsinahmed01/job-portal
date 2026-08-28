import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LOCATIONS = ['All Locations', 'Remote', 'San Francisco', 'New York', 'Austin', 'London', 'Berlin'];

const POPULAR_SEARCHES = ['Remote', 'React Developer', 'UI/UX', 'Full Stack'];

const METRICS = [
  { value: '10k+', label: 'Active Jobs' },
  { value: '500+', label: 'Top Companies' },
  { value: '98%', label: 'Hiring Success Rate' },
  { value: '2M+', label: 'Professionals Hired' },
];

const COMPANIES = [
  { name: 'Nexus', initials: 'NX' },
  { name: 'Orbit', initials: 'OR' },
  { name: 'Pulse', initials: 'PL' },
  { name: 'Vertex', initials: 'VX' },
  { name: 'Horizon', initials: 'HZ' },
  { name: 'Cascade', initials: 'CS' },
];

function SearchIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  );
}

function MapPinIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');

  useEffect(() => {
    fetch('http://localhost:5001/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const q = keyword.trim().toLowerCase();
    const matchesKeyword =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q);
    const matchesLocation =
      location === 'All Locations' ||
      job.location?.toLowerCase().includes(location.toLowerCase());
    return matchesKeyword && matchesLocation;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const applyPopular = (tag) => {
    setKeyword(tag === 'Remote' ? '' : tag);
    if (tag === 'Remote') setLocation('Remote');
    document.getElementById('latest-jobs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 10%, rgba(59,130,246,0.14), transparent 40%), radial-gradient(circle at 50% 80%, rgba(99,102,241,0.1), transparent 50%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Job Portal for Modern Talent
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
              Discover thousands of job opportunities from top tech companies and startups.
            </p>
          </div>

          {/* Search bar */}
          <form
            id="search"
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-200/60 sm:p-3"
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <label className="relative flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/30">
                <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title or keyword"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </label>

              <label className="relative flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/30">
                <MapPinIcon className="h-5 w-5 shrink-0 text-slate-400" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm text-slate-900 outline-none sm:text-base"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 sm:text-base lg:min-w-[160px]"
              >
                <SearchIcon className="h-4 w-4" />
                Search Jobs
              </button>
            </div>
          </form>

          {/* Popular tags */}
          <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-500 sm:text-sm">Popular:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => applyPopular(tag)}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md sm:text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8 lg:py-12">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="text-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <p className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                {metric.value}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted companies */}
      <section id="companies" className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Trusted by top industry leaders
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COMPANIES.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-5 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-600">
                  {company.initials}
                </span>
                <span className="text-sm font-semibold tracking-wide">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based CTAs */}
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
              to="#latest-jobs"
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
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-lg"
            >
              Post a Job
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </article>
        </div>
      </section>

      {/* Latest jobs from API */}
      <section id="latest-jobs" className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Latest Openings</h2>
              <p className="mt-1 text-slate-600">Fresh roles from our hiring partners.</p>
            </div>
            {(keyword || location !== 'All Locations') && (
              <p className="text-sm text-slate-500">
                Showing {filteredJobs.length} result{filteredJobs.length === 1 ? '' : 's'}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-slate-800">No jobs match your search</p>
              <p className="mt-2 text-slate-500">Try a different keyword or location.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-sm font-bold text-indigo-700">
                      {(job.company || 'J').slice(0, 2).toUpperCase()}
                    </div>
                    {job.salary && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="mt-1 text-sm font-medium text-indigo-600">{job.company}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPinIcon className="h-4 w-4" />
                    {job.location}
                  </p>
                  <Link
                    to={`/job/${job.id}`}
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
    </div>
  );
}

export default Home;
