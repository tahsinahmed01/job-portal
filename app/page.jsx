import Hero from '@/components/home/Hero'
import StatsGrid from '@/components/home/StatsGrid'
import CompanyLogos from '@/components/home/CompanyLogos'
import CTACards from '@/components/home/CTACards'
import JobTicker from '@/components/home/JobTicker'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <StatsGrid />
      <CompanyLogos />
      <CTACards />
      <JobTicker />
    </div>
  )
}
