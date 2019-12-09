import { config } from 'dotenv';
import { resolve } from 'path';

let path;
switch (process.env.NODE_ENV) {
  case 'production':
    path = resolve(`${__dirname}/../../.env`);
    break;
  case 'test':
    path = resolve(`${__dirname}/../../.env.test`);
    break;
  default:
    path = resolve(`${__dirname}/../../.env.development`);
}

config({ path, debug: true });

export const APP = process.env.APP;
export const PORT = process.env.PORT || '5000';
export const DB_DIALECT = process.env.DB_DIALECT;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME || 'sendit-dev';
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT || '27017';
export const DB_USER = process.env.DB_USER || 'root';
export const JWT_ENCRYPTION = process.env.JWT_ENCRYPTION;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const SALT_ROUNDS = process.env.SALT_ROUNDS;

console.log(DB_HOST);
