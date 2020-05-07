const express = require('express');

const { verificaToken } = require('../middlewares/atenticacion');
//const { verificaToken, verificaAdmin_Role, verificaUser_Login } = require('../middlewares/atenticacion');

const _ = require('underscore'); //Esto es para que funcione lo del pick!!!!



let app = express();
let Producto = require('../models/producto');

// ========================================
// Obtener Productos
// ========================================

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos     
    // populate usuario y gategoría
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('categoria nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

// ========================================
// Obtener Productos por ID
// ========================================

app.get('/producto/:id', verificaToken, (req, res) => {
    // populate usuario y gategoría
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: 'El Id no es correcto'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });


});

// ========================================
// Buscar Productos
// ========================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Creamos una expresión regular con el término
    // La 'i' es para ignorar mayúsculas
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });




});



// ========================================
// Crear un nuevo Producto
// Todo esto está copiado del post de Categorías
// ========================================

app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario    
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({ //Se crea el producto
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({ // Error 500 porque si falla aquí es error de la BD
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({ // Error 400 que salta si no se creó el producto 
                ok: false,
                err
            });
        }


        res.json({ // Mando la respuesta si todo ha ido bien
            ok: true,
            producto: productoDB
        });

    });


});

// ========================================
// Actualizar un Producto
// Esta es mi forma.
// En la suya, obtiene el productoDB con un findById y 
// modifica en plan productoDB.nombre=body.nombre
// Tras esto hace el productoDB.save
// ========================================

app.put('/producto/:id', verificaToken, (req, res) => {
    // 


    let id = req.params.id;
    //let body = req.body;

    // let descProducto = {
    //     descripcion: body.descripcion
    // };

    // let nombreProducto = {
    //     nombre: body.nombre
    // };

    // let precioProducto = {
    //     precioUni: body.precio
    // };

    // let cateProducto = {
    //     categoria: body.categoria
    // };

    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible']);


    //Esto actualiza la categoría, devolviendo un error o el objeto actualizdo, pasando por las validaciones
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            //console.log(`El id es ${id}`);

            if (err) {
                console.log(id);
                return res.status(500).json({ // Error 500 porque si falla aquí es error de la BD
                    ok: false,
                    err
                });
            }

            //usuarioDB.password = null;

            if (!productoDB) {
                console.log("Error 400");

                return res.status(400).json({ // Error 400 que salta si no se creó la categoría 
                    ok: false,
                    err
                });
            }

            //console.log(productoDB);

            // HAY QUE MANDAR SIEMPRE LA RESPUESTA, SI NO SE QUEDA COLGADO!!!!!!!
            res.json({
                ok: true,
                producto: productoDB
            });


        })
});

// ========================================
// Borrar un  Producto
// ========================================

app.delete('/producto/:id', (req, res) => {
    // conservar fisicamente, poner disponible false    

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };



    //Esto es si se quiere borrar completamente el registro, normalmente se le pone estado a false

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });

    })

});



module.exports = app;