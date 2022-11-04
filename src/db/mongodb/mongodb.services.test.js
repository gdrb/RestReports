import { MONGO_DB_CONEXION_STATES } from './mongodb.constants.js';
import { MongoDBServices } from './mongodb.services.js';

// Define "require"
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dotenv = require('dotenv').config({
  path: require('find-config')('.env')
});

// Datos de comunicacion con la Base de Datos
const databaseName = process.env.NOMBRE_BASE_DE_DATOS;
const ipBaseDeDatos = process.env.IP_BASE_DE_DATOS;
const puertoBaseDeDatos = process.env.PUERTO_BASE_DE_DATOS;
const ipBaseDeDatosReplica = process.env.IP_BASE_DE_DATOS_REPLICA;
const puertoBaseDeDatosReplica = process.env.PUERTO_BASE_DE_DATOS_REPLICA;
const protocoloBaseDeDatos = process.env.PROTOCOLO_BASE_DE_DATOS;
const opcionesConexionBaseDeDatos = process.env.OPCIONES_CONEXION_BASE_DE_DATOS;

let DBName = 'Test';

const dbUrl =
  protocoloBaseDeDatos + '://' + ipBaseDeDatos + ':' + puertoBaseDeDatos; /*+
  '/' +
  DBName +
  '?' +
  opcionesConexionBaseDeDatos;*/
console.log(`url`, dbUrl);
let mongoDB = new MongoDBServices(dbUrl, 'Test');

const query1 = {
  $and: [
    { 'datos.idFromTh': '000002.4' },
    { 'datos.idToTh': '000002.4' },
    { 'datos.processDateTime': { $lte: '2022-09-02T12:00:00.000-04:00' } },
    { 'datos.processDateTime': { $gte: '2022-09-02T00:00:00.000-04:00' } }
  ]
};
const projection1 = {};

const test = async () => {
  const collectionName = 'Events';
  const query = {
    nombre: 'Andres'
  };

  const dataToUpdate = {
    $set: { nombre: 'Mario' }
  };

  const projection = {};
  await mongoDB.connect();
  let result = await mongoDB.find('Events', {}, {});
  let insertUpdateOneResult = await mongoDB.insertUpdateOne(
    collectionName,
    query,
    dataToUpdate
  );

  let insertOneResult = await mongoDB.insertOne('ABC', {
    id: 1,
    data: { hola: 2 }
  });

  await mongoDB.disconnect();
};

test();
