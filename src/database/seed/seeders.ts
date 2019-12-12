import faker from 'faker';
import { User } from '../models/User';
import { Parcel } from './../models/Parcel';
import { user, admin, userLoggedIn, adminLoggedIn } from '../../../__mocks__/users';
import { IParcel, Status } from './../../interfaces/models.interface';

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
        status: Status.PENDING,
      };
      await Parcel.create(parcels);
    }
  });
};

export const seed = async () => {
  seedUsers()
    .then(() => {
      console.log('👏🏿👏🏿👏🏿 Users seed successfully terminated');
    })
    .then(() => {
      seedParcels().then(() => {
        console.log('👏🏿👏🏿👏🏿 Parcels seed successfully terminated');
      });
    });
};
