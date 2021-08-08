require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})



const eventoSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    fechas: [{ fecha: Date, hora: String }],
    lugar: String,
    destacado: { type: Boolean, default: false },
    imagen: String
})

// const Evento = mongoose.model('Evento', eventoSchema)


// const unEvento = new Evento({
//     titulo: 'Compra de reloj',
//     descripcion: undefined,
//     fechas: [
//         {
//             fecha: Date.now(),
//             hora: '22:12'
//         },
//         {
//             fecha: Date.now(),
//             hora: '12:30'
//         }
//     ],
//     lugar: 'Esta es la ubicación del evento',
//     destacado: true,
//     imagen: 'Una imagen del evento'
// })


// unEvento.save().then( result => {
//     console.log('nota guardada en la base de datos')
//     mongoose.connection.close()
// })


const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})



const Usuario = mongoose.model('Usuario', usuarioSchema)


const bcrypt = require('bcrypt')


const usuario = new Usuario({
    username: 'pepito21',
    password: 'pass321'
})

const saltRounds = 10
const passwordHash = bcrypt.hashSync(usuario.password, saltRounds)
usuario.password = passwordHash

usuario.save().then( result => {
    console.log('usuario guardado en la base de datos')
    mongoose.connection.close()
})