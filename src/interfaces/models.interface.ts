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
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export interface IParcel {
  userId: string;
  parcelName: string;
  description: string;
  pickupLocation: string;
  destination: string;
  presentLocation: string;
  weight: number;
  price?: number;
  status?: string;
}

/**
 * @description Restrict parcel update by the user
 * @interface IUserUpdateParcel
 */
export interface IUserUpdateParcel {
  parcelName?: string;
  description?: string;
  pickupLocation?: string;
  presentLocation?: string;
  destination?: string;
  weight?: number;
}
