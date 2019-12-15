import { User } from './database/models/User';
import { Parcel } from './database/models/Parcel';

export const teardownSetup = async () => {
  await User.deleteMany({});
  await Parcel.deleteMany({});
};

export default teardownSetup;
