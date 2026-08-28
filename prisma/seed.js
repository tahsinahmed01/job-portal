import { prisma } from '../lib/prisma.js';


// Let's use static arrays to guarantee idempotency and no extra dependencies.

async function main() {
  console.log('Seeding database with expanded dataset...');
  
  // Clean up existing data
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (5 Recruiters, 3 Candidates)
  console.log('Creating users...');
  const roles = ['RECRUITER', 'RECRUITER', 'RECRUITER', 'RECRUITER', 'RECRUITER', 'CANDIDATE', 'CANDIDATE', 'CANDIDATE'];
  const users = await Promise.all(
    roles.map((role, i) =>
      prisma.user.create({
        data: {
          clerkId: `seed-user-${i + 1}`,
          email: `${role.toLowerCase()}${i + 1}@example.com`,
          name: `${role === 'RECRUITER' ? 'Recruiter' : 'Candidate'} ${i + 1}`,
          role: role,
        },
      })
    )
  );
  
  const recruiters = users.filter((u) => u.role === 'RECRUITER');
  const candidates = users.filter((u) => u.role === 'CANDIDATE');

  // Create Companies (6 companies)
  console.log('Creating companies...');
  const companyData = [
    { name: 'TechFlow', industry: 'Software', logoUrl: 'https://ui-avatars.com/api/?name=TechFlow&background=0D8ABC&color=fff', website: 'https://vercel.com' },
    { name: 'DataSync', industry: 'Data Analytics', logoUrl: 'https://ui-avatars.com/api/?name=DataSync&background=F7931A&color=fff', website: 'https://datadoghq.com' },
    { name: 'CloudScale', industry: 'Cloud Computing', logoUrl: 'https://ui-avatars.com/api/?name=CloudScale&background=10A37F&color=fff', website: 'https://aws.amazon.com' },
    { name: 'FinTrust', industry: 'FinTech', logoUrl: 'https://ui-avatars.com/api/?name=FinTrust&background=635BFF&color=fff', website: 'https://stripe.com' },
    { name: 'HealthPlus', industry: 'Healthcare', logoUrl: 'https://ui-avatars.com/api/?name=HealthPlus&background=FF5A5F&color=fff', website: 'https://hioscar.com' },
    { name: 'EduSmart', industry: 'EdTech', logoUrl: 'https://ui-avatars.com/api/?name=EduSmart&background=0056D2&color=fff', website: 'https://coursera.org' },
  ];

  const companies = await Promise.all(
    companyData.map((c, i) =>
      prisma.company.create({
        data: {
          name: c.name,
          industry: c.industry,
          description: `Leading company in the ${c.industry} space building awesome products.`,
          logoUrl: c.logoUrl,
          website: c.website,
          ownerId: recruiters[i % recruiters.length].id, // assign round-robin to recruiters
        },
      })
    )
  );

  // Create Jobs (24 jobs, 4 per company)
  console.log('Creating jobs...');
  const titles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer', 'Marketing Manager'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK', 'Berlin, Germany'];
  const empTypes = ['FULL_TIME', 'FULL_TIME', 'PART_TIME', 'CONTRACT'];
  const expLevels = ['ENTRY', 'MID', 'SENIOR', 'LEAD'];
  const categories = ['Engineering', 'Product', 'Design', 'Marketing', 'Data'];

  const jobs = [];
  for (let i = 0; i < 24; i++) {
    const company = companies[i % companies.length];
    const status = i % 8 === 0 ? 'DRAFT' : (i % 9 === 0 ? 'CLOSED' : 'PUBLISHED'); // Mostly published
    
    const job = await prisma.job.create({
      data: {
        title: `${expLevels[i % expLevels.length] === 'ENTRY' ? 'Junior' : (expLevels[i % expLevels.length] === 'SENIOR' || expLevels[i % expLevels.length] === 'LEAD' ? 'Senior' : '')} ${titles[i % titles.length]}`.trim(),
        description: `This is an exciting opportunity to join ${company.name} as a key member of our team. You will be responsible for building highly scalable systems and making a huge impact.`,
        category: categories[i % categories.length],
        location: locations[i % locations.length],
        employmentType: empTypes[i % empTypes.length],
        experienceLevel: expLevels[i % expLevels.length],
        salaryMin: 60000 + (i * 5000),
        salaryMax: 100000 + (i * 7000),
        compensationNote: i % 5 === 0 ? 'Negotiable based on experience' : undefined,
        workMode: i % 3 === 0 ? 'REMOTE' : (i % 3 === 1 ? 'HYBRID' : 'ON_SITE'),
        vacancyCount: (i % 3) + 1,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'].slice(0, (i % 4) + 1),
        requirements: '• 3+ years of experience\n• Strong communication skills\n• Problem-solving mindset',
        status: status,
        companyId: company.id,
      },
    });
    jobs.push(job);
  }

  // Create Applications (12 applications)
  console.log('Creating applications...');
  const appStatuses = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'];
  
  for (let i = 0; i < 12; i++) {
    const candidate = candidates[i % candidates.length];
    const job = jobs[i * 2]; // apply to every other job
    
    await prisma.application.create({
      data: {
        userId: candidate.id,
        jobId: job.id,
        resumeLink: `https://example.com/resume-${candidate.id}.pdf`,
        coverLetter: `I am incredibly passionate about what you do at ${jobs[i * 2].companyId} and would love to join the team.`,
        status: appStatuses[i % appStatuses.length],
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
