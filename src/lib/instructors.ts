import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export interface InstructorFilters {
  resort?: string;
  maxPrice?: number;
  language?: string;
  q?: string;
  page?: number;
  perPage?: number;
}

export async function listInstructors(filters: InstructorFilters = {}) {
  const {
    resort,
    maxPrice,
    language,
    q,
    page = 1,
    perPage = 12
  } = filters;

  const where: Prisma.InstructorWhereInput = {
    active: true,
    ...(resort
      ? {
          resort: {
            slug: resort
          }
        }
      : {}),
    ...(typeof maxPrice === 'number' && !Number.isNaN(maxPrice)
      ? {
          pricePerHourCents: {
            lte: maxPrice * 100
          }
        }
      : {}),
    ...(language ? { languages: { has: language } } : {}),
    ...(q
      ? {
          name: {
            contains: q,
            mode: 'insensitive'
          }
        }
      : {})
  };

  const [total, records] = await Promise.all([
    prisma.instructor.count({ where }),
    prisma.instructor.findMany({
      where,
      include: {
        resort: true
      },
      orderBy: [
        {
          featured: 'desc'
        },
        {
          pricePerHourCents: 'asc'
        }
      ],
      skip: (page - 1) * perPage,
      take: perPage
    })
  ]);

  const formatted = records.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    photoUrl: instructor.photoUrl,
    languages: instructor.languages,
    pricePerHourCents: instructor.pricePerHourCents,
    whatsapp: instructor.whatsapp,
    instagram: instructor.instagram,
    featured: instructor.featured,
    verified: instructor.verified,
    resort: {
      id: instructor.resort.id,
      name: instructor.resort.name,
      slug: instructor.resort.slug
    }
  }));

  return { total, records: formatted };
}

export async function getInstructorDetail(id: string) {
  const instructor = await prisma.instructor.findUnique({
    where: { id },
    include: {
      resort: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!instructor) return null;

  return {
    id: instructor.id,
    name: instructor.name,
    photoUrl: instructor.photoUrl,
    languages: instructor.languages,
    pricePerHourCents: instructor.pricePerHourCents,
    whatsapp: instructor.whatsapp,
    instagram: instructor.instagram,
    featured: instructor.featured,
    verified: instructor.verified,
    active: instructor.active,
    bio: instructor.bio,
    resort: {
      id: instructor.resort.id,
      name: instructor.resort.name,
      slug: instructor.resort.slug
    },
    tags: instructor.tags.map((relation) => relation.tag.label)
  };
}

export async function getResorts() {
  return prisma.resort.findMany({ orderBy: { name: 'asc' } });
}

export async function getTags() {
  return prisma.tag.findMany({ orderBy: { label: 'asc' } });
}

export async function getAvailableLanguages() {
  const languages = await prisma.instructor.findMany({
    where: { active: true },
    select: { languages: true }
  });
  const unique = new Set<string>();
  languages.forEach((row) => row.languages.forEach((lang) => unique.add(lang)));
  return Array.from(unique).sort();
}

export async function upsertInstructorForUser(userId: string, data: {
  name: string;
  photoUrl?: string | null;
  languages: string[];
  pricePerHourCents: number;
  whatsapp?: string | null;
  instagram?: string | null;
  bio?: string | null;
  resortId: string;
  tags: string[];
}) {
  const instructor = await prisma.instructor.upsert({
    where: { userId },
    create: {
      userId,
      ...data
    },
    update: {
      ...data
    }
  });

  await prisma.instructorTag.deleteMany({ where: { instructorId: instructor.id } });
  if (data.tags.length) {
    const tags = await prisma.tag.findMany({ where: { label: { in: data.tags } } });
    await prisma.instructorTag.createMany({
      data: tags.map((tag) => ({ instructorId: instructor.id, tagId: tag.id })),
      skipDuplicates: true
    });
  }

  return instructor;
}

export async function toggleInstructorFlag(
  instructorId: string,
  flag: 'featured' | 'verified',
  value: boolean
) {
  return prisma.instructor.update({
    where: { id: instructorId },
    data: { [flag]: value }
  });
}

export async function getInstructorForUser(userId: string) {
  return prisma.instructor.findUnique({
    where: { userId },
    include: {
      tags: {
        include: { tag: true }
      },
      resort: true
    }
  });
}

export async function listAllInstructors() {
  return prisma.instructor.findMany({
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' }
    ],
    include: {
      resort: true
    }
  });
}
