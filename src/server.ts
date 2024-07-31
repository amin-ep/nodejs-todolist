import mongoose from 'mongoose';
import app from './app.js';
import { config } from 'dotenv';

config({ path: '.env' });

const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV;
const DB = process.env.DB_URL as string;

mongoose.connect(DB).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`App is running on port:${port}!`);
  console.log(`Mode:${mode}!`);
});
