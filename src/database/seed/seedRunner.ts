import { dbSetup } from '../db';
import { seed } from './seeders';

import * as dotenv from 'dotenv';
dotenv.config();

const runSeed = async () => {
  await dbSetup();
  await seed();
};

runSeed();
