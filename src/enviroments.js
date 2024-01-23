
import {config} from 'dotenv'
import path from 'path'
import __dirname from './utils.js'

const envPath= path.resolve(__dirname, '../.env')

//console.log('Before loading dotenv:', process.env.MONGO_URL, process.env.MONGO_DBNAME);

config({path: envPath})


 console.log('File loaded!!');

const environmentConfig = {
    PERSISTENCE: process.env.PERSISTENCE, //nodemon app.js -e PERSISTENCE=MONGO
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
  };
  
  export default environmentConfig
  

// console.log('process.env.MONGO_UR', process.env.MONGO_URL);
// console.log('environmentConfig.MONGO_URL', environmentConfig.MONGO_URL);
console.log('port', process.env.PORT);
// console.log('port', environmentConfig.PORT);
// console.log(process.env.MONGO_DBNAME);
// //console.log(process.env);
