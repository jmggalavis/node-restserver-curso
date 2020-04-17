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

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://jmggalavis:tImsvlKCy4NQTbdk@cluster0-5cbvt.mongodb.net/cafe';
}

process.env.URLDB = urlDB;