import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const userId = clerkUser.id;
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";

  const user = await prisma.user.upsert({
    where: { email }, // assuming email is unique
    update: {
      clerkId: userId,
    },
    create: {
      email,
      clerkId: userId,
    },
  });

  return user;
}
