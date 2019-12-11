import faker from 'faker';
import { config } from 'dotenv';

config();

const password = process.env.USER_PASSWORD;

export const admin = {
  password,
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: false,
  isAdmin: true,
};

export const user = {
  password,
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: false,
  isAdmin: false,
};

export const adminLoggedIn = {
  password,
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: true,
  isAdmin: true,
};

export const userLoggedIn = {
  password,
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  provider: null,
  isLoggedIn: true,
  isAdmin: false,
};
