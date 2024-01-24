
import {config} from 'dotenv'
import path from 'path'
import __dirname from './utils.js'
import {program} from 'commander'



//console.log('Before loading dotenv:', process.env.MONGO_URL, process.env.MONGO_DBNAME, process.env.PERSISTENCE);

program
  .option('-p, --persistence <type>', 'Tipo de persistencia: file o mongo')
  .parse(process.argv);
  
const envPath= path.resolve(__dirname, '../.env')
config({path: envPath})




  //console.log('program.persistence!', program.persistence);
  //console.log('process.argv:', process.argv);

  const persistenceType = program.persistence || process.env.PERSISTENCE || 'default';

 console.log('File loaded!!');

const environmentConfig = {
    PERSISTENCE: persistenceType,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
  };
  
  export default environmentConfig
  
//console.log('enviroment coNFIgir', environmentConfig)
// console.log('process.env.MONGO_UR', process.env.MONGO_URL);
// console.log('environmentConfig.MONGO_URL', environmentConfig.MONGO_URL);
console.log('port', process.env.PORT);
// console.log('port', environmentConfig.PORT);
// console.log(process.env.MONGO_DBNAME);
//console.log(process.env);
