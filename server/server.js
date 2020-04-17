require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

/* //=======================================================
Este es el modo del profesor, que está Deprecated!!!!!

mongoose.connect('mongodb://localhost:27017/cafe', () => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
//=======================================================
 */

//=======================================================
// Esta es la forma oficial que viene en la documentación
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); // enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
    console.log('Base de datos ONLINE'); // si esta todo ok, imprime esto
});
//=======================================================

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});