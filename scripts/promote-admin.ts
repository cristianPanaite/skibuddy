import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function promote(clerkId: string) {
  if (!clerkId) {
    throw new Error('Please pass the Clerk user ID as the first argument.');
  }

  const user = await prisma.user.update({
    where: { clerkId },
    data: { role: Role.ADMIN }
  });

  console.log(`User ${user.clerkId} promoted to ADMIN`);
}

promote(process.argv[2] ?? '')
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
