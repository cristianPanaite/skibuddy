import { Role } from '@prisma/client';
import { currentUser, auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getSessionUser() {
  const { userId } = auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user) return user;
  return prisma.user.create({ data: { clerkId: userId } });
}

export async function requireSessionUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error('Unauthorized');
  }
  return sessionUser;
}

export async function requireAdmin() {
  const sessionUser = await requireSessionUser();
  if (sessionUser.role !== Role.ADMIN) {
    throw new Error('Forbidden');
  }
  return sessionUser;
}

export async function getClerkUser() {
  return currentUser();
}
