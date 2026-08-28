'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Show, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function PostJobPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [allCompanies, setAllCompanies] = useState([]);
  const [myCompanies, setMyCompanies] = useState([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(true);
  const [needsCompany, setNeedsCompany] = useState(false);

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    workMode: 'ON_SITE',
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    vacancyCount: 1,
    skills: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    compensationNote: '',
    deadline: '',
    companyId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vacancyCount' || name === 'salaryMin' || name === 'salaryMax'
        ? (value ? parseInt(value) : '')
        : value,
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isLoaded && user) {
      const fetchPromises = [fetch('/api/companies').then(res => res.json())];

      if (user.publicMetadata?.role === 'RECRUITER') {
        fetchPromises.push(fetch('/api/companies/me').then(res => res.json()));
      }

      Promise.all(fetchPromises)
        .then(([allData, meData]) => {
          if (Array.isArray(allData)) {
            setAllCompanies(allData);
            if (allData.length > 0 && !formData.companyId) {
              setFormData(prev => ({ ...prev, companyId: allData[0].id.toString() }));
            }
          }

          if (user.publicMetadata?.role === 'RECRUITER' && Array.isArray(meData)) {
            setMyCompanies(meData);
            if (meData.length === 0) {
              setNeedsCompany(true);
            } else if (meData.length > 0 && !formData.companyId) {
              setFormData(prev => ({ ...prev, companyId: meData[0].id.toString() }));
            }
          }
        })
        .catch(console.error)
        .finally(() => setFetchingCompanies(false));
    } else if (isLoaded) {
      setFetchingCompanies(false);
    }
  }, [isLoaded, user]);

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/companies/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyFormData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create company');

      setMyCompanies([data]);
      setAllCompanies(prev => [data, ...prev]);
      setFormData(prev => ({ ...prev, companyId: data.id.toString() }));
      setNeedsCompany(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.companyId) {
      setError('Please select a company');
      setLoading(false);
      return;
    }

    const processedData = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      salaryMin: formData.salaryMin || null,
      salaryMax: formData.salaryMax || null,
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post job');
      }

      router.push(`/jobs/${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isLoaded || fetchingCompanies) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-8" />
          <div className="h-96 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <Show when="signed-out">
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Sign In Required</h1>
            <p className="text-lg text-slate-500 mb-8">You must be signed in to post a job.</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Return Home
            </Link>
          </div>
        </Show>

        <Show when="signed-in">
          {user?.publicMetadata?.role === 'RECRUITER' && needsCompany ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create Company Profile</h1>
              <p className="text-slate-500 mb-8">You must create a company profile before posting a job.</p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Company Name</label>
                  <input type="text" name="name" required value={companyFormData.name} onChange={handleCompanyChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Industry</label>
                  <input type="text" name="industry" value={companyFormData.industry} onChange={handleCompanyChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Technology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea name="description" rows={3} value={companyFormData.description} onChange={handleCompanyChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Briefly describe your company..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Website</label>
                  <input type="url" name="website" value={companyFormData.website} onChange={handleCompanyChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="https://..." />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70 transition-all">
                    {loading ? 'Creating...' : 'Create Company & Continue'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Post a New Job</h1>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Company</label>
                    <select name="companyId" required value={formData.companyId} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500">
                      {user?.publicMetadata?.role === 'RECRUITER' ? (
                        <>
                          <optgroup label="My Companies">
                            {myCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </optgroup>
                          <optgroup label="Other Companies (Requires Approval)">
                            {allCompanies.filter(c => !myCompanies.find(mc => mc.id === c.id)).map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        allCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      )}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Job Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Senior Frontend Engineer" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Describe the role..."></textarea>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Requirements (Markdown/Text)</label>
                    <textarea name="requirements" rows={4} value={formData.requirements} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="- 3+ years experience&#10;- Knowledge of React"></textarea>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Skills (Comma separated)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. React, Node.js, TypeScript" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Engineering" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. San Francisco, CA" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Work Mode</label>
                    <select name="workMode" value={formData.workMode} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500">
                      <option value="ON_SITE">On-Site</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Employment Type</label>
                    <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500">
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Experience Level</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500">
                      <option value="ENTRY">Entry Level</option>
                      <option value="MID">Mid Level</option>
                      <option value="SENIOR">Senior Level</option>
                      <option value="LEAD">Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Vacancy Count</label>
                    <input type="number" min="1" name="vacancyCount" value={formData.vacancyCount} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Min Salary (USD)</label>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. 60000" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Max Salary (USD)</label>
                    <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. 100000" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Compensation Note (Overrides strict min/max formatting)</label>
                    <input type="text" name="compensationNote" value={formData.compensationNote} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Negotiable, Competitive Equity Package" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Application Deadline</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>

                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Posting Job...' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </Show>
      </div>
    </main>
  );
}
