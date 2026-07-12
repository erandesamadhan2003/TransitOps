import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle database client', err);
    process.exit(-1);
});

export const connectDB = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Failed to connect to PostgreSQL database:', err.message);
        process.exit(1);
    }
};

export const withTransaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export default pool;
