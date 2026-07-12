import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL;
    
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // 1. Run Migrations
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir).sort();

        console.log('Running Migrations...');
        for (const file of migrationFiles) {
            if (file.endsWith('.sql')) {
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');
                await client.query(sql);
                console.log(`  - Executed migration: ${file}`);
            }
        }
        console.log('All migrations executed successfully.');



    } catch (err) {
        console.error('Database operation failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();
