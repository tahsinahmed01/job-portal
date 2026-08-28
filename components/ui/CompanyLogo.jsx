'use client';
import { useState } from 'react';

export default function CompanyLogo({ logoUrl, name }) {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {logoUrl && !hasError ? (
        <img 
          src={logoUrl} 
          alt={name} 
          className="h-full w-full object-contain p-2"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-lg font-bold text-slate-400">
          {(name || 'C').slice(0, 2).toUpperCase()}
        </span>
      )}
    </>
  );
}
