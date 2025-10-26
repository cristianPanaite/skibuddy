import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.resort.createMany({
    data: [
      { slug: 'poiana-brasov', name: 'Poiana Brașov' },
      { slug: 'sinaia', name: 'Sinaia' }
    ],
    skipDuplicates: true
  });

  const resortRecords = await prisma.resort.findMany();
  const resortBySlug = Object.fromEntries(resortRecords.map((r) => [r.slug, r.id]));

  await prisma.tag.createMany({
    data: [
      { label: 'Beginner friendly' },
      { label: 'Family lessons' },
      { label: 'Freestyle' },
      { label: 'Race training' }
    ],
    skipDuplicates: true
  });

  const tagRecords = await prisma.tag.findMany();
  const tagByLabel = Object.fromEntries(tagRecords.map((t) => [t.label, t.id]));

  const instructors = [
    {
      name: 'Andrei Ionescu',
      languages: ['RO', 'EN'],
      pricePerHourCents: 2500,
      whatsapp: '40712345678',
      instagram: 'ski.with.andrei',
      bio: 'Patient instructor specialized in helping adults tackle their first red runs.',
      resortSlug: 'poiana-brasov',
      tags: ['Beginner friendly', 'Family lessons']
    },
    {
      name: 'Maria Dumitru',
      languages: ['RO', 'EN', 'FR'],
      pricePerHourCents: 3000,
      whatsapp: '33698765432',
      instagram: 'maria.ski',
      bio: 'Former national racer bringing fast progress to intermediate skiers.',
      resortSlug: 'poiana-brasov',
      tags: ['Race training']
    },
    {
      name: 'Lukas Schneider',
      languages: ['DE', 'EN'],
      pricePerHourCents: 2800,
      whatsapp: '4915123456789',
      instagram: null,
      bio: 'German-speaking families love Lukas’ structured lessons.',
      resortSlug: 'poiana-brasov',
      tags: ['Family lessons']
    },
    {
      name: 'Ioana Petrescu',
      languages: ['RO', 'EN', 'IT'],
      pricePerHourCents: 3200,
      whatsapp: '40798765432',
      instagram: 'ioana.skis',
      bio: 'Freestyle specialist ready to teach grabs and spins safely.',
      resortSlug: 'sinaia',
      tags: ['Freestyle']
    },
    {
      name: 'David Pop',
      languages: ['RO', 'EN', 'HU'],
      pricePerHourCents: 2200,
      whatsapp: '40766554433',
      instagram: null,
      bio: 'Focuses on kids and family groups looking for fun mornings on the slopes.',
      resortSlug: 'poiana-brasov',
      tags: ['Beginner friendly', 'Family lessons']
    }
  ];

  for (const [index, instructor] of instructors.entries()) {
    const user = await prisma.user.upsert({
      where: { clerkId: `seed-user-${index}` },
      update: {},
      create: {
        clerkId: `seed-user-${index}`,
        role: Role.USER
      }
    });

    const createdInstructor = await prisma.instructor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: instructor.name,
        languages: instructor.languages,
        pricePerHourCents: instructor.pricePerHourCents,
        whatsapp: instructor.whatsapp,
        instagram: instructor.instagram ?? undefined,
        bio: instructor.bio,
        resortId: resortBySlug[instructor.resortSlug],
        featured: index < 2,
        verified: index < 3,
        photoUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=640&q=80'
      }
    });

    if (instructor.tags.length) {
      await prisma.instructorTag.createMany({
        data: instructor.tags.map((label) => ({
          instructorId: createdInstructor.id,
          tagId: tagByLabel[label]
        })),
        skipDuplicates: true
      });
    }
  }

  console.log('Database seeded');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
