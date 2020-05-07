const jwt = require('jsonwebtoken');

// =================================
// Verificar Token
// =================================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    // res.json({
    //     token
    // });

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            //console.log(err);
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();

    });



};

// =================================
// Verificar AdminRole
// =================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: 'El usuario debe ser administrador'
        });
    }

}

// =================================
// Verificar UserLogin
// Fue creado para hacer una validación cutre de estado logueado,
// pero el profesor lo hace con el verificaToken
// =================================

let verificaUser_Login = (req, res, next) => {

    if (process.env.ID_USUARIO != "") {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: 'El usuario debe estar logueado correctamente'
        });
    }

}



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaUser_Login
}