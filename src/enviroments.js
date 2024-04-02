import { config } from "dotenv";
import path from "path";
import __dirname from "./utils.js";
import { opts } from "./commander.js";

//console.log('Before loading dotenv:', process.env.MONGO_URL, process.env.MONGO_DBNAME, process.env.PERSISTENCE);

const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

console.log("File loaded!!");

const environmentConfig = {
  PERSISTENCE: opts.persistence || process.env.PERSISTENCE,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_DBNAME: process.env.MONGO_DBNAME,
  KEY: process.env.KEY,
  REDIRECT_URL_BASE: process.env.REDIRECT_URL_BASE,
  REDIRECT_URL_LOCAL: process.env.REDIRECT_URL_LOCAL,
};

export default environmentConfig;

//console.log('enviroment coNFIgir', environmentConfig)
// console.log('process.env.MONGO_UR', process.env.MONGO_URL);
// console.log('environmentConfig.MONGO_URL', environmentConfig.MONGO_URL);
console.log("port", process.env.PORT);
// console.log('port', environmentConfig.PORT);
// console.log(process.env.MONGO_DBNAME);
//console.log(process.env);
