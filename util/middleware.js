const jwt = require('jsonwebtoken')
const logger = require('../util/logger')

const rutasDesconocidas = (request, response) => {
    logger.info('Ruta no valida')
    response.status(404).send( {
        error: 'endpoint desconocido'
    })
}

const requestLogger = ( request, response, next) => {
    logger.info( 'Metodo: ', request.method )
    logger.info( 'Path: ', request.path )
    logger.info( 'Body: ', request.body )
    logger.info( '---' )
    next()
}

const errorHandler = ( error, request, response, next ) => {

    console.log( 'ERRORES OCURRIDOS')
    console.log( error.message )

    if ( error.name === 'CastError' ){
        return response.status(400).send({
            error: 'id invalida'
        })
    } else if ( error.name === 'ValidationError') {
        return response.status(409).send({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'token invalido'
        })
    }
    next(error)

}


const getUsuarioIdLogeado = (request, response, next) => {

    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer') )
        return authorization.substring(7)

    const decodedToken =  jwt.verify(token, process.env.SECRET)


    if ( !token || !decodedToken.id ) {
        return response.status(401).json({
            error: 'token faltante o invalido'
        })
    }

    request.userId = decodedToken.id
    console.log( {id: request.userId} )
    next()
}

module.exports = {
    rutasDesconocidas,
    requestLogger,
    errorHandler,
    getUsuarioIdLogeado
}