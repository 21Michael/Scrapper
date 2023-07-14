import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import mongoose from 'mongoose';
import 'dotenv/config';
import routes from './route';

const app = express();
const port: string | number = process.env.PORT || 4001;
const key: string = process.env.COOKIE_KEY || '';

const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [key],
  resave: false,
  saveUninitialized: false,
}

app.use(cors());
app.use(express.json());
app.use(cookieSession(cookieOptions));

(async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.SCRAPPER_DB_IP}:${process.env.SCRAPPER_DB_PORT}`);

    app.use('/', routes);

    app.listen(port, () => {
      console.log("Server works on port: " + port);
    });
  } catch (error) {
    console.log("Error: " + error);

    process.exit(1);
  }
})();
