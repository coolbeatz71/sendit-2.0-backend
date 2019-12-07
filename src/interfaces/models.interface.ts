export enum Status {
  PENDING = 'pending',
  TRANSITING = 'transiting',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const arrayStatus = [Status.PENDING, Status.TRANSITING, Status.DELIVERED, Status.CANCELLED];

export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface IParcel {
  userId: string;
  parcelName: string;
  description: string;
  pickupLocation: string;
  destination: string;
  presentLocation: string;
  weight: number;
  price: number;
  status: Status;
}
