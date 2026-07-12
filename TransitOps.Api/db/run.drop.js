import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDrop() {
    const connectionString = process.env.DATABASE_URL;
    
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        console.log('Dropping all tables...');
        const filePath = path.join(__dirname, 'drop_all.sql');
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log('All tables dropped successfully.');

    } catch (err) {
        console.error('Database operation failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runDrop();
