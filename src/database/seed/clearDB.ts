import { Parcel } from './../models/Parcel';
import { User } from '../models/User';

export default async function clearDB() {
  await User.deleteMany({});
  await Parcel.deleteMany({});
}
