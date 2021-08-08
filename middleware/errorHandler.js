const logger = require('../util/logger')

module.exports = ( error, request, response, next ) => {
    logger.info( 'ERRORES OCURRIDOS')
    

    if ( error.name === 'CastError' ){
        response.status(400).send({
            error: 'id de evento invalida'
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