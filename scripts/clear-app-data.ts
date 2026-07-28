import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { uniqueSlug } from "../src/lib/slug";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/knowledge_vault";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function clearAppData() {
  await db.$transaction([
    db.itemTag.deleteMany(),
    db.favorite.deleteMany(),
    db.revision.deleteMany(),
    db.attachment.deleteMany(),
    db.item.deleteMany(),
    db.tag.deleteMany(),
    db.project.deleteMany(),
    db.collection.deleteMany(),
    db.shareLink.deleteMany(),
    db.workspaceMember.deleteMany(),
    db.workspace.deleteMany(),
  ]);

  await db.user.updateMany({
    data: { activeWorkspaceId: null },
  });
}

async function bootstrapWorkspaces() {
  const users = await db.user.findMany({
    select: { id: true, name: true },
  });

  for (const user of users) {
    const slug = uniqueSlug(user.name || "personal", user.id.slice(0, 8));
    const workspace = await db.workspace.create({
      data: {
        name: `${user.name}'s Workspace`,
        slug,
        isPersonal: true,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { activeWorkspaceId: workspace.id },
    });
  }

  return users.length;
}

async function main() {
  console.log("Clearing app data (keeping auth & user profiles)...");
  await clearAppData();

  const userCount = await bootstrapWorkspaces();
  console.log(`Done. Cleared content data and recreated ${userCount} personal workspace(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
