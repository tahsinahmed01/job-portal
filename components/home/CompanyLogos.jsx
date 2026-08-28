const COMPANIES = [
  { name: 'Nexus', initials: 'NX' },
  { name: 'Orbit', initials: 'OR' },
  { name: 'Pulse', initials: 'PL' },
  { name: 'Vertex', initials: 'VX' },
  { name: 'Horizon', initials: 'HZ' },
  { name: 'Cascade', initials: 'CS' },
];

export default function CompanyLogos() {
  return (
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
  );
}
