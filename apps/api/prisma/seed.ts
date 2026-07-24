import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { encrypt } from "../src/lib/crypto";

const prisma = new PrismaClient();

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function pickMany<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

const DEPARTMENTS = ["Engineering", "Design", "Product", "QA", "Marketing", "Sales", "Operations"] as const;

const EMPLOYEES = [
  { name: "Alex Morgan", email: "demo@pulse.dev", role: "super_admin", department: "Operations", jobTitle: "Head of Operations", address: "412 Harbor View Dr, Apt 5B, Seattle, WA 98101" },
  { name: "Ava Bennett", email: "ava.bennett@pulse.dev", role: "manager", department: "Engineering", jobTitle: "Engineering Manager", address: "88 Redwood Ave, Portland, OR 97201" },
  { name: "Marcus Chen", email: "marcus.chen@pulse.dev", role: "member", department: "Engineering", jobTitle: "Senior Backend Engineer", address: "215 Lakeview Terrace, Austin, TX 78701" },
  { name: "Priya Nair", email: "priya.nair@pulse.dev", role: "member", department: "Engineering", jobTitle: "Frontend Engineer", address: "60 Elm Street, Unit 12, Boston, MA 02116" },
  { name: "Jonas Weber", email: "jonas.weber@pulse.dev", role: "member", department: "Engineering", jobTitle: "DevOps Engineer", address: "9 Birchwood Lane, Denver, CO 80202" },
  { name: "Elena Torres", email: "elena.torres@pulse.dev", role: "manager", department: "Design", jobTitle: "Lead Product Designer", address: "347 Sunset Blvd, Los Angeles, CA 90026" },
  { name: "Liam O'Connor", email: "liam.oconnor@pulse.dev", role: "member", department: "Design", jobTitle: "UI/UX Designer", address: "22 Clarence Street, Chicago, IL 60602" },
  { name: "Sophia Marsh", email: "sophia.marsh@pulse.dev", role: "manager", department: "Product", jobTitle: "Product Manager", address: "1500 Fifth Ave, Apt 9C, New York, NY 10029" },
  { name: "Noah Whitfield", email: "noah.whitfield@pulse.dev", role: "member", department: "Product", jobTitle: "Product Analyst", address: "76 Maple Grove Rd, Raleigh, NC 27601" },
  { name: "Grace Kim", email: "grace.kim@pulse.dev", role: "manager", department: "QA", jobTitle: "QA Lead", address: "310 Cedar Court, San Jose, CA 95110" },
  { name: "Daniel Osei", email: "daniel.osei@pulse.dev", role: "member", department: "QA", jobTitle: "QA Engineer", address: "48 Willow Way, Atlanta, GA 30301" },
  { name: "Isabella Rossi", email: "isabella.rossi@pulse.dev", role: "manager", department: "Marketing", jobTitle: "Marketing Manager", address: "1200 Ocean Drive, Miami, FL 33139" },
  { name: "Ethan Brooks", email: "ethan.brooks@pulse.dev", role: "member", department: "Sales", jobTitle: "Account Executive", address: "5 Highland Park, Nashville, TN 37201" },
] as const;

const CLIENTS = [
  { name: "Meridian Retail Group", company: "Meridian Retail Group", email: "partnerships@meridianretail.com", address: "800 Commerce Plaza, Suite 400, Chicago, IL 60654" },
  { name: "Northbridge Financial", company: "Northbridge Financial", email: "vendors@northbridgefin.com", address: "150 Wall Street, 22nd Floor, New York, NY 10005" },
  { name: "Solstice Health Partners", company: "Solstice Health Partners", email: "it@solsticehealth.org", address: "3300 Medical Center Dr, Houston, TX 77030" },
  { name: "Cobalt Logistics", company: "Cobalt Logistics", email: "ops@cobaltlogistics.com", address: "42 Harbor Freight Rd, Long Beach, CA 90802" },
  { name: "Fernwood Media", company: "Fernwood Media", email: "tech@fernwoodmedia.com", address: "901 Sunset Studios Way, Burbank, CA 91505" },
  { name: "Ashcroft & Vale Law", company: "Ashcroft & Vale Law", email: "admin@ashcroftvale.com", address: "10 Federal Plaza, Suite 1100, Boston, MA 02110" },
  { name: "Brightline Energy", company: "Brightline Energy", email: "digital@brightlineenergy.com", address: "500 Powerhouse Ave, Tulsa, OK 74103" },
  { name: "Kestrel Aerospace", company: "Kestrel Aerospace", email: "systems@kestrelaero.com", address: "77 Airfield Pkwy, Wichita, KS 67209" },
] as const;

