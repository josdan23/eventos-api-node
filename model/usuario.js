const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eventos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evento'
        }
    ]
})

usuarioSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})

module.exports = mongoose.model('Usuario', usuarioSchema)