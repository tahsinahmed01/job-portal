import { prisma } from './lib/prisma.js';

async function verify() {
  const userCount = await prisma.user.count();
  const companyCount = await prisma.company.count();
  const jobCount = await prisma.job.count();
  const applicationCount = await prisma.application.count();

  console.log(`Database Verification Results:`);
  console.log(`------------------------------`);
  console.log(`Users created:        ${userCount}`);
  console.log(`Companies created:    ${companyCount}`);
  console.log(`Jobs created:         ${jobCount}`);
  console.log(`Applications created: ${applicationCount}`);
}

verify()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
