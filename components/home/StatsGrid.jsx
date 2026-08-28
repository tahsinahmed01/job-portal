const METRICS = [
  { value: '10k+', label: 'Active Jobs' },
  { value: '500+', label: 'Top Companies' },
  { value: '98%', label: 'Hiring Success Rate' },
  { value: '2M+', label: 'Professionals Hired' },
];

export default function StatsGrid() {
  return (
    <section className="border-y border-slate-200/80 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8 lg:py-12">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="text-center transition-all duration-300 hover:-translate-y-0.5"
          >
            <p className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              {metric.value}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
