import { dbSetup } from '../db';
import { seed } from './seeders';
import { config } from 'dotenv';

config();

const runSeed = async () => {
  await dbSetup();
  await seed();
};

runSeed();
