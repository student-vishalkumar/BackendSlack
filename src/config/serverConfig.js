import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const MAIL_ID = process.env.MAIL_ID;

export const REDDIS_HOST = process.env.REDDIS_HOST || 'localhost';

export const REDDIS_PORT = process.env.REDDIS_PORT || 6379;

export const APP_LINK = process.env.APP_LINK || 'http://localhost:3002';

export const ENABLE_EMAIL_VERIFICATION = process.env.ENABLE_EMAIL_VERIFICATION || false