const mongoose = require('mongoose')
const fechaUtil = require('../util/fechaUtil')

const eventoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fechas: { 
        type: [ Date ],
        required: true
    },
    lugar: { 
        type: String,
        required: true 
    },
    destacado: { 
        type: Boolean,
        default: false 
    },
    imagen: { 
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


eventoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()

        returnedObject.fechas = returnedObject.fechas.map( f => {
            
            const fechas = []
            fechas.push( {
                fecha: fechaUtil.getFechaString( f ),
                hora: fechaUtil.getHoraString( f )
            })

            return fechas
        })

        delete returnedObject._id
        delete returnedObject.__v
    }
})



module.exports = mongoose.model('Evento', eventoSchema)
