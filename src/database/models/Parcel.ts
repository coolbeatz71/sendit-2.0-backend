import mongoose, { Document, Schema } from 'mongoose';
import { IParcel, Status } from '../../interfaces/models.interface';

export type ParcelDocument = Document & IParcel;

const parcelSchema = new Schema(
  {
    parcelName: String,
    description: String,
    pickupLocation: String,
    destination: String,
    presentLocation: String,
    weight: Number,
    price: Number,
    status: Status,
  },
  { timestamps: true },
);

export const Parcel = mongoose.model<ParcelDocument>('Parcel', parcelSchema);
