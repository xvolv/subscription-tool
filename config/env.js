import { config } from "dotenv";
config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});
// const path = `.env.${process.env.NODE_ENV || "development"}.local`;
// console.log(path);

export const {
  ARCJET_KEY,
  ARCJET_ENV,
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  QSTASH_URL,
  QSTASH_TOKEN,
  SERVER_URL,
  EMAIL_PASSWORD,
  EMAIL,
  HOST,
  SERVICE,
  EMAIL_PORT,
  SECURE,
} = process.env;
