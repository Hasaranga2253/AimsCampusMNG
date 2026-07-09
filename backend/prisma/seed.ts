import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient, RoleName } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured for seeding.')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const roles: Array<{ name: RoleName; label: string }> = [
  { name: RoleName.STUDENT, label: 'Student' },
  { name: RoleName.LECTURER, label: 'Lecturer' },
  { name: RoleName.INTERNAL_MODERATOR, label: 'Internal Moderator' },
  { name: RoleName.PROGRAMME_COORDINATOR, label: 'Programme Coordinator' },
  { name: RoleName.ADMIN, label: 'Administrator' },
]

async function main(): Promise<void> {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { label: role.label },
      create: role,
    })
  }
}

void main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Role seeding failed.'
    throw new Error(message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
