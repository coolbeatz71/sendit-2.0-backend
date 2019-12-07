import mongoose from 'mongoose';
import { DB_HOST } from './config';

mongoose.set('useCreateIndex', true);

// Connecting to the database
export const dbSetup = async () => {
  try {
    await mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
    // listen for requests
    console.log('The Connection is Ok');
  } catch (err) {
    console.log(`${err} Could not Connect to the Database. Exiting Now...`);
    process.exit();
  }
};

dbSetup();
