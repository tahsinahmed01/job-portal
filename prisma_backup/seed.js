const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data.');

  // Create Users
  const users = await Promise.all([
    prisma.user.create({ data: { clerkId: 'seed-user-1', email: 'alice@example.com', name: 'Alice Recruiter', role: 'RECRUITER' } }),
    prisma.user.create({ data: { clerkId: 'seed-user-2', email: 'bob@example.com', name: 'Bob Recruiter', role: 'RECRUITER' } }),
    prisma.user.create({ data: { clerkId: 'seed-user-3', email: 'charlie@example.com', name: 'Charlie Candidate', role: 'CANDIDATE' } }),
    prisma.user.create({ data: { clerkId: 'seed-user-4', email: 'diana@example.com', name: 'Diana Candidate', role: 'CANDIDATE' } }),
    prisma.user.create({ data: { clerkId: 'seed-user-5', email: 'eve@example.com', name: 'Eve Candidate', role: 'CANDIDATE' } }),
    prisma.user.create({ data: { clerkId: 'seed-user-6', email: 'frank@example.com', name: 'Frank Candidate', role: 'CANDIDATE' } }),
  ]);
  console.log('Created users.');

  // Create Companies
  const companies = await Promise.all([
    prisma.company.create({ data: { name: 'TechCorp', logoUrl: 'https://placehold.co/100', description: 'Leading tech solutions.', industry: 'Technology', website: 'https://techcorp.example.com', ownerId: users[0].id } }),
    prisma.company.create({ data: { name: 'DataFlow', logoUrl: 'https://placehold.co/100', description: 'Data streaming and analytics.', industry: 'Data Science', website: 'https://dataflow.example.com', ownerId: users[0].id } }),
    prisma.company.create({ data: { name: 'Creative Solutions', logoUrl: 'https://placehold.co/100', description: 'Design and UX studio.', industry: 'Design', website: 'https://creativesolutions.example.com', ownerId: users[1].id } }),
    prisma.company.create({ data: { name: 'WebWorks', logoUrl: 'https://placehold.co/100', description: 'Full stack web agency.', industry: 'Software', website: 'https://webworks.example.com', ownerId: users[1].id } }),
    prisma.company.create({ data: { name: 'CloudNet', logoUrl: 'https://placehold.co/100', description: 'Cloud infrastructure provider.', industry: 'Cloud', website: 'https://cloudnet.example.com', ownerId: users[1].id } }),
  ]);
  console.log('Created companies.');

  // Create Jobs
  const jobsData = [
    { title: 'Frontend Developer', description: 'Build cool UIs.', category: 'Engineering', location: 'Remote', salaryMin: 90000, salaryMax: 120000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[0].id },
    { title: 'Backend Engineer', description: 'Design scalable APIs.', category: 'Engineering', location: 'New York, NY', salaryMin: 110000, salaryMax: 140000, employmentType: 'FULL_TIME', experienceLevel: 'SENIOR', status: 'PUBLISHED', companyId: companies[1].id },
    { title: 'UI/UX Designer', description: 'Create beautiful user experiences.', category: 'Design', location: 'San Francisco, CA', salaryMin: 100000, salaryMax: 130000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[2].id },
    { title: 'Full Stack Developer', description: 'Work across the entire stack.', category: 'Engineering', location: 'Austin, TX', salaryMin: 95000, salaryMax: 125000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[3].id },
    { title: 'DevOps Engineer', description: 'Manage our infrastructure.', category: 'Engineering', location: 'Seattle, WA', salaryMin: 120000, salaryMax: 150000, employmentType: 'FULL_TIME', experienceLevel: 'SENIOR', status: 'PUBLISHED', companyId: companies[4].id },
    { title: 'Product Manager', description: 'Lead product strategy.', category: 'Product', location: 'Chicago, IL', salaryMin: 105000, salaryMax: 135000, employmentType: 'FULL_TIME', experienceLevel: 'LEAD', status: 'PUBLISHED', companyId: companies[0].id },
    { title: 'Junior Developer', description: 'Learn and grow with us.', category: 'Engineering', location: 'Remote', salaryMin: 60000, salaryMax: 80000, employmentType: 'FULL_TIME', experienceLevel: 'ENTRY', status: 'PUBLISHED', companyId: companies[1].id },
    { title: 'Contract Designer', description: 'Help with our rebrand.', category: 'Design', location: 'Remote', salaryMin: 50000, salaryMax: 80000, employmentType: 'CONTRACT', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[2].id },
    { title: 'Marketing Intern', description: 'Assist with marketing campaigns.', category: 'Marketing', location: 'New York, NY', salaryMin: 30000, salaryMax: 40000, employmentType: 'INTERNSHIP', experienceLevel: 'ENTRY', status: 'DRAFT', companyId: companies[3].id },
    { title: 'Data Scientist', description: 'Analyze complex datasets.', category: 'Data Science', location: 'San Francisco, CA', salaryMin: 130000, salaryMax: 160000, employmentType: 'FULL_TIME', experienceLevel: 'SENIOR', status: 'PUBLISHED', companyId: companies[1].id },
    { title: 'Sales Executive', description: 'Drive revenue growth.', category: 'Sales', location: 'Austin, TX', salaryMin: 80000, salaryMax: 150000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[0].id },
    { title: 'Customer Support Rep', description: 'Help our users succeed.', category: 'Support', location: 'Remote', salaryMin: 40000, salaryMax: 60000, employmentType: 'FULL_TIME', experienceLevel: 'ENTRY', status: 'PUBLISHED', companyId: companies[4].id },
    { title: 'Senior Go Developer', description: 'Build high performance microservices.', category: 'Engineering', location: 'Remote', salaryMin: 140000, salaryMax: 180000, employmentType: 'FULL_TIME', experienceLevel: 'SENIOR', status: 'CLOSED', companyId: companies[4].id },
    { title: 'HR Manager', description: 'Manage employee relations.', category: 'HR', location: 'Chicago, IL', salaryMin: 90000, salaryMax: 110000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[3].id },
    { title: 'Mobile App Developer', description: 'Build our iOS app.', category: 'Engineering', location: 'New York, NY', salaryMin: 110000, salaryMax: 140000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[0].id },
    { title: 'SEO Specialist', description: 'Improve our search rankings.', category: 'Marketing', location: 'Remote', salaryMin: 70000, salaryMax: 90000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[2].id },
    { title: 'QA Tester', description: 'Ensure software quality.', category: 'Engineering', location: 'Seattle, WA', salaryMin: 65000, salaryMax: 85000, employmentType: 'FULL_TIME', experienceLevel: 'ENTRY', status: 'PUBLISHED', companyId: companies[1].id },
    { title: 'Finance Analyst', description: 'Financial planning and analysis.', category: 'Finance', location: 'Austin, TX', salaryMin: 80000, salaryMax: 100000, employmentType: 'FULL_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[4].id },
    { title: 'Lead Architect', description: 'Design system architecture.', category: 'Engineering', location: 'San Francisco, CA', salaryMin: 160000, salaryMax: 200000, employmentType: 'FULL_TIME', experienceLevel: 'LEAD', status: 'PUBLISHED', companyId: companies[0].id },
    { title: 'Content Writer', description: 'Write engaging blog posts.', category: 'Marketing', location: 'Remote', salaryMin: 50000, salaryMax: 70000, employmentType: 'PART_TIME', experienceLevel: 'MID', status: 'PUBLISHED', companyId: companies[3].id },
  ];

  const jobs = await Promise.all(jobsData.map(data => prisma.job.create({ data })));
  console.log('Created jobs.');

  // Create Applications
  const applicationsData = [
    { userId: users[2].id, jobId: jobs[0].id, status: 'PENDING', resumeLink: 'https://example.com/resume1.pdf' },
    { userId: users[3].id, jobId: jobs[0].id, status: 'REVIEWED', resumeLink: 'https://example.com/resume2.pdf' },
    { userId: users[4].id, jobId: jobs[1].id, status: 'SHORTLISTED', resumeLink: 'https://example.com/resume3.pdf' },
    { userId: users[5].id, jobId: jobs[2].id, status: 'REJECTED', resumeLink: 'https://example.com/resume4.pdf' },
    { userId: users[2].id, jobId: jobs[3].id, status: 'HIRED', resumeLink: 'https://example.com/resume5.pdf' },
    { userId: users[3].id, jobId: jobs[4].id, status: 'PENDING', resumeLink: 'https://example.com/resume6.pdf' },
    { userId: users[4].id, jobId: jobs[5].id, status: 'REVIEWED', resumeLink: 'https://example.com/resume7.pdf' },
    { userId: users[5].id, jobId: jobs[6].id, status: 'PENDING', resumeLink: 'https://example.com/resume8.pdf' },
    { userId: users[2].id, jobId: jobs[9].id, status: 'SHORTLISTED', resumeLink: 'https://example.com/resume9.pdf' },
    { userId: users[3].id, jobId: jobs[10].id, status: 'REJECTED', resumeLink: 'https://example.com/resume10.pdf' },
  ];

  await Promise.all(applicationsData.map(data => prisma.application.create({ data })));
  console.log('Created applications.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
