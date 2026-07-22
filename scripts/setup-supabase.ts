/**
 * One-time setup for Supabase Storage.
 * Run after adding SUPABASE_SERVICE_ROLE_KEY to .env:
 *   npm run setup:supabase
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "attachments";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  if (buckets?.some((b) => b.name === BUCKET)) {
    console.log(`Bucket "${BUCKET}" already exists.`);
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 52_428_800, // 50 MB
  });

  if (createError) {
    console.error("Failed to create bucket:", createError.message);
    process.exit(1);
  }

  console.log(`Created storage bucket "${BUCKET}".`);
}

main();
