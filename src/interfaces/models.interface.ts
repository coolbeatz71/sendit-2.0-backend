export enum Status {
  PENDING = 'pending',
  TRANSITING = 'transiting',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface IUser {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface IParcel {
  parcelName: string;
  description: string;
  pickupLocation: string;
  destination: string;
  presentLocation: string;
  weight: number;
  price: number;
  status: Status;
}
