'use client';

import { useState, useEffect } from 'react';
import { Show, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role === 'ADMIN') {
      Promise.all([
        fetch('/api/admin/jobs').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json())
      ]).then(([jobsData, usersData]) => {
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      }).catch(console.error).finally(() => setLoading(false));
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  const handleJobStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserRoleChange = async (id, role) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isLoaded || loading) {
    return <div className="min-h-screen bg-slate-50 p-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Show when="signed-in">
          {user?.publicMetadata?.role === 'ADMIN' ? (
            <div className="space-y-12">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Admin Panel</h1>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Users</h2>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{u.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{u.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select 
                              value={u.role} 
                              onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                              className="rounded-md border border-slate-300 py-1 px-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-white"
                            >
                              <option value="CANDIDATE">Candidate</option>
                              <option value="RECRUITER">Recruiter</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-amber-600 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Pending Approvals
                </h2>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {jobs.filter(j => j.status === 'PENDING').map(j => (
                        <tr key={j.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{j.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{j.company?.name || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-amber-100 text-amber-800">
                              {j.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 space-x-2">
                            <button onClick={() => handleJobStatusChange(j.id, 'APPROVED')} className="text-emerald-600 hover:text-emerald-900 font-medium">Approve</button>
                            <button onClick={() => handleJobStatusChange(j.id, 'REJECTED')} className="text-red-600 hover:text-red-900 font-medium">Reject</button>
                          </td>
                        </tr>
                      ))}
                      {jobs.filter(j => j.status === 'PENDING').length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No pending jobs</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">All Jobs</h2>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {jobs.filter(j => j.status !== 'PENDING').map(j => (
                        <tr key={j.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{j.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{j.company?.name || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${j.status === 'APPROVED' ? 'bg-green-100 text-green-800' : j.status === 'CLOSED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {j.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 space-x-2">
                            <button onClick={() => handleJobStatusChange(j.id, 'APPROVED')} className="text-indigo-600 hover:text-indigo-900 font-medium">Approve</button>
                            <button onClick={() => handleJobStatusChange(j.id, 'DRAFT')} className="text-yellow-600 hover:text-yellow-900 font-medium">Draft</button>
                            <button onClick={() => handleJobStatusChange(j.id, 'CLOSED')} className="text-red-600 hover:text-red-900 font-medium">Close</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Unauthorized</h1>
              <p className="text-lg text-slate-500 mb-8">You must be an Administrator to view this page.</p>
              <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Return Home
              </Link>
            </div>
          )}
        </Show>
      </div>
    </main>
  );
}
