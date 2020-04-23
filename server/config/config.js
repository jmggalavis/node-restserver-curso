//========================================================
// Puerto
//========================================================

process.env.PORT = process.env.PORT || 3000;

//========================================================
// Entorno
//========================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================================================
// Base de Datps
//========================================================

let urlDB;

//========================================================
// Vencimiento del token
//========================================================
// 60 segundos
// 60 minutos
// 24 horas 
// 30 días 

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//========================================================
// SEED de autenticación
//========================================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//========================================================
// Google Client ID
//========================================================

process.eventNames.CLIENT_ID = process.eventNames.CLIENT_ID || '410206892641-v3kaeufv48jta977s2ub9leduq88nu9v.apps.googleusercontent.com';