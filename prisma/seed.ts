import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crimesafety.com' },
    update: {},
    create: {
      email: 'admin@crimesafety.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create police user
  const policePassword = await bcrypt.hash('Police@123456', 12);
  const police = await prisma.user.upsert({
    where: { email: 'police@crimesafety.com' },
    update: {},
    create: {
      email: 'police@crimesafety.com',
      name: 'Police Department',
      password: policePassword,
      role: 'POLICE',
      isActive: true,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Police user created: ${police.email}`);

  // ✅ Create sample police stations (using Prisma model instead of raw SQL)
  const policeStations = [
    {
      id: 'central-police-station',
      name: 'Central Police Station',
      email: 'central@police.gov',
      phone: '+1-555-0100',
      latitude: 28.6139,
      longitude: 77.2090,
      address: '123 Main Street, Downtown',
      jurisdiction: 'Central District',
    },
    {
      id: 'north-district-police-station',
      name: 'North District Police Station',
      email: 'north@police.gov',
      phone: '+1-555-0101',
      latitude: 28.6200,
      longitude: 77.2200,
      address: '456 North Avenue',
      jurisdiction: 'North District',
    },
    {
      id: 'south-district-police-station',
      name: 'South District Police Station',
      email: 'south@police.gov',
      phone: '+1-555-0102',
      latitude: 28.6000,
      longitude: 77.2000,
      address: '789 South Road',
      jurisdiction: 'South District',
    },
    {
      id: 'east-division-police-station',
      name: 'East Division',
      email: 'east@police.gov',
      phone: '+1-555-0103',
      latitude: 28.6250,
      longitude: 77.2150,
      address: '321 East Blvd',
      jurisdiction: 'East District',
    },
    {
      id: 'west-precinct-police-station',
      name: 'West Precinct',
      email: 'west@police.gov',
      phone: '+1-555-0104',
      latitude: 28.6050,
      longitude: 77.1950,
      address: '654 West Street',
      jurisdiction: 'West District',
    },
  ];

  for (const station of policeStations) {
    await prisma.policeStation.upsert({
      where: { id: station.id },
      update: {},
      create: {
        id: station.id,
        name: station.name,
        email: station.email,
        phone: station.phone,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
        jurisdiction: station.jurisdiction,
      },
    });
  }
  console.log(`✅ Police stations created: ${policeStations.length}`);

  // Create sample reports
  const sampleReports = [
    {
      title: 'Suspicious Activity Near Mall',
      description: 'Group of individuals attempting to break into vehicles in parking lot',
      category: 'THEFT',
      severity: 'HIGH',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'City Mall, Downtown',
      userId: police.id,
      aiVerified: true,
      aiConfidence: 0.92,
      aiAnalysis: 'High probability of criminal activity. Multiple suspects coordinated behavior.',
      status: 'INVESTIGATING',
      date: new Date(),
      isAnonymous: false,
      images: [],
    },
    {
      title: 'Online Banking Scam Alert',
      description: 'Received fraudulent call asking for OTP and bank details',
      category: 'FRAUD',
      severity: 'MEDIUM',
      latitude: 28.6200,
      longitude: 77.2200,
      address: 'North Residential Area',
      userId: police.id,
      aiVerified: true,
      aiConfidence: 0.88,
      aiAnalysis: 'Typical phishing attempt pattern detected.',
      status: 'VERIFIED',
      date: new Date(),
      isAnonymous: false,
      images: [],
    },
    {
      title: 'Vandalism at Public Park',
      description: 'Graffiti and property damage at children\'s playground',
      category: 'VANDALISM',
      severity: 'LOW',
      latitude: 28.6000,
      longitude: 77.2000,
      address: 'Central Park',
      userId: admin.id,
      aiVerified: false,
      aiConfidence: 0.65,
      aiAnalysis: 'Report needs additional verification. Missing time details.',
      status: 'PENDING',
      date: new Date(),
      isAnonymous: false,
      images: [],
    },
  ];

  for (const report of sampleReports) {
    await prisma.report.create({
      data: report,
    });
  }
  console.log(`✅ Sample reports created: ${sampleReports.length}`);

  // ✅ Create notification settings (using create instead of raw SQL)
  const users = await prisma.user.findMany();
  for (const user of users) {
    // Check if notification settings already exist
    const existingSettings = await prisma.notificationSettings.findUnique({
      where: { userId: user.id },
    });
    
    if (!existingSettings) {
      await prisma.notificationSettings.create({
        data: {
          userId: user.id,
          emailNotifications: true,
          pushNotifications: true,
          reportUpdates: true,
          safetyAlerts: true,
        },
      });
    }
  }
  console.log(`✅ Notification settings created for ${users.length} users`);

  // Create sample chat messages
  const chatMessages = [
    {
      userId: admin.id,
      content: 'How do I report a crime anonymously?',
      isAI: false,
      sessionId: 'sample_session_1',
    },
    {
      userId: admin.id,
      content: 'You can report anonymously by checking the "Report Anonymously" option in our report form. Your identity will be completely protected.',
      isAI: true,
      sessionId: 'sample_session_1',
    },
  ];

  for (const message of chatMessages) {
    await prisma.chatMessage.create({
      data: message,
    });
  }
  console.log(`✅ Sample chat messages created`);

  // Create system notification
  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: 'Welcome to CrimeSafety!',
      message: 'Thank you for joining our community safety platform.',
      type: 'SYSTEM',
    },
  });

  // ✅ Create activity log
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: 'SEED_DATA',
      details: 'Database seeded successfully',
      ipAddress: 'localhost',
      userAgent: 'seed-script',
    },
  });
  console.log(`✅ Activity log created`);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });