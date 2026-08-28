'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ApplicantList from '@/components/dashboard/ApplicantList';
import CompanyLogo from '@/components/ui/CompanyLogo';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    // Fetch appropriate data based on role
    if (user.publicMetadata?.role === 'RECRUITER') {
      fetch('/api/recruiter/jobs')
        .then(res => res.json())
        .then(data => {
          setRecruiterJobs(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      fetch('/api/applications')
        .then(res => res.json())
        .then(data => {
          setApplications(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-8" />
          <div className="space-y-4">
            <div className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
            <div className="h-24 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // Recruiter Dashboard
  if (user.publicMetadata?.role === 'RECRUITER') {
    const pendingJobs = recruiterJobs.filter(job => job.status === 'PENDING');
    const activeJobs = recruiterJobs.filter(job => job.status !== 'PENDING');

    const handleStatus = async (jobId, status) => {
      try {
        const res = await fetch(`/api/jobs/${jobId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          setRecruiterJobs(prev => prev.map(job => job.id === jobId ? { ...job, status } : job));
        }
      } catch (err) {
        console.error('Failed to update status', err);
      }
    };

    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Recruiter Dashboard</h1>
            <Link href="/post-job" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Post New Job
            </Link>
          </div>

          {pendingJobs.length > 0 && (
            <div className="mb-12 space-y-6">
              <h2 className="text-xl font-semibold text-amber-600 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Pending Approvals ({pendingJobs.length})
              </h2>
              {pendingJobs.map(job => (
                <div key={job.id} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company?.name} • Posted on {new Date(job.postedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleStatus(job.id, 'APPROVED')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">Approve</button>
                    <button onClick={() => handleStatus(job.id, 'REJECTED')} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recruiterJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">No jobs posted yet</h3>
              <p className="mt-2 text-slate-500 mb-6 max-w-md">You haven't posted any jobs. Create your first job listing to start receiving applications.</p>
              <Link href="/post-job" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Posted Jobs</h2>
              {activeJobs.map(job => (
                <ApplicantList key={job.id} job={job} applications={job.applications} />
              ))}
              {activeJobs.length === 0 && <p className="text-slate-500">All your posted jobs are pending approval.</p>}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Candidate Dashboard
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHORTLISTED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIRED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">My Applications</h1>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No applications yet</h3>
            <p className="mt-2 text-slate-500 mb-6 max-w-md">You haven't applied to any jobs. Browse our open positions and find your next dream role.</p>
            <Link href="/jobs" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applications.map((app) => (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                    <CompanyLogo logoUrl={app.job.company?.logoUrl} name={app.job.company?.name || 'J'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      <Link href={`/jobs/${app.job.id}`} className="hover:text-indigo-600 transition-colors">
                        {app.job.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <Link href={`/companies/${app.job.company.id}`} className="font-medium hover:text-slate-800">
                        {app.job.company.name}
                      </Link>
                      <span>&bull;</span>
                      <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center sm:justify-end">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
