'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1'); // Reset to first page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name, value) => {
    router.push(`/jobs?${createQueryString(name, value)}`);
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between lg:block">
        <h3 className="font-semibold text-slate-900 lg:mb-4">Filters</h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-md"
        >
          <svg className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className={`flex-col gap-5 ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchParams.get('category') || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Data">Data</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <input
            type="text"
            placeholder="e.g. Remote, New York"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchParams.get('location') || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchParams.get('employmentType') || ''}
            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchParams.get('experienceLevel') || ''}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="ENTRY">Entry Level</option>
            <option value="MID">Mid Level</option>
            <option value="SENIOR">Senior Level</option>
            <option value="LEAD">Lead</option>
          </select>
        </div>

        <button 
          onClick={() => router.push('/jobs')}
          className="mt-2 w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
