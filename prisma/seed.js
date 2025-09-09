const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      clerkId: "clerk_user_1",
      email: "admin@example.com",
      name: "Admin User",
    },
  })

  // Create sample queues
  const queue1 = await prisma.queue.upsert({
    where: { id: "queue_1" },
    update: {},
    create: {
      id: "queue_1",
      name: "Coffee Shop Queue",
      location: "Downtown Branch",
      category: "Food & Drink",
      description: "Join our queue to order your favorite coffee and pastries.",
      ownerId: user1.id,
      customFields: {
        create: [
          {
            label: "Full Name",
            type: "TEXT",
            required: true,
            order: 0,
          },
          {
            label: "Email Address",
            type: "EMAIL",
            required: true,
            order: 1,
          },
          {
            label: "Phone Number",
            type: "TEL",
            required: false,
            order: 2,
          },
          {
            label: "Group Size",
            type: "NUMBER",
            required: true,
            order: 3,
          },
          {
            label: "Special Requests",
            type: "TEXTAREA",
            required: false,
            order: 4,
          },
        ],
      },
    },
  })

  const queue2 = await prisma.queue.upsert({
    where: { id: "queue_2" },
    update: {},
    create: {
      id: "queue_2",
      name: "Bank Service",
      location: "Main Branch",
      category: "Financial",
      description: "Queue for banking services and consultations.",
      ownerId: user1.id,
      customFields: {
        create: [
          {
            label: "Full Name",
            type: "TEXT",
            required: true,
            order: 0,
          },
          {
            label: "Account Number",
            type: "TEXT",
            required: true,
            order: 1,
          },
          {
            label: "Service Type",
            type: "SELECT",
            required: true,
            options: ["Account Opening", "Loan Application", "General Inquiry"],
            order: 2,
          },
        ],
      },
    },
  })

  // Create sample queue entries
  await prisma.queueEntry.createMany({
    data: [
      {
        queueId: queue1.id,
        position: 1,
        userData: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          groupSize: 2,
          notes: "Prefers window seating",
        },
      },
      {
        queueId: queue1.id,
        position: 2,
        userData: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1234567891",
          groupSize: 1,
          notes: "",
        },
      },
      {
        queueId: queue2.id,
        position: 1,
        userData: {
          name: "Bob Johnson",
          email: "bob@example.com",
          accountNumber: "123456789",
          serviceType: "Loan Application",
        },
      },
    ],
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
