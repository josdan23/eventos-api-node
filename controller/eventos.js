const eventosRouter = require('express').Router()

const Evento = require('../model/eventos')
const Usuario = require('../model/usuario')
const autenticarUser = require('../middleware/autenticarUser')

eventosRouter.get('/', autenticarUser, async (request, response, next ) => {

    const idUsuario = request.idUsuario
    console.log(`Usuario id=${idUsuario} autenticado`)

    const eventos = await Evento.find({}).sort({fechas: 'asc'})
    response.json(eventos)
   
})

eventosRouter.get('/destacados', autenticarUser,  async (request, response) => {
    
    const idUsuario = request.idUsuario
    console.log(`Usuario id=${idUsuario} autenticado`)

    const eventos = await Evento.find({ 'destacado': true }).sort({fechas: 'asc'})
    response.json(eventos)
})

eventosRouter.get('/:id', async (request, response, next) => {

    let evento = null

    try {
        evento = await Evento.findById(request.params.id)
    } catch(e) {
        next(e)
    }
    if( !evento )
        return response.status(204).end()

    response.json(evento)

})

eventosRouter.post('/', autenticarUser, async (request, response) => {
    
    const idUsuario = request.idUsuario
    console.log(`Usuario id=${idUsuario} autenticado`)

    const body = request.body

    if (Object.keys(body).length === 0){
        return respuestaDeError( response, 400, 'No hay contenido')
    }
    
    if ( !body.titulo )
        return respuestaDeError( response, 400, 'No hay título')

    if ( !body.descripcion )
        return respuestaDeError( response, 400, 'No hay descripción')

    if( !body.lugar )
        return respuestaDeError( response, 400, 'No hay lugar')
        
    if ( !body.imagen )
        return respuestaDeError( response, 400, 'No hay imagen')

    if ( !body.fechas || body.fechas.length == 0 ) 
        return respuestaDeError( response, 400, 'No hay listado de fechas')

    for(let f of body.fechas) {

        if ( !f.fecha ) {
            return respuestaDeError( response, 400, 'No hay fecha establecida')
        }
        
        if ( !f.hora ) {
            return respuestaDeError( response, 400, 'No hay hora')
        }

        const fechaIngresada = new Date(Date.parse(f.fecha))

        if (isNaN(fechaIngresada))
             return respuestaDeError( response, 400, 'Fecha invalida. Formato YYYY-MM-DD')

        const horaYMinutoArray = f.hora.split(':')
    
        if (horaYMinutoArray[0] < 0 || horaYMinutoArray[0] > 24) {

            console.log(Number(horaYMinutoArray[0]))
            return respuestaDeError( response, 400, 'La hora ingresada no es valida')
        }

        if ( horaYMinutoArray[1] < 0 || horaYMinutoArray[1] > 59 ) {
            console.log(Number(horaYMinutoArray[1]))
            return respuestaDeError( response, 400, 'El minuto ingresado no es valida')
        }
    }

    const listadoDeFechas = body.fechas.map( f => {

        const fecha = new Date(Date.parse( f.fecha ))

        const horaYMinutoArray = f.hora.split(':')
  
        fecha.setUTCHours(Number(horaYMinutoArray[0]))
        fecha.setUTCMinutes (Number(horaYMinutoArray[1]))
        
        return fecha 
    })

    const user = await Usuario.findById(idUsuario)

    if ( !user )
        response.status(400).end()


    const evento = new Evento({
        titulo: body.titulo,
        descripcion: body.descripcion,
        fechas:  listadoDeFechas || [],
        lugar: body.lugar,
        destacado: body.destacado || false,
        imagen: body.imagen || null,
        usuario: user._id
    })

    const eventoGuardado = await evento.save()

    user.eventos = user.eventos.concat(eventoGuardado._id)
    await user.save()

    response.json(eventoGuardado)

})

eventosRouter.delete('/:id', async ( request, response ) => {
    
    await Evento.findByIdAndRemove(request.params.id)
    
    return response.status(204).end()

})



const respuestaDeError = (response, code, msg) => {

    return response.status(code).json ({
        error: msg
    })
}


module.exports = eventosRouter