import { dbSetup } from '../database/db';
import authTests from './integration/auth.spec';
import errorTests from './integration/errors.spec';
import adminTests from './integration/admin.spec';
import parcelsTests from './integration/parcels.spec';

beforeAll(async () => {
  await dbSetup();
});

describe('Authentication', authTests);
describe('Errors', errorTests);
describe('Admin', adminTests);
describe('Parcels', parcelsTests);
