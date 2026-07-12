import 'dotenv/config';

const {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    DATABASE_URL,
    PORT,
    NODE_ENV
} = process.env;

if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables');
}

export const env = {
    JWT_SECRET,
    JWT_EXPIRES_IN: JWT_EXPIRES_IN || '8h',
    DATABASE_URL,
    PORT: PORT || 5000,
    NODE_ENV: NODE_ENV || 'development'
};
