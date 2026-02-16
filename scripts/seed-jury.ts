import { prisma } from "../lib/db";
import { hashPassword } from "../lib/auth";

async function seedJury() {
  const email = "jury@wakanexus.com";
  const password = "jury2024";

  // Check if jury user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Jury user already exists:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    return;
  }

  // Create jury user
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: "Jury Member",
      email,
      password: hashedPassword,
      role: "jury",
      juryProfile: {
        create: {
          title: "Senior Art Curator",
          bio: "Experienced art curator with 15+ years in contemporary art",
          active: true,
        },
      },
    },
  });

  console.log("Jury user created successfully!");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

seedJury()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
