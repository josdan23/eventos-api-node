const compartirRouter = require('express').Router()

const Evento = require('../model/eventos')
const autenticarUser = require('../middleware/autenticarUser')


compartirRouter.post('/:id', autenticarUser, async (request, response) => {

    const idUsuario = request.idUsuario
    console.log(`Usuario id=${idUsuario} autenticado`)

    const cuenta = request.body.cuenta
    if ( !cuenta )
        return response.status(400).json({
            msg: 'cuenta no especificada'
        })

    const evento = await Evento.findById(request.params.id)

    if( !evento )
        return response.status(204).end()

    response.json({
        compartido: true,
        idUsuario: idUsuario,
        idEvento: evento._id,
        cuenta
    })

})


module.exports = compartirRouter