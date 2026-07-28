-- Remove unused ItemType enum values TASK and CAPSULE
CREATE TYPE "ItemType_new" AS ENUM ('NOTE', 'SNIPPET', 'COMMAND', 'BOOKMARK', 'PROMPT', 'FILE');

ALTER TABLE "item" ALTER COLUMN "type" TYPE "ItemType_new" USING ("type"::text::"ItemType_new");

DROP TYPE "ItemType";
ALTER TYPE "ItemType_new" RENAME TO "ItemType";
