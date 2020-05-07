const express = require('express');

//let { verificaToken } = require('../middlewares/autenticacion');
const { verificaToken, verificaAdmin_Role, verificaUser_Login } = require('../middlewares/atenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorías
// ============================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });



});

// ============================
// Mostrar una categoría por ID
// ============================

app.get('/categoria/:id', verificaToken, (req, res) => {

    //Cataegoria.findById(.....)

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: 'El Id no es correcto'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

// ============================
// Crear una nueva categoría
// ============================

app.post('/categoria', [ /*verificaUser_Login,*/ verificaToken], (req, res) => {

    // regresa la nueva categoria
    // req.usuario_id para ver quien crea la categoria

    // Categoria 
    //    descripcion
    //    usuario


    //   if (process.env.ID_USUARIO != "") {
    let body = req.body;


    let categoria = new Categoria({ //Se crea la categría
        descripcion: body.descripcion,
        //usuario: process.env.ID_USUARIO ///////// HAY QUE VER CÓMO OBTENER ESE USUARIO_ID!!!!!!!!!!!!!!!!!!!!
        usuario: req.usuario._id // Explicación: Para que funcione el usuario._id hay que enviar el token en verificaToken
            // Me daba error de token, suponemos que por la exxpiración de la validez
            // Yo hice una validación de que el usuario está logueado más cutre, pero él lo hace así
    });

    //console.log(categoria);

    // Graba la categoría. Si todo va bien devuelve catogoríaDB, si no, un error
    categoria.save((err, categoriaDB) => { // Se graba la catagoría en la BD

        if (err) {
            return res.status(500).json({ // Error 500 porque si falla aquí es error de la BD
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        if (!categoriaDB) {
            return res.status(400).json({ // Error 400 que salta si no se creó la categoría 
                ok: false,
                err
            });
        }


        res.json({ // Mando la respuesta si todo ha ido bien
            ok: true,
            categoria: categoriaDB
        });

    });
    // } else {
    //     return res.status(401).json({
    //         ok: false,
    //         err: "Debe estar logueado para crear una categoría"
    //     });
    //}




});

// ============================
// Actualizar una categoría
// ============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    console.log(`El id es ${id}`);
    console.log(`El id es ${descCategoria.descripcion}`);

    //Esto actualiza la categoría, devolviendo un error o el objeto actualizdo, pasando por las validaciones
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        console.log(`El id es ${id}`);

        if (err) {
            console.log(id);
            return res.status(500).json({ // Error 500 porque si falla aquí es error de la BD
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        if (!categoriaDB) {
            console.log("Error 400");

            return res.status(400).json({ // Error 400 que salta si no se creó la categoría 
                ok: false,
                err
            });
        }

        console.log(categoriaDB);

        // HAY QUE MANDAR SIEMPRE LA RESPUESTA, SI NO SE QUEDA COLGADO!!!!!!!
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    })

});

// ============================
// Borrar una categoría
// ============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //solo puede borrar un administrador
    // hay que pedir el token
    // hay que eliminarla del todo, Categoria.findByIdAndRemove
    //Grabar en Postman

    let id = req.params.id;
    console.log(`Voy a borrar la categoría ${id}`);


    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            console.log("error 500");

            return res.status(500).json({ // Error 500 porque si falla aquí es error de la BD
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        if (!categoriaDB) {
            console.log("error 400");

            return res.status(400).json({ // Error 400 que salta si no se creó la categoría 
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría borrada'
        });

    });

});












module.exports = app;