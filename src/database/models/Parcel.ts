import mongoose, { Document, Schema } from 'mongoose';
import { IParcel, arrayStatus, Status } from '../../interfaces/models.interface';

export type ParcelDocument = Document & IParcel;

const parcelSchema = new Schema(
  {
    userId: String,
    parcelName: {
      type: String,
      required: true,
    },
    description: String,
    pickupLocation: String,
    destination: String,
    presentLocation: String,
    weight: Number,
    price: Number,
    status: {
      type: String,
      enum: arrayStatus,
      default: Status.PENDING,
    },
  },
  { timestamps: true },
);

export const Parcel = mongoose.model<ParcelDocument>('Parcel', parcelSchema, 'parcels');
