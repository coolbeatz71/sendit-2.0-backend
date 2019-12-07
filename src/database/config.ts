import * as dotenv from 'dotenv';
dotenv.config();

export default {
  APP: process.env.APP || 'testing',
  PORT: process.env.PORT || '5000',

  DB_DIALECT: process.env.DB_DIALECT || 'mongo',
  DB_HOST: process.env.DB_HOST || 'mongodb://localhost:27017/sendit-test',
  DB_NAME: process.env.DB_NAME || 'sendit-test',
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT || '27017',
  DB_USER: process.env.DB_USER || 'root',

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
};
