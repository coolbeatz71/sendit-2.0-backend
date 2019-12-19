import faker from 'faker';
import { config } from 'dotenv';
import { USER_PASSWORD } from '../src/database/config';

config();

const password = USER_PASSWORD;

export const admin = {
  password,
  email: 'admin@email.com',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: false,
  isAdmin: true,
};

export const user = {
  password,
  email: 'user@email.com',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: false,
  isAdmin: false,
};

export const adminLoggedIn = {
  password,
  email: 'loggedin_admin@email.com',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: true,
  isAdmin: true,
};

export const userLoggedIn = {
  password,
  email: 'loggedin_user@email.com',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: true,
  isAdmin: false,
};
