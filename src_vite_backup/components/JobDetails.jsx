import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/jobs')
      .then((res) => res.json())
      .then((data) => {
        const singleJob = data.find((j) => j.id === parseInt(id));
        setJob(singleJob);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching job details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <p className="mt-4 text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 transition-all duration-300 hover:text-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 text-lg font-bold text-indigo-700">
          {(job.company || 'J').slice(0, 2).toUpperCase()}
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">{job.title}</h1>
        <p className="mt-2 text-lg font-semibold text-indigo-600">{job.company}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">{job.location}</span>
          {job.salary && (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
              {job.salary}
            </span>
          )}
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:text-indigo-700"
        >
          ← Back to All Jobs
        </Link>
      </article>
    </div>
  );
}

export default JobDetails;
