import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
    const connectionString = process.env.DATABASE_URL;
    
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        const seedsDir = path.join(__dirname, 'seeds');
        if (fs.existsSync(seedsDir)) {
            const seedFiles = fs.readdirSync(seedsDir).sort();
            console.log('⏳ Running Seeds...');
            for (const file of seedFiles) {
                if (file.endsWith('.sql')) {
                    const filePath = path.join(seedsDir, file);
                    const sql = fs.readFileSync(filePath, 'utf8');
                    await client.query(sql);
                    console.log(`  - Executed seed: ${file}`);
                }
            }
            console.log('All seeds executed successfully.');
        } else {
            console.log('No seeds directory found.');
        }

    } catch (err) {
        console.error('Database operation failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runSeeds();
