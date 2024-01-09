import {config} from 'dotenv'
import path from 'path'
import __dirname from './utils.js'

const envPath= path.resolve(__dirname, '../.env')
console.log(envPath)

config({path: envPath})

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const MONGO_URL = process.env.MONGO_URL
const MONGO_DBNAME = process.env.MONGO_DBNAME

//console.log(process.env.MONGO_URL);
//console.log(process.env.MONGO_DBNAME);
//console.log(process.env);
console.log('File loaded');