const TAGS = [
  "frontend",
  "backend",
  "design",
  "urgent",
  "client-facing",
  "infra",
  "research",
  "mobile",
  "analytics",
  "compliance",
] as const;

const PROJECT_SUFFIXES = [
  "Q3 Loyalty Program Redesign",
  "Fraud Detection Dashboard",
  "Patient Intake Portal Revamp",
  "Fleet Tracking API Integration",
  "Content Recommendation Engine",
  "Contract Management Portal",
  "Smart Grid Monitoring Dashboard",
  "Flight Ops Analytics Suite",
  "Design System 2.0 Rollout",
  "Mobile App Performance Overhaul",
  "Customer Data Platform Migration",
  "Onboarding Flow A/B Test",
  "Internal Analytics Warehouse",
  "Security Audit Remediation",
  "Marketing Site Relaunch",
  "Sales Enablement Toolkit",
  "API Rate Limiting Rework",
  "Accessibility Compliance Pass",
  "Payment Gateway Upgrade",
  "Real-time Notification Service",
  "Employee Directory Refresh",
  "Localization for EU Markets",
  "Churn Prediction Model",
  "Support Ticket Triage Automation",
  "Data Retention Policy Rollout",
  "Vendor Portal Redesign",
  "Inventory Sync Service",
  "Executive Reporting Dashboard",
  "Single Sign-On Rollout",
  "Warehouse Robotics Dashboard",
] as const;

