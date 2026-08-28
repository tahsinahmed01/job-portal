'use client';

import { useState } from 'react';

export default function ApplicantList({ job, applications }) {
  const [isOpen, setIsOpen] = useState(false);
  const [apps, setApps] = useState(applications || []);
  const [loadingAppId, setLoadingAppId] = useState(null);

  const handleStatusChange = async (appId, newStatus) => {
    setLoadingAppId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updatedApp = await res.json();
      setApps(apps.map(a => a.id === appId ? updatedApp : a));
    } catch (err) {
      console.error(err);
      alert('Failed to update application status.');
    } finally {
      setLoadingAppId(null);
    }
  };

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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${job.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
              {job.status}
            </span>
            <span>&bull;</span>
            <span>{apps.length} Applicant{apps.length !== 1 && 's'}</span>
            <span>&bull;</span>
            <span>{job.views || 0} Views</span>
            <span>&bull;</span>
            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div>
          <svg className={`h-6 w-6 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          {apps.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No applications received yet.</p>
          ) : (
            <div className="space-y-4">
              {apps.map(app => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{app.user.name}</h4>
                    <p className="text-sm text-slate-500">{app.user.email}</p>
                    <div className="mt-2 text-sm text-slate-600">
                      <strong>Cover Letter:</strong>
                      <p className="line-clamp-2 italic">{app.coverLetter || 'No cover letter provided.'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    {app.resumeLink && (
                      <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center gap-1">
                        View Resume
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <select 
                        className="text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
                        value={app.status}
                        disabled={loadingAppId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="HIRED">HIRED</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
