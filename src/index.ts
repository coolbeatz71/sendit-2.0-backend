import app from './App';
import CONFIG from './database/config';
import './database/db';

const PORT = CONFIG.PORT;

app.listen(PORT, (err: Error) => {
  if (err) return console.log(err);
  console.log(`Server is listening on ${PORT}`);
});
