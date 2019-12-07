import app from './App';
import { PORT } from './database/config';
import './database/db';

app.listen(PORT, (err: Error) => {
  if (err) return console.log(err);
  console.log(`Server is listening on ${PORT}`);
});
