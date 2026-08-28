import { prisma } from '@/lib/prisma';

export async function getJobs(searchParams) {
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const employmentType = searchParams.get('employmentType');
  const experienceLevel = searchParams.get('experienceLevel');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  const where = {
    status: 'APPROVED', // Default to approved jobs
  };

  if (category) where.category = category;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (employmentType) where.employmentType = employmentType;
  if (experienceLevel) where.experienceLevel = experienceLevel;

  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: true },
      orderBy: { postedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  const paginate = searchParams.get('paginate') === 'true';

  if (paginate) {
    return {
      jobs,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  return jobs;
}
