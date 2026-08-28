'use client';

import { useState } from 'react';

const LOCATIONS = ['All Locations', 'Remote', 'San Francisco', 'New York', 'Austin', 'London', 'Berlin'];
const POPULAR_SEARCHES = ['Remote', 'React Developer', 'UI/UX', 'Full Stack'];

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

export default function Hero() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');

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
  );
}