const STATUSES = ["not_started", "in_progress", "in_review", "completed", "blocked"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const ACCENT_COLORS = ["blue", "slate", "emerald", "amber", "rose", "indigo", "teal"];

function colorForName(name: string) {
  const idx = name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

async function main() {
  console.log("Seeding database...");

  await prisma.activityEvent.deleteMany();
  await prisma.productivityMetric.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.client.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.user.deleteMany();
  await prisma.orgSettings.deleteMany();

  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  const users = await Promise.all(
    EMPLOYEES.map((e) =>
      prisma.user.create({
        data: {
          name: e.name,
          email: e.email,
          passwordHash,
          role: e.role,
          department: e.department,
          jobTitle: e.jobTitle,
          address: e.address,
          avatarUrl: null,
        },
      }),
    ),
  );
  console.log(`Created ${users.length} users. Demo login: demo@pulse.dev / Demo1234!`);

  const clients = await Promise.all(
    CLIENTS.map((c) =>
      prisma.client.create({
        data: { ...c, status: "active", logoColor: colorForName(c.name) },
      }),
    ),
  );
  console.log(`Created ${clients.length} clients.`);

  const tags = await Promise.all(TAGS.map((name) => prisma.tag.create({ data: { name } })));
  console.log(`Created ${tags.length} tags.`);

  const now = new Date();
  const projects = [];
  for (let i = 0; i < PROJECT_SUFFIXES.length; i++) {
    const suffix = PROJECT_SUFFIXES[i];
    const useClient = i % 2 === 0;
    const client = useClient ? pick(clients) : null;
    const title = client ? `${client.name} — ${suffix}` : `Internal — ${suffix}`;
    const status = pick(STATUSES);
    const priority = pick(PRIORITIES);
    const isOverdue = status !== "completed" && Math.random() < 0.15;
    const dueDate = isOverdue
      ? new Date(now.getTime() - rand(1, 20) * 86400000)
      : new Date(now.getTime() + rand(-10, 60) * 86400000);
    const creator = pick(users.filter((u) => u.role !== "member"));
    const assignees = pickMany(users, rand(1, 4));
    const projectTags = pickMany(tags, rand(1, 3));

    const project = await prisma.project.create({
      data: {
        title,
        description: `Deliver ${suffix.toLowerCase()} covering discovery, implementation, and rollout${client ? ` for ${client.name}` : " across internal teams"}.`,
        clientId: client?.id,
        priority,
        status,
        dueDate,
        estimatedHours: rand(20, 400),
        notes: Math.random() < 0.4 ? "Kickoff notes captured in the shared workspace." : null,
        createdById: creator.id,
        assignments: { create: assignees.map((u) => ({ userId: u.id })) },
        tags: { create: projectTags.map((t) => ({ tagId: t.id })) },
      },
    });
    projects.push(project);
  }
  console.log(`Created ${projects.length} projects.`);

  // Attendance + productivity history (60 days)
  const DAYS = 60;
  for (const user of users) {
    for (let d = DAYS - 1; d >= 0; d--) {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isRemoteWorker = ["Marcus Chen", "Jonas Weber", "Noah Whitfield"].includes(user.name);

      if (isWeekend && !(isRemoteWorker && Math.random() < 0.1)) continue;

      const roll = Math.random();
      let status: string;
      if (roll < 0.83) status = isRemoteWorker && Math.random() < 0.4 ? "remote" : "present";
      else if (roll < 0.9) status = "late";
      else if (roll < 0.96) status = "leave";
      else status = "absent";

      if (status !== "absent" && status !== "leave") {
        const checkInHour = status === "late" ? rand(9, 10) : rand(8, 9);
        const checkInMin = rand(0, 59);
        const hoursLogged = Math.round((rand(55, 90) / 10) * 10) / 10;
        await prisma.attendanceRecord.create({
          data: {
            userId: user.id,
            date,
            status,
            checkIn: `${String(checkInHour).padStart(2, "0")}:${String(checkInMin).padStart(2, "0")}`,
            checkOut: `${String(checkInHour + rand(7, 9)).padStart(2, "0")}:${String(rand(0, 59)).padStart(2, "0")}`,
            hoursLogged,
          },
        });

        const baseFocus = rand(55, 92);
        const baseProductivity = Math.min(100, Math.max(30, baseFocus + rand(-12, 12)));
        await prisma.productivityMetric.create({
          data: {
            userId: user.id,
            date,
            tasksCompleted: rand(1, 8),
            hoursLogged,
            focusScore: baseFocus,
            productivityScore: baseProductivity,
          },
        });
      } else {
        await prisma.attendanceRecord.create({
          data: { userId: user.id, date, status, checkIn: null, checkOut: null, hoursLogged: 0 },
        });
      }
    }
  }
  console.log(`Generated ${DAYS} days of attendance + productivity history.`);

  // Recent activity feed
  const activityTemplates = (project: (typeof projects)[number], user: (typeof users)[number]) => [
    `updated status on "${project.title}" to ${project.status.replace("_", " ")}`,
    `added a comment on "${project.title}"`,
    `uploaded a file to "${project.title}"`,
    `assigned a new team member to "${project.title}"`,
    `changed priority on "${project.title}" to ${project.priority}`,
  ];

  let activityCount = 0;
  for (let i = 0; i < 50; i++) {
    const project = pick(projects);
    const user = pick(users);
    const message = pick(activityTemplates(project, user));
    const daysAgo = rand(0, 13);
    const createdAt = new Date(now.getTime() - daysAgo * 86400000 - rand(0, 86399) * 1000);
    await prisma.activityEvent.create({
      data: {
        userId: user.id,
        type: "project_status_changed",
        message,
        entityType: "project",
        entityId: project.id,
        createdAt,
      },
    });
    activityCount++;
  }
  console.log(`Created ${activityCount} activity events.`);

  const credentialSeeds = [
    { toolName: "GitHub", username: "pulse-ci-bot", secret: "demo_github_token_pulse_sample_12345" },
    { toolName: "AWS Console", username: "ops@pulse.dev", secret: "DEMO_AWS_KEY_PULSE_SAMPLE_12345" },
    { toolName: "Figma", username: "design@pulse.dev", secret: "demo_figma_token_pulse_sample_12345" },
    { toolName: "Stripe", username: "billing@pulse.dev", secret: "demo_stripe_key_pulse_sample_12345" },
    { toolName: "Datadog", username: "monitoring@pulse.dev", secret: "demo_datadog_key_pulse_sample_12345" },
  ];
  for (const c of credentialSeeds) {
    await prisma.credential.create({
      data: { toolName: c.toolName, username: c.username, secretEnc: encrypt(c.secret), notes: null },
    });
  }
  console.log(`Created ${credentialSeeds.length} credentials (encrypted at rest).`);

  await prisma.orgSettings.create({ data: { plan: "free" } });
  console.log("Created org settings (plan: free).");

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
