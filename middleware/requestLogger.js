const logger = require('../util/logger')

module.exports = ( request, response, next) => {
    logger.info( 'Metodo: ', request.method )
    logger.info( 'Path: ', request.path )
    logger.info( 'Body: ', request.body )
    logger.info( '---' )
    next()
}
