import faker from 'faker';
import { dbSetup } from './database/db';
import { User } from './database/models/User';
import { Parcel } from './database/models/Parcel';
import { user, admin, userLoggedIn, adminLoggedIn } from '../__mocks__/users';
import { IParcel } from './interfaces/models.interface';

let allUsers: any[];
const data = [user, admin, userLoggedIn, adminLoggedIn];

export const seedUsers = async () => {
  await User.create(data);
};

export const seedParcels = async () => {
  allUsers = await User.find();

  allUsers.map(async item => {
    if (item.isAdmin === false) {
      const parcels: IParcel = {
        userId: item._id,
        parcelName: faker.commerce.productName(),
        description: faker.lorem.paragraphs(4),
        pickupLocation: faker.address.country(),
        destination: faker.address.country(),
        presentLocation: faker.address.country(),
        weight: parseFloat(faker.finance.amount(10, 90, 2)),
        price: parseFloat(faker.finance.amount(10, 90, 2)),
      };
      await Parcel.create(parcels);
    }
  });
};

export const setupJest = async () => {
  await dbSetup();
  await seedUsers();
  await seedParcels();
};

export default setupJest;
