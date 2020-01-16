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

config({ path });

export const {
  APP,
  PORT,
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  JWT_ENCRYPTION,
  JWT_EXPIRATION,
  SALT_ROUNDS,
  USER_PASSWORD,
  JWT_NON_AUTH_ADMIN,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
} = process.env as {
  [key: string]: string;
};
