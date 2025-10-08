import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const HOSTNAME = process.env.HOST;
const HOST_PORT = process.env.PORT;
const APP_DOMAIN = process.env.APP_DOMAIN;
const APP_VERSION = process.env.APP_VERSION;
const APP_ENV = process.env.APP_ENV;
const URL_DOMAIN = process.env.URL_DOMAIN;
const APP_NAME = process.env.APP_NAME;


export {
  HOSTNAME,
  HOST_PORT,
  APP_DOMAIN,
  APP_VERSION,
  APP_ENV,
  URL_DOMAIN,
  APP_NAME
};
