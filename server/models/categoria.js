const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// let rolesValidos = {
//     values: ['ADMIN_ROLE', 'USER_ROLE'],
//     message: '{VALUE} no es un rol válido'
// };

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es necesario'],
        ref: 'Usuario' //Para poder hacer el populate
    }

});

categoriaSchema.methods.toJSON = function() {

    let cat = this;
    let catObject = cat.toObject();

    return catObject;

}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });


module.exports = mongoose.model('Categoria', categoriaSchema);