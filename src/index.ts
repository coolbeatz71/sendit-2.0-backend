import { config } from 'dotenv';
import app from './App';
import './database/db';
import { PORT } from './database/config';

config();

app.listen(PORT, (err: Error) => {
  if (err) return console.log(err);
  console.log(`Server is listening on ${PORT}`);
});
