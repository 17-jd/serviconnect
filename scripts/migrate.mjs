import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
config({ path: join(__dirname, "..", ".env.local") });

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error("❌ DATABASE_URL not found in .env.local");
  console.error("   Add: DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres");
  process.exit(1);
}

async function main() {
  console.log("🚀 ServiConnect Database Migration\n");

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.log("📦 Installing pg package...");
    const { execSync } = await import("child_process");
    execSync("npm install pg", { cwd: join(__dirname, ".."), stdio: "inherit" });
    pg = await import("pg");
  }

  const { Client } = pg.default || pg;
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

  try {
    console.log("🔗 Connecting to database...");
    await client.connect();
    console.log("✅ Connected!\n");

    const files = [
      { path: join(__dirname, "..", "supabase", "migrations", "00001_initial_schema.sql"), label: "Schema, Tables & Functions" },
      { path: join(__dirname, "..", "supabase", "migrations", "00002_rls_policies.sql"), label: "Row Level Security Policies" },
      { path: join(__dirname, "..", "supabase", "seed.sql"), label: "Seed Data (Service Categories)" },
    ];

    for (const file of files) {
      console.log(`⏳ Running: ${file.label}...`);
      const sql = readFileSync(file.path, "utf-8");
      try {
        await client.query(sql);
        console.log(`   ✅ ${file.label} — done\n`);
      } catch (err) {
        if (err.message.includes("already exists")) {
          console.log(`   ⏭️  ${file.label} — already applied\n`);
        } else {
          console.log(`   ❌ Error: ${err.message}\n`);
          throw err;
        }
      }
    }

    console.log("🎉 All migrations completed successfully!");

    // Verify
    const { rows } = await client.query("SELECT count(*) FROM public.service_categories");
    console.log(`\n📊 Verification: ${rows[0].count} service categories in database`);

  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
