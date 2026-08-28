import { prisma } from '../lib/prisma.js';

async function main() {
  console.log('Seeding database with expanded job dataset...');
  
  // Clean up existing jobs (which will cascade delete applications tied to these jobs, 
  // but we won't touch other data manually as requested).
  await prisma.job.deleteMany();

  const companies = await prisma.company.findMany();
  const recruiters = await prisma.user.findMany({ where: { role: 'RECRUITER' } });

  if (companies.length === 0 || recruiters.length === 0) {
    console.error('No companies or recruiters found. Please run the original seed first.');
    return;
  }

  // Create Jobs (24 jobs)
  console.log('Creating jobs...');
  const titles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer', 'Marketing Coordinator', 'Data Analyst', 'Technical Lead'];
  const locations = ['Remote', 'Dhaka, Bangladesh', 'New York, NY', 'Sylhet, Bangladesh', 'London, UK', 'Chittagong, Bangladesh'];
  const empTypes = ['FULL_TIME', 'FULL_TIME', 'PART_TIME', 'CONTRACT'];
  const expLevels = ['ENTRY', 'MID', 'SENIOR', 'LEAD'];
  const categories = ['Engineering', 'Product', 'Design', 'Marketing', 'Data'];

  const jobs = [];
  for (let i = 0; i < 24; i++) {
    const company = companies[i % companies.length];
    const status = Math.random() < 0.9 ? 'APPROVED' : 'PENDING';
    
    const job = await prisma.job.create({
      data: {
        title: `${expLevels[i % expLevels.length] === 'ENTRY' ? 'Junior' : (expLevels[i % expLevels.length] === 'SENIOR' || expLevels[i % expLevels.length] === 'LEAD' ? 'Senior' : '')} ${titles[i % titles.length]}`.trim(),
        description: `This is an exciting opportunity to join ${company.name} as a key member of our team. You will be responsible for driving impact and delivering high-quality results. We offer a great culture and room for growth.`,
        category: categories[i % categories.length],
        location: locations[i % locations.length],
        employmentType: empTypes[i % empTypes.length],
        experienceLevel: expLevels[i % expLevels.length],
        salaryMin: 60000 + (i * 5000),
        salaryMax: 100000 + (i * 7000),
        compensationNote: i % 5 === 0 ? 'Negotiable based on experience' : undefined,
        workMode: i % 3 === 0 ? 'REMOTE' : (i % 3 === 1 ? 'HYBRID' : 'ON_SITE'),
        vacancyCount: (i % 3) + 1,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Python', 'AWS'].slice(0, (i % 4) + 2),
        requirements: '• 3+ years of relevant experience\n• Strong communication skills\n• Problem-solving mindset and ability to work independently',
        status: status,
        companyId: company.id,
        postedById: recruiters[i % recruiters.length].id,
      },
    });
    jobs.push(job);
  }

  console.log(`Successfully created ${jobs.length} jobs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
