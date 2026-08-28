import { prisma } from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = 'http://localhost:3000'; // Change to production URL when deploying

  // Fetch dynamic routes
  const jobs = await prisma.job.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, postedAt: true }
  });
  
  const companies = await prisma.company.findMany({
    select: { id: true, createdAt: true }
  });

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.postedAt,
  }));

  const companyUrls = companies.map((company) => ({
    url: `${baseUrl}/companies/${company.id}`,
    lastModified: company.createdAt,
  }));

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/jobs`, lastModified: new Date() },
    { url: `${baseUrl}/companies`, lastModified: new Date() },
  ];

  return [...staticRoutes, ...companyUrls, ...jobUrls];
}
