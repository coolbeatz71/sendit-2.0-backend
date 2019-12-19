import { config } from 'dotenv';
import app from './App';
import { PORT } from './database/config';
import { dbSetup } from './database/db';

config();
dbSetup();
app.listen(PORT, (err: Error) => {
  if (err) return console.log(err);
  console.log(`Server is listening on ${PORT}`);
});
