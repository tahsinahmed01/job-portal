'use client';

import { useState } from 'react';
import { Show, SignInButton, useUser } from '@clerk/nextjs';
import ApplyModal from '@/components/jobs/ApplyModal';

export default function JobDetailsClient({ jobId, jobTitle }) {
  const { user } = useUser();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const isCandidate = user?.publicMetadata?.role === 'CANDIDATE' || !user?.publicMetadata?.role;

  return (
    <div className="w-full sm:w-auto shrink-0 z-10">
      <Show when="signed-in">
        {isCandidate ? (
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Apply Now
          </button>
        ) : (
          <button disabled className="w-full sm:w-auto rounded-xl bg-slate-100 px-8 py-3 text-sm font-semibold text-slate-400 cursor-not-allowed">
            Recruiters cannot apply
          </button>
        )}
      </Show>
      
      <Show when="signed-out">
        <SignInButton mode="modal" fallbackRedirectUrl={`/jobs/${jobId}`}>
          <button className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
            Sign in to apply
          </button>
        </SignInButton>
      </Show>

      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        jobId={jobId} 
        jobTitle={jobTitle} 
      />
    </div>
  );
}
