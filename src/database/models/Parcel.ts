import mongoose, { Document, Schema } from 'mongoose';
import { IParcel, arrayStatus } from '../../interfaces/models.interface';

export type ParcelDocument = Document & IParcel;

const parcelSchema = new Schema(
  {
    userId: String,
    parcelName: String,
    description: String,
    pickupLocation: String,
    destination: String,
    presentLocation: String,
    weight: Number,
    price: Number,
    status: {
      enum: arrayStatus,
    },
  },
  { timestamps: true },
);

export const Parcel = mongoose.model<ParcelDocument>('Parcel', parcelSchema, 'parcels');
