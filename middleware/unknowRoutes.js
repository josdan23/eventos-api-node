const logger = require('../util/logger')

module.exports = ( request, response, next ) => {

    logger.info('Ruta no valida')

    response.status(404).send( {
        error: 'ruta desconocido'
    })

    next()
}