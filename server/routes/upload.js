const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Hay que importar el esquema de usuario para poder actualizar su imagen en la BD
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// Hay que importar filesystem y path para ver si existe una imagen y poder borrarla
const fs = require('fs');
const path = require('path');

// default options
//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));


// Se pone el método así si solo se sube una imagen sin más
//app.put('/upload', function(req, res) {

// Se pone así si se quiere discriminar si es imagen de usuario o de producto
app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;



    console.log("llega");

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo de imágenes
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
            }
        })
    }


    // archivo debe ser el nombre que se envía desde el formulario
    let archivo = req.files.archivo;

    // Vamos a obtener su extensión
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre del archivo
    // Tendría la forma "id de producto"-"milisegudos"."extension" 
    // Se añaden los milisegundos para evitar que el navegador cachee la imagen
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    // Usa la función mv() para mover el archivo al directorio que se quiera en el servidor
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        // Aquí, imagen cargada

        // res.json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });

        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        // Vamos a comprobar si existe la imagen anterior del usuario y la eliminamos
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    })

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // Vamos a comprobar si existe la imagen anterior del producto y la eliminamos
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${productoDB.img}`);
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });


    })

}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;